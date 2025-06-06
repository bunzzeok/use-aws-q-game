import { CellState, GridType } from '../types';
import { isValidPlacement } from './sudokuGenerator';

/**
 * 자동 메모 기능 - 각 빈 셀에 가능한 숫자를 메모로 표시
 * @param grid 현재 게임 그리드
 * @returns 메모가 업데이트된 새 그리드
 */
export const generateAutoNotes = (grid: CellState[][]): CellState[][] => {
  // 그리드 복사
  const newGrid = JSON.parse(JSON.stringify(grid)) as CellState[][];
  
  // 현재 그리드의 값만 추출 (CellState[][] -> GridType)
  const valueGrid: GridType = grid.map(row => 
    row.map(cell => cell.value)
  );
  
  // 각 빈 셀에 대해 가능한 숫자 계산
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // 이미 값이 있는 셀은 건너뜀
      if (grid[row][col].value !== null) {
        newGrid[row][col].notes = [];
        continue;
      }
      
      // 이 셀에 가능한 숫자 찾기
      const possibleNumbers: number[] = [];
      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(valueGrid, row, col, num)) {
          possibleNumbers.push(num);
        }
      }
      
      // 메모 업데이트
      newGrid[row][col].notes = possibleNumbers;
    }
  }
  
  return newGrid;
};

/**
 * 숫자 입력 후 관련된 셀의 메모 업데이트
 * @param grid 현재 게임 그리드
 * @param row 입력된 셀의 행 인덱스
 * @param col 입력된 셀의 열 인덱스
 * @param value 입력된 값
 * @returns 메모가 업데이트된 새 그리드
 */
export const updateNotesAfterInput = (
  grid: CellState[][],
  row: number,
  col: number,
  value: number
): CellState[][] => {
  // 그리드 복사
  const newGrid = JSON.parse(JSON.stringify(grid)) as CellState[][];
  
  // 입력된 값이 없으면 아무것도 하지 않음
  if (value === null) return newGrid;
  
  // 같은 행의 메모에서 입력된 숫자 제거
  for (let c = 0; c < 9; c++) {
    if (c !== col && newGrid[row][c].value === null) {
      const noteIndex = newGrid[row][c].notes.indexOf(value);
      if (noteIndex !== -1) {
        newGrid[row][c].notes.splice(noteIndex, 1);
      }
    }
  }
  
  // 같은 열의 메모에서 입력된 숫자 제거
  for (let r = 0; r < 9; r++) {
    if (r !== row && newGrid[r][col].value === null) {
      const noteIndex = newGrid[r][col].notes.indexOf(value);
      if (noteIndex !== -1) {
        newGrid[r][col].notes.splice(noteIndex, 1);
      }
    }
  }
  
  // 같은 3x3 박스의 메모에서 입력된 숫자 제거
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && newGrid[r][c].value === null) {
        const noteIndex = newGrid[r][c].notes.indexOf(value);
        if (noteIndex !== -1) {
          newGrid[r][c].notes.splice(noteIndex, 1);
        }
      }
    }
  }
  
  return newGrid;
};
