// 스도쿠 게임에 필요한 타입 정의
export type CellValue = number | null;
export type GridType = CellValue[][];

// 난이도 레벨
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// 셀 상태
export interface CellState {
  value: CellValue;
  isInitial: boolean;
  isValid: boolean;
  notes: number[];
}

// 게임 상태
export interface GameState {
  grid: CellState[][];
  solution: GridType; // 정답 그리드 추가
  selectedCell: [number, number] | null;
  difficulty: Difficulty;
  isComplete: boolean;
  isFailed: boolean; // 게임 실패 상태 추가
  timer: number;
  errorCount: number; // 오답 횟수 추가
  hintsRemaining: number; // 남은 힌트 횟수 추가
  isPaused: boolean; // 일시정지 상태 추가
}
