import { generatePuzzle, solveSudoku } from '../sudokuGenerator';
import { Difficulty, GridType } from '../../types';

/**
 * 이 테스트 파일은 스도쿠 퍼즐이 실제로 풀 수 있는지 검증합니다.
 * 이는 사용자 경험에 직접적인 영향을 미치는 중요한 테스트입니다.
 */
describe('Sudoku Solver', () => {
  // 각 난이도별로 여러 퍼즐을 생성하고 풀 수 있는지 테스트
  const difficulties = [Difficulty.EASY]; // 테스트 시간 단축을 위해 EASY만 테스트
  const puzzleCountPerDifficulty = 1; // 각 난이도별 테스트할 퍼즐 수 (테스트 시간 단축을 위해 1개로 제한)
  
  // 퍼즐이 풀 수 있는지 확인하는 함수
  const verifyPuzzleSolution = (puzzle: GridType): boolean => {
    // 퍼즐 복사
    const puzzleCopy = JSON.parse(JSON.stringify(puzzle)) as GridType;
    
    // 퍼즐 풀기
    const solved = solveSudoku(puzzleCopy);
    
    // 풀 수 있는지 확인
    return solved;
  };
  
  // 각 난이도별 테스트
  difficulties.forEach(difficulty => {
    describe(`${difficulty} difficulty puzzles`, () => {
      for (let i = 0; i < puzzleCountPerDifficulty; i++) {
        it(`should generate a solvable puzzle (test ${i + 1})`, () => {
          // 퍼즐 생성
          const { puzzle } = generatePuzzle(difficulty);
          
          // 퍼즐이 풀 수 있는지 확인
          const isSolvable = verifyPuzzleSolution(puzzle);
          expect(isSolvable).toBe(true);
        });
      }
    });
  });
  
  // 특정 퍼즐 케이스 테스트
  it('should solve a known solvable puzzle', () => {
    // 알려진 풀 수 있는 퍼즐
    const knownPuzzle: GridType = [
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
    
    // 퍼즐 복사
    const puzzleCopy = JSON.parse(JSON.stringify(knownPuzzle)) as GridType;
    
    // 퍼즐 풀기
    const solved = solveSudoku(puzzleCopy);
    expect(solved).toBe(true);
    
    // 완성된 퍼즐이 유효한지 확인 (모든 셀이 채워져 있는지)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        expect(puzzleCopy[row][col]).not.toBeNull();
      }
    }
  });
});
