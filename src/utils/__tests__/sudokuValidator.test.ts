import { 
  isPuzzleComplete, 
  isValidSudoku, 
  isValidRow, 
  isValidColumn, 
  isValidBox,
  canPlaceNumber,
  findPossibleNumbers
} from '../sudokuValidator';
import { GridType } from '../../types';

describe('Sudoku Validator', () => {
  // 유효한 완성된 스도쿠
  const validCompleteSudoku: GridType = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];
  
  // 유효하지만 완성되지 않은 스도쿠
  const validIncompleteSudoku: GridType = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9]
  ];
  
  // 유효하지 않은 스도쿠 (행에 중복)
  const invalidRowSudoku: GridType = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 3] // 마지막 행에 3이 중복
  ];
  
  // 유효하지 않은 스도쿠 (열에 중복)
  const invalidColumnSudoku: GridType = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 9] // 마지막 열에 9가 중복
  ];
  
  // 유효하지 않은 스도쿠 (박스에 중복)
  const invalidBoxSudoku: GridType = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 5, 3, 4, 2, 5, 6, 7], // 세 번째 행, 세 번째 열에 5가 중복 (첫 번째 박스)
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];
  
  describe('isPuzzleComplete', () => {
    it('should return true for a valid complete sudoku', () => {
      expect(isPuzzleComplete(validCompleteSudoku)).toBe(true);
    });
    
    it('should return false for an incomplete sudoku', () => {
      expect(isPuzzleComplete(validIncompleteSudoku)).toBe(false);
    });
    
    it('should return false for an invalid sudoku', () => {
      expect(isPuzzleComplete(invalidRowSudoku)).toBe(false);
      expect(isPuzzleComplete(invalidColumnSudoku)).toBe(false);
      expect(isPuzzleComplete(invalidBoxSudoku)).toBe(false);
    });
  });
  
  describe('isValidSudoku', () => {
    it('should return true for a valid complete sudoku', () => {
      expect(isValidSudoku(validCompleteSudoku)).toBe(true);
    });
    
    it('should return true for a valid incomplete sudoku', () => {
      expect(isValidSudoku(validIncompleteSudoku)).toBe(true);
    });
    
    it('should return false for an invalid sudoku with row duplicates', () => {
      expect(isValidSudoku(invalidRowSudoku)).toBe(false);
    });
    
    it('should return false for an invalid sudoku with column duplicates', () => {
      expect(isValidSudoku(invalidColumnSudoku)).toBe(false);
    });
    
    it('should return false for an invalid sudoku with box duplicates', () => {
      expect(isValidSudoku(invalidBoxSudoku)).toBe(false);
    });
  });
  
  describe('isValidRow', () => {
    it('should return true for a valid row', () => {
      expect(isValidRow(validCompleteSudoku, 0)).toBe(true);
    });
    
    it('should return false for an invalid row with duplicates', () => {
      expect(isValidRow(invalidRowSudoku, 8)).toBe(false);
    });
  });
  
  describe('isValidColumn', () => {
    it('should return true for a valid column', () => {
      expect(isValidColumn(validCompleteSudoku, 0)).toBe(true);
    });
    
    it('should return false for an invalid column with duplicates', () => {
      // 마지막 열에 9가 중복되어 있음
      expect(isValidColumn(invalidColumnSudoku, 8)).toBe(false);
    });
  });
  
  describe('isValidBox', () => {
    it('should return true for a valid box', () => {
      expect(isValidBox(validCompleteSudoku, 0)).toBe(true);
    });
    
    it('should return false for an invalid box with duplicates', () => {
      expect(isValidBox(invalidBoxSudoku, 0)).toBe(false);
    });
  });
  
  describe('canPlaceNumber', () => {
    it('should return true when a number can be placed in a cell', () => {
      expect(canPlaceNumber(validIncompleteSudoku, 0, 2, 4)).toBe(true);
    });
    
    it('should return false when a number cannot be placed in a cell due to row conflict', () => {
      expect(canPlaceNumber(validIncompleteSudoku, 0, 2, 5)).toBe(false);
    });
    
    it('should return false when a number cannot be placed in a cell due to column conflict', () => {
      expect(canPlaceNumber(validIncompleteSudoku, 0, 2, 8)).toBe(false);
    });
    
    it('should return false when a number cannot be placed in a cell due to box conflict', () => {
      expect(canPlaceNumber(validIncompleteSudoku, 0, 2, 9)).toBe(false);
    });
  });
  
  describe('findPossibleNumbers', () => {
    it('should return all possible numbers for an empty cell', () => {
      const possibleNumbers = findPossibleNumbers(validIncompleteSudoku, 0, 2);
      expect(possibleNumbers).toContain(4);
      expect(possibleNumbers).not.toContain(5);
      expect(possibleNumbers).not.toContain(3);
    });
    
    it('should return an empty array for a filled cell', () => {
      expect(findPossibleNumbers(validIncompleteSudoku, 0, 0)).toEqual([]);
    });
  });
});
