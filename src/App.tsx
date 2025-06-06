import React, { useState } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import ThemeToggle from './components/ThemeToggle';
import HistoryControls from './components/HistoryControls';
import { CellState, Difficulty, GameState } from './types';
import { generatePuzzle } from './utils/sudokuGenerator';
import { generateAutoNotes, updateNotesAfterInput } from './utils/autoNotes';
import { gameHistory } from './utils/history/gameHistory';
import './styles/App.css';

const App: React.FC = () => {
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
    isPaused: false // 타이머 일시정지 상태 추가
  });
  
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [autoNotesEnabled, setAutoNotesEnabled] = useState<boolean>(false);

  // 게임 시작 함수
  const startGame = (difficulty: Difficulty) => {
    // 타이머 초기화
    if (timerInterval) {
      clearInterval(timerInterval);
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
    
    setGameState({
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
    });
    
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

  // 셀 클릭 핸들러
  const handleCellClick = (row: number, col: number) => {
    // 게임이 시작되지 않았거나 실패/완료 상태면 아무 동작 안함
    if (!gameStarted || gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    // 이미 채워진 초기 셀은 선택 불가
    if (gameState.grid[row][col].isInitial) {
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      selectedCell: [row, col]
    }));
  };

  // 숫자 입력 핸들러
  const handleNumberClick = (num: number) => {
    // 게임이 시작되지 않았거나 선택된 셀이 없거나 실패/완료 상태면 아무 동작 안함
    if (!gameStarted || !gameState.selectedCell || gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    const [row, col] = gameState.selectedCell;
    let newGrid = [...gameState.grid];
    
    // 히스토리에 현재 상태 저장
    const previousState = { ...newGrid[row][col] };
    
    // 메모 모드인 경우
    if (isNotesMode) {
      const currentNotes = [...newGrid[row][col].notes];
      const noteIndex = currentNotes.indexOf(num);
      
      if (noteIndex === -1) {
        // 노트에 숫자 추가
        currentNotes.push(num);
      } else {
        // 노트에서 숫자 제거
        currentNotes.splice(noteIndex, 1);
      }
      
      newGrid[row][col] = {
        ...newGrid[row][col],
        notes: currentNotes
      };
      
      // 히스토리에 액션 추가
      gameHistory.addAction({
        type: 'TOGGLE_NOTE',
        row,
        col,
        value: num,
        previousState
      });
      
      setGameState({
        ...gameState,
        grid: newGrid
      });
      
      return;
    }
    
    // 일반 모드: 숫자 입력
    // 입력한 숫자가 정답인지 확인
    const isCorrect = gameState.solution[row][col] === num;
    
    newGrid[row][col] = {
      ...newGrid[row][col],
      value: num,
      isValid: isCorrect,
      notes: []
    };
    
    // 히스토리에 액션 추가
    gameHistory.addAction({
      type: 'INPUT_NUMBER',
      row,
      col,
      value: num,
      previousState
    });
    
    // 자동 메모 활성화 상태라면 관련 셀의 메모 업데이트
    if (autoNotesEnabled && isCorrect) {
      newGrid = updateNotesAfterInput(newGrid, row, col, num);
    }
    
    let updatedErrorCount = gameState.errorCount;
    // 오답인 경우 오류 카운트 증가
    if (!isCorrect) {
      updatedErrorCount += 1;
    }
    
    // 게임 완료 여부 확인
    let isComplete = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        // 빈 셀이 있거나 오답이 있으면 완료되지 않음
        if (
          (r === row && c === col) ? !isCorrect : 
          (newGrid[r][c].value === null || !newGrid[r][c].isValid)
        ) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }
    
    // 게임 실패 여부 확인 (5번 이상 틀림)
    const isFailed = updatedErrorCount >= 5;
    
    // 게임 완료 또는 실패 시 타이머 정지
    if ((isComplete || isFailed) && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setGameState({
      ...gameState,
      grid: newGrid,
      isComplete,
      isFailed,
      errorCount: updatedErrorCount
    });
  };

  // 지우기 버튼 핸들러
  const handleEraseClick = () => {
    // 게임이 시작되지 않았거나 선택된 셀이 없거나 실패/완료 상태면 아무 동작 안함
    if (!gameStarted || !gameState.selectedCell || gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    const [row, col] = gameState.selectedCell;
    const newGrid = [...gameState.grid];
    
    // 초기 셀은 지울 수 없음
    if (newGrid[row][col].isInitial) return;
    
    // 히스토리에 현재 상태 저장
    const previousState = { ...newGrid[row][col] };
    
    // 자동 메모 활성화 상태라면 지운 셀에 가능한 숫자 메모 생성
    const updatedCell = {
      ...newGrid[row][col],
      value: null,
      isValid: true,
      notes: autoNotesEnabled ? [] : newGrid[row][col].notes
    };
    
    newGrid[row][col] = updatedCell;
    
    // 히스토리에 액션 추가
    gameHistory.addAction({
      type: 'ERASE',
      row,
      col,
      previousState
    });
    
    // 자동 메모 활성화 상태라면 지운 셀에 가능한 숫자 계산
    let updatedGrid = newGrid;
    if (autoNotesEnabled) {
      const possibleNumbers: number[] = [];
      
      for (let num = 1; num <= 9; num++) {
        let canPlace = true;
        
        // 같은 행에 같은 숫자가 있는지 확인
        for (let c = 0; c < 9; c++) {
          if (newGrid[row][c].value === num) {
            canPlace = false;
            break;
          }
        }
        
        // 같은 열에 같은 숫자가 있는지 확인
        if (canPlace) {
          for (let r = 0; r < 9; r++) {
            if (newGrid[r][col].value === num) {
              canPlace = false;
              break;
            }
          }
        }
        
        // 같은 3x3 박스에 같은 숫자가 있는지 확인
        if (canPlace) {
          const boxRow = Math.floor(row / 3) * 3;
          const boxCol = Math.floor(col / 3) * 3;
          
          for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
              if (newGrid[r][c].value === num) {
                canPlace = false;
                break;
              }
            }
            if (!canPlace) break;
          }
        }
        
        if (canPlace) {
          possibleNumbers.push(num);
        }
      }
      
      updatedGrid[row][col].notes = possibleNumbers;
    }
    
    setGameState({
      ...gameState,
      grid: updatedGrid
    });
  };

  // 메모 모드 토글
  const handleNotesToggle = () => {
    // 게임이 실패/완료 상태면 아무 동작 안함
    if (gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    setIsNotesMode(!isNotesMode);
  };

  // 힌트 버튼 핸들러
  const handleHintClick = () => {
    // 게임이 시작되지 않았거나 선택된 셀이 없거나 실패/완료 상태면 아무 동작 안함
    if (!gameStarted || !gameState.selectedCell || gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    // 힌트가 남아있지 않으면 아무 동작 안함
    if (gameState.hintsRemaining <= 0) return;
    
    const [row, col] = gameState.selectedCell;
    
    // 이미 채워진 셀에는 힌트를 제공하지 않음
    if (gameState.grid[row][col].value !== null) return;
    
    // 솔루션에서 정답 가져오기
    const correctValue = gameState.solution[row][col];
    
    if (correctValue !== null) {
      // 히스토리에 현재 상태 저장
      const previousState = { ...gameState.grid[row][col] };
      
      let newGrid = [...gameState.grid];
      newGrid[row][col] = {
        ...newGrid[row][col],
        value: correctValue,
        isValid: true,
        notes: []
      };
      
      // 히스토리에 액션 추가
      gameHistory.addAction({
        type: 'USE_HINT',
        row,
        col,
        value: correctValue,
        previousState
      });
      
      // 자동 메모 활성화 상태라면 관련 셀의 메모 업데이트
      if (autoNotesEnabled) {
        newGrid = updateNotesAfterInput(newGrid, row, col, correctValue);
      }
      
      // 게임 완료 여부 확인
      let isComplete = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (
            (r === row && c === col) ? false : 
            (newGrid[r][c].value === null || !newGrid[r][c].isValid)
          ) {
            isComplete = false;
            break;
          }
        }
        if (!isComplete) break;
      }
      
      // 게임 완료 시 타이머 정지
      if (isComplete && timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      setGameState({
        ...gameState,
        grid: newGrid,
        hintsRemaining: gameState.hintsRemaining - 1,
        isComplete
      });
    }
  };

  // 실행 취소 핸들러
  const handleUndo = () => {
    if (!gameStarted || gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    if (gameHistory.canUndo()) {
      const updatedGameState = gameHistory.undo(gameState);
      setGameState(updatedGameState);
    }
  };
  
  // 다시 실행 핸들러
  const handleRedo = () => {
    if (!gameStarted || gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    if (gameHistory.canRedo()) {
      const updatedGameState = gameHistory.redo(gameState);
      setGameState(updatedGameState);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>스도쿠 게임</h1>
        <ThemeToggle />
      </header>
      
      <div className="game-container">
        {!gameStarted ? (
          <div className="start-screen">
            <h2>난이도를 선택하고 게임을 시작하세요</h2>
            <div className="difficulty-buttons">
              <button onClick={() => startGame(Difficulty.EASY)}>쉬움 (힌트 5개)</button>
              <button onClick={() => startGame(Difficulty.MEDIUM)}>중간 (힌트 3개)</button>
              <button onClick={() => startGame(Difficulty.HARD)}>어려움 (힌트 1개)</button>
            </div>
            <div className="options">
              <label className="auto-notes-toggle">
                <input
                  type="checkbox"
                  checked={autoNotesEnabled}
                  onChange={toggleAutoNotes}
                />
                자동 메모 활성화
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className="game-info">
              <div className="timer">시간: {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}</div>
              <div className="error-count">오답: {gameState.errorCount}/5</div>
              <div className="hints-remaining">남은 힌트: {gameState.hintsRemaining}</div>
            </div>
            
            <div className="game-controls">
              <button onClick={togglePause}>
                {gameState.isPaused ? '게임 재개' : '일시정지'}
              </button>
              <button onClick={toggleAutoNotes}>
                {autoNotesEnabled ? '자동 메모 끄기' : '자동 메모 켜기'}
              </button>
            </div>
            
            {gameState.isPaused ? (
              <div className="message">
                게임이 일시정지되었습니다. '게임 재개' 버튼을 클릭하여 계속하세요.
              </div>
            ) : (
              <Grid
                grid={gameState.grid}
                selectedCell={gameState.selectedCell}
                onCellClick={handleCellClick}
              />
            )}
            
            {gameState.isComplete && (
              <div className="message success-message">
                축하합니다! 스도쿠를 완성했습니다!
              </div>
            )}
            
            {gameState.isFailed && (
              <div className="message fail-message">
                게임 오버! 5번 이상 틀렸습니다.
              </div>
            )}
            
            <Controls
              onNewGame={startGame}
              onNumberClick={handleNumberClick}
              onEraseClick={handleEraseClick}
              onNotesToggle={handleNotesToggle}
              onHintClick={handleHintClick}
              isNotesMode={isNotesMode}
              timer={gameState.timer}
              hintsRemaining={gameState.hintsRemaining}
              isGameOver={gameState.isComplete || gameState.isFailed}
              isPaused={gameState.isPaused}
            />
            
            <HistoryControls
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={gameHistory.canUndo()}
              canRedo={gameHistory.canRedo()}
              isGameOver={gameState.isComplete || gameState.isFailed}
              isPaused={gameState.isPaused}
            />
            
            {(gameState.isComplete || gameState.isFailed) && (
              <button className="new-game-button" onClick={() => startGame(gameState.difficulty)}>
                새 게임 시작
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
