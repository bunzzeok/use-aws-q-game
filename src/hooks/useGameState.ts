import { useState, useEffect } from 'react';
import { CellState, Difficulty, GameState } from '../types';
import { generatePuzzle } from '../utils/sudokuGenerator';
import { generateAutoNotes } from '../utils/autoNotes';
import { gameHistory } from '../utils/history/gameHistory';
import { GameStorage } from '../utils/storage/gameStorage';

/**
 * 게임 상태 관리 커스텀 훅
 */
export const useGameState = () => {
  // 빈 9x9 그리드 생성
  const createEmptyGameGrid = (): CellState[][] => {
    return Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => ({
        value: null,
        isInitial: false,
        isValid: true,
        notes: []
      }))
    );
  };

  // 게임 상태
  const [gameState, setGameState] = useState<GameState>({
    grid: createEmptyGameGrid(),
    solution: [], // 빈 솔루션 초기화
    selectedCell: null,
    difficulty: Difficulty.EASY,
    isComplete: false,
    isFailed: false,
    timer: 0,
    errorCount: 0,
    hintsRemaining: 3, // 기본 힌트 3개
    isPaused: false // 타이머 일시정지 상태
  });
  
  // 게임 설정 상태
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [autoNotesEnabled, setAutoNotesEnabled] = useState<boolean>(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  
  // 모달 상태
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  const [showAutoSaveModal, setShowAutoSaveModal] = useState<boolean>(false);

  // 컴포넌트 마운트 시 자동 저장된 게임 확인
  useEffect(() => {
    checkAutoSavedGame();
    return () => {
      // 컴포넌트 언마운트 시 타이머 및 자동 저장 인터벌 정리
      if (timerInterval) clearInterval(timerInterval);
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    };
  }, []);

  // 자동 저장된 게임 확인
  const checkAutoSavedGame = () => {
    const autoSavedGame = GameStorage.loadAutoSavedGame();
    if (autoSavedGame) {
      setShowAutoSaveModal(true);
    }
  };

  // 게임 시작 함수
  const startGame = (difficulty: Difficulty) => {
    // 타이머 초기화
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // 자동 저장 인터벌 초기화
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
    }
    
    // 히스토리 초기화
    gameHistory.clear();
    
    // 새 퍼즐 생성 (검증된 퍼즐과 솔루션)
    const { puzzle, solution } = generatePuzzle(difficulty);
    
    // 난이도에 따른 힌트 개수 설정
    let hintsRemaining: number;
    switch (difficulty) {
      case Difficulty.EASY:
        hintsRemaining = 5;
        break;
      case Difficulty.MEDIUM:
        hintsRemaining = 3;
        break;
      case Difficulty.HARD:
        hintsRemaining = 1;
        break;
      default:
        hintsRemaining = 3;
    }
    
    // 게임 상태 초기화
    const initialGrid: CellState[][] = puzzle.map(row => 
      row.map(value => ({
        value,
        isInitial: value !== null,
        isValid: true,
        notes: []
      }))
    );
    
    // 자동 메모 활성화 상태라면 메모 생성
    const gridWithNotes = autoNotesEnabled ? generateAutoNotes(initialGrid) : initialGrid;
    
    const newGameState = {
      grid: gridWithNotes,
      solution: solution,
      selectedCell: null,
      difficulty,
      isComplete: false,
      isFailed: false,
      timer: 0,
      errorCount: 0,
      hintsRemaining,
      isPaused: false
    };
    
    setGameState(newGameState);
    
    // 타이머 시작
    const interval = setInterval(() => {
      setGameState(prev => {
        // 일시정지 상태면 타이머 증가하지 않음
        if (prev.isPaused) return prev;
        return {
          ...prev,
          timer: prev.timer + 1
        };
      });
    }, 1000);
    
    setTimerInterval(interval);
    
    // 자동 저장 인터벌 설정 (2분마다)
    const saveInterval = setInterval(() => {
      setGameState(prev => {
        if (!prev.isComplete && !prev.isFailed) {
          GameStorage.saveGame(prev, autoNotesEnabled, undefined, true);
        }
        return prev;
      });
    }, 120000);
    
    setAutoSaveInterval(saveInterval);
    setGameStarted(true);
  };

  // 타이머 일시정지/재개 토글
  const togglePause = () => {
    if (!gameStarted || gameState.isComplete || gameState.isFailed) return;
    
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  // 자동 메모 토글
  const toggleAutoNotes = () => {
    const newAutoNotesEnabled = !autoNotesEnabled;
    setAutoNotesEnabled(newAutoNotesEnabled);
    
    // 게임이 시작된 상태라면 현재 그리드에 자동 메모 적용/제거
    if (gameStarted && !gameState.isComplete && !gameState.isFailed) {
      if (newAutoNotesEnabled) {
        // 자동 메모 활성화
        setGameState(prev => ({
          ...prev,
          grid: generateAutoNotes(prev.grid)
        }));
      } else {
        // 자동 메모 비활성화 - 사용자가 직접 입력한 메모는 유지
        const newGrid = gameState.grid.map(row => 
          row.map(cell => ({
            ...cell,
            notes: cell.value === null && !cell.isInitial ? [] : cell.notes
          }))
        );
        
        setGameState(prev => ({
          ...prev,
          grid: newGrid
        }));
      }
    }
  };

  // 메모 모드 토글
  const handleNotesToggle = () => {
    // 게임이 실패/완료 상태면 아무 동작 안함
    if (gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    setIsNotesMode(!isNotesMode);
  };

  return {
    gameState,
    setGameState,
    isNotesMode,
    setIsNotesMode,
    timerInterval,
    setTimerInterval,
    gameStarted,
    setGameStarted,
    autoNotesEnabled,
    setAutoNotesEnabled,
    showSaveModal,
    setShowSaveModal,
    showLoadModal,
    setShowLoadModal,
    showAutoSaveModal,
    setShowAutoSaveModal,
    autoSaveInterval,
    setAutoSaveInterval,
    startGame,
    togglePause,
    toggleAutoNotes,
    handleNotesToggle,
    createEmptyGameGrid
  };
};
