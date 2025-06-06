import { CellState, GameState } from '../../types';

/**
 * 게임 히스토리 관리를 위한 타입 정의
 */
export interface GameAction {
  type: 'INPUT_NUMBER' | 'ERASE' | 'TOGGLE_NOTE' | 'USE_HINT';
  row: number;
  col: number;
  value?: number;
  previousState: CellState;
}

/**
 * 게임 히스토리 관리 클래스
 * 실행 취소(undo)와 다시 실행(redo) 기능을 제공
 */
export class GameHistory {
  private undoStack: GameAction[] = [];
  private redoStack: GameAction[] = [];
  
  /**
   * 새로운 액션을 히스토리에 추가
   * @param action 게임 액션 객체
   */
  addAction(action: GameAction): void {
    this.undoStack.push(action);
    // 새 액션이 추가되면 redo 스택은 초기화
    this.redoStack = [];
  }
  
  /**
   * 실행 취소 가능 여부 확인
   * @returns 실행 취소 가능 여부
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  
  /**
   * 다시 실행 가능 여부 확인
   * @returns 다시 실행 가능 여부
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  
  /**
   * 마지막 액션 실행 취소
   * @param gameState 현재 게임 상태
   * @returns 업데이트된 게임 상태
   */
  undo(gameState: GameState): GameState {
    if (!this.canUndo()) return gameState;
    
    const lastAction = this.undoStack.pop()!;
    this.redoStack.push(lastAction);
    
    // 그리드 복사
    const newGrid = gameState.grid.map(row => [...row]);
    
    // 이전 상태로 셀 복원
    newGrid[lastAction.row][lastAction.col] = { ...lastAction.previousState };
    
    return {
      ...gameState,
      grid: newGrid
    };
  }
  
  /**
   * 마지막으로 취소한 액션 다시 실행
   * @param gameState 현재 게임 상태
   * @returns 업데이트된 게임 상태
   */
  redo(gameState: GameState): GameState {
    if (!this.canRedo()) return gameState;
    
    const nextAction = this.redoStack.pop()!;
    this.undoStack.push(nextAction);
    
    // 그리드 복사
    const newGrid = gameState.grid.map(row => [...row]);
    
    // 액션 타입에 따라 셀 상태 업데이트
    switch (nextAction.type) {
      case 'INPUT_NUMBER':
        if (nextAction.value !== undefined) {
          newGrid[nextAction.row][nextAction.col] = {
            ...newGrid[nextAction.row][nextAction.col],
            value: nextAction.value,
            notes: []
          };
        }
        break;
      case 'ERASE':
        newGrid[nextAction.row][nextAction.col] = {
          ...newGrid[nextAction.row][nextAction.col],
          value: null,
          isValid: true
        };
        break;
      case 'TOGGLE_NOTE':
        if (nextAction.value !== undefined) {
          const currentNotes = [...newGrid[nextAction.row][nextAction.col].notes];
          const noteIndex = currentNotes.indexOf(nextAction.value);
          
          if (noteIndex === -1) {
            currentNotes.push(nextAction.value);
          } else {
            currentNotes.splice(noteIndex, 1);
          }
          
          newGrid[nextAction.row][nextAction.col] = {
            ...newGrid[nextAction.row][nextAction.col],
            notes: currentNotes
          };
        }
        break;
      case 'USE_HINT':
        if (nextAction.value !== undefined) {
          newGrid[nextAction.row][nextAction.col] = {
            ...newGrid[nextAction.row][nextAction.col],
            value: nextAction.value,
            isValid: true,
            notes: []
          };
        }
        break;
    }
    
    return {
      ...gameState,
      grid: newGrid
    };
  }
  
  /**
   * 히스토리 초기화
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// 싱글톤 인스턴스 생성
export const gameHistory = new GameHistory();
