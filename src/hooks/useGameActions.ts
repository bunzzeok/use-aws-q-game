import { GameState } from '../types';
import { updateNotesAfterInput } from '../utils/autoNotes';
import { gameHistory } from '../utils/history/gameHistory';

/**
 * 게임 액션 관리 커스텀 훅
 */
export const useGameActions = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  gameStarted: boolean,
  isNotesMode: boolean,
  autoNotesEnabled: boolean,
  timerInterval: NodeJS.Timeout | null,
  setTimerInterval: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>
) => {
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
    if (gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    if (gameHistory.canUndo()) {
      const updatedGameState = gameHistory.undo(gameState);
      setGameState(updatedGameState);
    }
  };
  
  // 다시 실행 핸들러
  const handleRedo = () => {
    if (gameState.isComplete || gameState.isFailed || gameState.isPaused) return;
    
    if (gameHistory.canRedo()) {
      const updatedGameState = gameHistory.redo(gameState);
      setGameState(updatedGameState);
    }
  };

  return {
    handleCellClick,
    handleNumberClick,
    handleEraseClick,
    handleHintClick,
    handleUndo,
    handleRedo
  };
};
