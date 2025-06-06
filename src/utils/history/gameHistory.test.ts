import { GameHistory, GameAction } from './gameHistory';
import { CellState, GameState, Difficulty } from '../../types';

describe('GameHistory', () => {
  let gameHistory: GameHistory;
  let mockGameState: GameState;
  let mockPreviousState: CellState;
  
  beforeEach(() => {
    // 게임 히스토리 인스턴스 생성
    gameHistory = new GameHistory();
    
    // 테스트용 이전 셀 상태
    mockPreviousState = {
      value: null,
      isInitial: false,
      isValid: true,
      notes: [1, 2, 3]
    };
    
    // 테스트용 게임 상태 생성
    mockGameState = {
      grid: Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => ({
          value: null,
          isInitial: false,
          isValid: true,
          notes: []
        }))
      ),
      solution: Array(9).fill(null).map(() => Array(9).fill(5)),
      selectedCell: [0, 0],
      difficulty: Difficulty.EASY,
      isComplete: false,
      isFailed: false,
      timer: 0,
      errorCount: 0,
      hintsRemaining: 3,
      isPaused: false
    };
    
    // 테스트 셀에 메모 추가
    mockGameState.grid[0][0].notes = [1, 2, 3];
  });
  
  test('초기 상태에서는 실행 취소/다시 실행이 불가능해야 함', () => {
    expect(gameHistory.canUndo()).toBe(false);
    expect(gameHistory.canRedo()).toBe(false);
  });
  
  test('액션 추가 후 실행 취소가 가능해야 함', () => {
    const action: GameAction = {
      type: 'INPUT_NUMBER',
      row: 0,
      col: 0,
      value: 5,
      previousState: mockPreviousState
    };
    
    gameHistory.addAction(action);
    expect(gameHistory.canUndo()).toBe(true);
    expect(gameHistory.canRedo()).toBe(false);
  });
  
  test('실행 취소 후 다시 실행이 가능해야 함', () => {
    const action: GameAction = {
      type: 'INPUT_NUMBER',
      row: 0,
      col: 0,
      value: 5,
      previousState: mockPreviousState
    };
    
    gameHistory.addAction(action);
    gameHistory.undo(mockGameState);
    
    expect(gameHistory.canUndo()).toBe(false);
    expect(gameHistory.canRedo()).toBe(true);
  });
  
  test('실행 취소 시 이전 상태로 복원되어야 함', () => {
    // 숫자 입력 액션 추가
    const action: GameAction = {
      type: 'INPUT_NUMBER',
      row: 0,
      col: 0,
      value: 5,
      previousState: mockPreviousState
    };
    
    // 현재 상태 설정 (숫자 5 입력된 상태)
    mockGameState.grid[0][0] = {
      value: 5,
      isInitial: false,
      isValid: true,
      notes: []
    };
    
    gameHistory.addAction(action);
    const updatedState = gameHistory.undo(mockGameState);
    
    // 실행 취소 후 이전 상태(메모만 있고 값은 없는 상태)로 복원되었는지 확인
    expect(updatedState.grid[0][0].value).toBeNull();
    expect(updatedState.grid[0][0].notes).toEqual([1, 2, 3]);
  });
  
  test('다시 실행 시 원래 상태로 복원되어야 함', () => {
    // 숫자 입력 액션 추가
    const action: GameAction = {
      type: 'INPUT_NUMBER',
      row: 0,
      col: 0,
      value: 5,
      previousState: mockPreviousState
    };
    
    gameHistory.addAction(action);
    
    // 실행 취소
    let updatedState = gameHistory.undo(mockGameState);
    
    // 다시 실행
    updatedState = gameHistory.redo(updatedState);
    
    // 다시 실행 후 원래 상태(숫자 5가 입력된 상태)로 복원되었는지 확인
    expect(updatedState.grid[0][0].value).toBe(5);
    expect(updatedState.grid[0][0].notes).toEqual([]);
  });
  
  test('clear() 호출 시 모든 히스토리가 초기화되어야 함', () => {
    const action: GameAction = {
      type: 'INPUT_NUMBER',
      row: 0,
      col: 0,
      value: 5,
      previousState: mockPreviousState
    };
    
    gameHistory.addAction(action);
    gameHistory.undo(mockGameState);
    
    expect(gameHistory.canUndo()).toBe(false);
    expect(gameHistory.canRedo()).toBe(true);
    
    gameHistory.clear();
    
    expect(gameHistory.canUndo()).toBe(false);
    expect(gameHistory.canRedo()).toBe(false);
  });
  
  test('새 액션 추가 시 redo 스택이 초기화되어야 함', () => {
    // 첫 번째 액션 추가
    const action1: GameAction = {
      type: 'INPUT_NUMBER',
      row: 0,
      col: 0,
      value: 5,
      previousState: mockPreviousState
    };
    
    gameHistory.addAction(action1);
    gameHistory.undo(mockGameState);
    
    expect(gameHistory.canRedo()).toBe(true);
    
    // 새 액션 추가
    const action2: GameAction = {
      type: 'INPUT_NUMBER',
      row: 1,
      col: 1,
      value: 7,
      previousState: mockPreviousState
    };
    
    gameHistory.addAction(action2);
    
    // redo 스택이 초기화되었는지 확인
    expect(gameHistory.canRedo()).toBe(false);
  });
});
