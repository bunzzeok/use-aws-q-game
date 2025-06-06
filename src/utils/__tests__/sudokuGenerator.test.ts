import { 
  createEmptyGrid, 
  generateSolution, 
  generatePuzzle, 
  isValidPlacement, 
  isValidSudoku,
  solveSudoku
} from '../sudokuGenerator';
import { Difficulty } from '../../types';

describe('Sudoku Generator', () => {
  describe('createEmptyGrid', () => {
    it('should create a 9x9 grid filled with null values', () => {
      const grid = createEmptyGrid();
      
      // 9x9 크기 확인
      expect(grid.length).toBe(9);
      grid.forEach(row => {
        expect(row.length).toBe(9);
      });
      
      // 모든 값이 null인지 확인
      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeNull();
        });
      });
    });
  });
  
  describe('generateSolution', () => {
    it('should generate a valid complete sudoku solution', () => {
      const solution = generateSolution();
      
      // 9x9 크기 확인
      expect(solution.length).toBe(9);
      
      // 모든 셀이 1-9 사이의 숫자인지 확인
      solution.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
      
      // 유효한 스도쿠인지 확인
      expect(isValidSudoku(solution)).toBe(true);
    });
    
    it('should generate different solutions on multiple calls', () => {
      const solution1 = generateSolution();
      const solution2 = generateSolution();
      
      // 두 솔루션이 완전히 동일할 확률은 매우 낮음
      let isDifferent = false;
      
      outerLoop: for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (solution1[i][j] !== solution2[i][j]) {
            isDifferent = true;
            break outerLoop;
          }
        }
      }
      
      expect(isDifferent).toBe(true);
    });
  });
  
  describe('generatePuzzle', () => {
    it('should generate a puzzle with the correct number of empty cells based on difficulty', () => {
      // 각 난이도별 테스트
      const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
      const expectedEmptyCells = {
        [Difficulty.EASY]: 35,
        [Difficulty.MEDIUM]: 45,
        [Difficulty.HARD]: 55
      };
      
      difficulties.forEach(difficulty => {
        const { puzzle } = generatePuzzle(difficulty);
        
        // 빈 셀 개수 계산
        let emptyCellCount = 0;
        puzzle.forEach(row => {
          row.forEach(cell => {
            if (cell === null) emptyCellCount++;
          });
        });
        
        // 난이도에 따른 빈 셀 개수는 약간의 오차가 있을 수 있음 (유일해 검증 과정에서)
        // 따라서 정확한 수치보다는 범위로 체크
        expect(emptyCellCount).toBeGreaterThanOrEqual(expectedEmptyCells[difficulty] - 5);
        expect(emptyCellCount).toBeLessThanOrEqual(expectedEmptyCells[difficulty] + 5);
      });
    });
    
    it('should generate a puzzle with a valid solution', () => {
      const { puzzle, solution } = generatePuzzle(Difficulty.MEDIUM);
      
      // 퍼즐의 초기값이 솔루션과 일치하는지 확인
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle[i][j] !== null) {
            expect(puzzle[i][j]).toBe(solution[i][j]);
          }
        }
      }
      
      // 솔루션이 유효한 스도쿠인지 확인
      expect(isValidSudoku(solution)).toBe(true);
    });
  });
  
  describe('isValidPlacement', () => {
    it('should correctly validate cell placements', () => {
      const grid = [
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
      
      // 유효한 배치
      expect(isValidPlacement(grid, 0, 2, 1)).toBe(true);
      expect(isValidPlacement(grid, 0, 2, 2)).toBe(true);
      expect(isValidPlacement(grid, 0, 2, 4)).toBe(true);
      
      // 행에 이미 존재하는 숫자
      expect(isValidPlacement(grid, 0, 2, 3)).toBe(false); // 3은 이미 행에 있음
      expect(isValidPlacement(grid, 0, 2, 5)).toBe(false); // 5는 이미 행에 있음
      expect(isValidPlacement(grid, 0, 2, 7)).toBe(false); // 7은 이미 행에 있음
      
      // 열에 이미 존재하는 숫자
      expect(isValidPlacement(grid, 0, 2, 8)).toBe(false);
      
      // 3x3 박스에 이미 존재하는 숫자
      expect(isValidPlacement(grid, 0, 2, 9)).toBe(false);
    });
  });
});
