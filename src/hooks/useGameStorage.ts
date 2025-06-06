import { GameState } from '../types/index';
import { GameStorage } from '../utils/storage/gameStorage';

/**
 * 게임 저장 및 불러오기 관리 커스텀 훅
 */
export const useGameStorage = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  gameStarted: boolean,
  autoNotesEnabled: boolean,
  setAutoNotesEnabled: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>,
  setShowLoadModal: React.Dispatch<React.SetStateAction<boolean>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  timerInterval: NodeJS.Timeout | null,
  setTimerInterval: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>,
  autoSaveInterval: NodeJS.Timeout | null,
  setAutoSaveInterval: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>
) => {
  // 게임 저장 모달 표시
  const handleShowSaveModal = () => {
    if (!gameStarted || gameState.isComplete || gameState.isFailed) return;
    setShowSaveModal(true);
  };

  // 게임 불러오기 모달 표시
  const handleShowLoadModal = () => {
    setShowLoadModal(true);
  };

  // 게임 저장
  const handleSaveGame = (id: string) => {
    setShowSaveModal(false);
    // 저장 성공 메시지 표시 등의 추가 작업 가능
  };

  // 게임 불러오기
  const handleLoadGame = (id: string) => {
    setShowLoadModal(false);
    
    const savedGame = GameStorage.loadGame(id);
    if (!savedGame) return;
    
    // 타이머 및 자동 저장 인터벌 초기화
    if (timerInterval) clearInterval(timerInterval);
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    // 저장된 게임 상태 복원
    const loadedGameState: GameState = {
      grid: savedGame.grid,
      initialGrid: savedGame.initialGrid,
      solution: savedGame.solution,
      selectedCell: null,
      difficulty: savedGame.difficulty,
      isComplete: false,
      isFailed: false,
      timer: savedGame.timer,
      errorCount: savedGame.errorCount,
      hintsRemaining: savedGame.hintsRemaining,
      isPaused: false
    };
    
    setGameState(loadedGameState);
    setAutoNotesEnabled(savedGame.autoNotesEnabled);
    
    // 타이머 재시작
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.isPaused) return prev;
        return {
          ...prev,
          timer: prev.timer + 1
        };
      });
    }, 1000);
    
    setTimerInterval(interval);
    
    // 자동 저장 인터벌 재설정
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

  // 게임 삭제
  const handleDeleteGame = (id: string) => {
    GameStorage.deleteGame(id);
    // 삭제 후 모달 내용 갱신을 위해 모달을 닫았다가 다시 열기
    setShowLoadModal(false);
    setTimeout(() => setShowLoadModal(true), 100);
  };

  // 자동 저장된 게임 불러오기
  const handleLoadAutoSavedGame = () => {
    handleLoadGame('auto');
  };

  return {
    handleShowSaveModal,
    handleShowLoadModal,
    handleSaveGame,
    handleLoadGame,
    handleDeleteGame,
    handleLoadAutoSavedGame
  };
};
