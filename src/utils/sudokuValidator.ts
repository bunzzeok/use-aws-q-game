import { GridType } from '../types';

/**
 * 스도쿠 퍼즐이 현재 상태에서 유효한지 검증하는 유틸리티 함수들
 */

// 스도쿠 퍼즐이 완성되었는지 확인
export const isPuzzleComplete = (grid: GridType): boolean => {
  // 모든 셀이 채워져 있고 유효한지 확인
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return false;
      }
    }
  }
  
  // 모든 행, 열, 박스가 유효한지 확인
  return isValidSudoku(grid);
};

// 스도쿠 퍼즐이 유효한지 확인
export const isValidSudoku = (grid: GridType): boolean => {
  // 모든 행 확인
  for (let row = 0; row < 9; row++) {
    if (!isValidRow(grid, row)) {
      return false;
    }
  }
  
  // 모든 열 확인
  for (let col = 0; col < 9; col++) {
    if (!isValidColumn(grid, col)) {
      return false;
    }
  }
  
  // 모든 3x3 박스 확인
  for (let box = 0; box < 9; box++) {
    if (!isValidBox(grid, box)) {
      return false;
    }
  }
  
  return true;
};

// 행이 유효한지 확인
export const isValidRow = (grid: GridType, row: number): boolean => {
  const seen = new Set<number>();
  for (let col = 0; col < 9; col++) {
    const value = grid[row][col];
    if (value !== null) {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
    }
  }
  return true;
};

// 열이 유효한지 확인
export const isValidColumn = (grid: GridType, col: number): boolean => {
  const seen = new Set<number>();
  for (let row = 0; row < 9; row++) {
    const value = grid[row][col];
    if (value !== null) {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
    }
  }
  return true;
};

// 3x3 박스가 유효한지 확인
export const isValidBox = (grid: GridType, box: number): boolean => {
  const seen = new Set<number>();
  const boxRow = Math.floor(box / 3) * 3;
  const boxCol = (box % 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const value = grid[boxRow + i][boxCol + j];
      if (value !== null) {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }
  }
  return true;
};

// 특정 셀에 숫자를 놓을 수 있는지 확인
export const canPlaceNumber = (grid: GridType, row: number, col: number, num: number): boolean => {
  // 이미 같은 행에 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }
  
  // 이미 같은 열에 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }
  
  // 이미 같은 3x3 박스에 숫자가 있는지 확인
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
};

// 특정 셀에 가능한 모든 숫자 찾기
export const findPossibleNumbers = (grid: GridType, row: number, col: number): number[] => {
  if (grid[row][col] !== null) {
    return [];
  }
  
  const possibleNumbers: number[] = [];
  
  for (let num = 1; num <= 9; num++) {
    if (canPlaceNumber(grid, row, col, num)) {
      possibleNumbers.push(num);
    }
  }
  
  return possibleNumbers;
};
