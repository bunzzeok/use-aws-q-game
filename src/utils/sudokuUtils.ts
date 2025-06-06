import { CellState } from '../types/index';

/**
 * 스도쿠 그리드에서 사용된 숫자들을 반환합니다.
 * @param grid 스도쿠 그리드
 * @returns 사용된 숫자들의 배열
 */
export const getUsedNumbers = (grid: CellState[][]): number[] => {
  const usedNumbers: number[] = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = grid[row][col].value;
      if (value !== 0 && value !== null) {
        usedNumbers.push(value);
      }
    }
  }
  
  return usedNumbers;
};

/**
 * 특정 위치의 셀이 초기 셀인지 확인합니다.
 * @param initialGrid 초기 그리드
 * @param row 행 인덱스
 * @param col 열 인덱스
 * @returns 초기 셀 여부
 */
export const isInitialCell = (initialGrid: CellState[][], row: number, col: number): boolean => {
  return initialGrid[row][col].isInitial;
};

/**
 * 특정 위치의 셀이 유효한지 확인합니다.
 * @param grid 스도쿠 그리드
 * @param row 행 인덱스
 * @param col 열 인덱스
 * @param value 확인할 값
 * @returns 유효한 셀 여부
 */
export const isValidCell = (grid: CellState[][], row: number, col: number, value: number): boolean => {
  // 행 검사
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c].value === value) {
      return false;
    }
  }
  
  // 열 검사
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col].value === value) {
      return false;
    }
  }
  
  // 3x3 박스 검사
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c].value === value) {
        return false;
      }
    }
  }
  
  return true;
};
