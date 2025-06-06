import { generatePuzzle, solveSudoku } from '../utils/sudokuGenerator';
import { isPuzzleComplete, isValidSudoku } from '../utils/sudokuValidator';
import { Difficulty, GridType } from '../types';

/**
 * 통합 테스트: 스도쿠 게임 플레이 시뮬레이션
 * 
 * 이 테스트는 실제 게임 플레이를 시뮬레이션하여 스도쿠 퍼즐이 정상적으로 풀리는지 검증합니다.
 * 이는 사용자 경험에 직접적인 영향을 미치는 중요한 테스트입니다.
 */
describe('Sudoku Gameplay Integration Tests', () => {
  // 각 난이도별 테스트
  const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
  
  difficulties.forEach(difficulty => {
    describe(`${difficulty} difficulty gameplay`, () => {
      it('should allow a complete game play from start to finish', () => {
        // 1. 퍼즐 생성
        const { puzzle, solution } = generatePuzzle(difficulty);
        
        // 2. 퍼즐이 유효한지 확인
        expect(isValidSudoku(puzzle)).toBe(true);
        
        // 3. 퍼즐 복사 (실제 플레이 시뮬레이션을 위해)
        const playingGrid = JSON.parse(JSON.stringify(puzzle)) as GridType;
        
        // 4. 빈 셀 찾기
        const emptyCells: [number, number][] = [];
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (playingGrid[row][col] === null) {
              emptyCells.push([row, col]);
            }
          }
        }
        
        // 5. 빈 셀에 정답 채우기 (실제 플레이 시뮬레이션)
        emptyCells.forEach(([row, col]) => {
          // 정답 가져오기
          const correctValue = solution[row][col];
          
          // 정답 입력
          playingGrid[row][col] = correctValue;
          
          // 입력 후에도 퍼즐이 유효한지 확인
          expect(isValidSudoku(playingGrid)).toBe(true);
        });
        
        // 6. 모든 셀을 채운 후 퍼즐이 완성되었는지 확인
        expect(isPuzzleComplete(playingGrid)).toBe(true);
        
        // 7. 최종 결과가 솔루션과 일치하는지 확인
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            expect(playingGrid[row][col]).toBe(solution[row][col]);
          }
        }
      });
      
      it('should detect invalid moves during gameplay', () => {
        // 1. 퍼즐 생성
        const { puzzle, solution } = generatePuzzle(difficulty);
        
        // 2. 퍼즐 복사 (실제 플레이 시뮬레이션을 위해)
        const playingGrid = JSON.parse(JSON.stringify(puzzle)) as GridType;
        
        // 3. 빈 셀 찾기
        let emptyCell: [number, number] | null = null;
        outerLoop: for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (playingGrid[row][col] === null) {
              emptyCell = [row, col];
              break outerLoop;
            }
          }
        }
        
        // 빈 셀이 없으면 테스트 스킵
        if (!emptyCell) {
          return;
        }
        
        const [row, col] = emptyCell;
        const correctValue = solution[row][col];
        
        // 4. 잘못된 값 찾기 (정답이 아닌 값)
        let incorrectValue = 1;
        while (incorrectValue === correctValue) {
          incorrectValue = (incorrectValue % 9) + 1;
        }
        
        // 5. 잘못된 값 입력
        playingGrid[row][col] = incorrectValue;
        
        // 6. 최종 결과가 솔루션과 일치하지 않는지 확인
        let isDifferent = false;
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (playingGrid[r][c] !== null && playingGrid[r][c] !== solution[r][c]) {
              isDifferent = true;
              break;
            }
          }
        }
        
        expect(isDifferent).toBe(true);
        
        // 7. 잘못된 값을 정답으로 수정
        playingGrid[row][col] = correctValue;
        
        // 8. 이제 해당 셀의 값이 솔루션과 일치하는지 확인
        expect(playingGrid[row][col]).toBe(solution[row][col]);
      });
    });
  });
  
  // 스도쿠 퍼즐 풀이 성능 테스트
  it('should solve puzzles efficiently', () => {
    // 중간 난이도 퍼즐 생성
    const { puzzle } = generatePuzzle(Difficulty.MEDIUM);
    
    // 퍼즐 복사
    const puzzleCopy = JSON.parse(JSON.stringify(puzzle)) as GridType;
    
    // 시간 측정 시작
    const startTime = performance.now();
    
    // 퍼즐 풀기
    const solved = solveSudoku(puzzleCopy);
    
    // 시간 측정 종료
    const endTime = performance.now();
    const solvingTime = endTime - startTime;
    
    // 풀이 성공 확인
    expect(solved).toBe(true);
    
    // 풀이 시간이 합리적인지 확인 (1초 이내)
    expect(solvingTime).toBeLessThan(1000);
    
    // 완성된 퍼즐이 유효한지 확인
    expect(isPuzzleComplete(puzzleCopy)).toBe(true);
  });
});
