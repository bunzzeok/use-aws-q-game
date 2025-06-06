import { generateAutoNotes, updateNotesAfterInput } from '../autoNotes';
import { CellState } from '../../types';

describe('자동 메모 기능 테스트', () => {
  // 테스트용 빈 그리드 생성 함수
  const createEmptyTestGrid = (): CellState[][] => {
    return Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => ({
        value: null,
        isInitial: false,
        isValid: true,
        notes: []
      }))
    );
  };

  test('빈 그리드에서 모든 셀에 1-9 메모가 생성됨', () => {
    const emptyGrid = createEmptyTestGrid();
    const result = generateAutoNotes(emptyGrid);
    
    // 모든 셀에 1-9 메모가 있는지 확인
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        expect(result[row][col].notes.sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }
    }
  });

  test('값이 있는 셀에는 메모가 생성되지 않음', () => {
    const grid = createEmptyTestGrid();
    grid[0][0].value = 5;
    grid[0][0].isInitial = true;
    
    const result = generateAutoNotes(grid);
    
    expect(result[0][0].notes).toEqual([]);
  });

  test('행, 열, 박스에 있는 숫자는 메모에서 제외됨', () => {
    const grid = createEmptyTestGrid();
    
    // 첫 번째 행에 1 배치
    grid[0][0].value = 1;
    grid[0][0].isInitial = true;
    
    // 첫 번째 열에 2 배치
    grid[1][0].value = 2;
    grid[1][0].isInitial = true;
    
    // 첫 번째 3x3 박스에 3 배치
    grid[1][1].value = 3;
    grid[1][1].isInitial = true;
    
    const result = generateAutoNotes(grid);
    
    // 셀 [0][1]은 첫 번째 행에 있으므로 1이 제외됨
    expect(result[0][1].notes).not.toContain(1);
    
    // 셀 [2][0]은 첫 번째 열에 있으므로 2가 제외됨
    expect(result[2][0].notes).not.toContain(2);
    
    // 셀 [2][2]는 첫 번째 3x3 박스에 있으므로 3이 제외됨
    expect(result[2][2].notes).not.toContain(3);
  });

  test('숫자 입력 후 관련 셀의 메모가 업데이트됨', () => {
    const grid = createEmptyTestGrid();
    
    // 모든 셀에 1-9 메모 설정
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        grid[row][col].notes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
    }
    
    // 셀 [4][4]에 5 입력
    grid[4][4].value = 5;
    
    const result = updateNotesAfterInput(grid, 4, 4, 5);
    
    // 같은 행의 셀에서 5가 제거됨
    for (let col = 0; col < 9; col++) {
      if (col !== 4) {
        expect(result[4][col].notes).not.toContain(5);
      }
    }
    
    // 같은 열의 셀에서 5가 제거됨
    for (let row = 0; row < 9; row++) {
      if (row !== 4) {
        expect(result[row][4].notes).not.toContain(5);
      }
    }
    
    // 같은 3x3 박스의 셀에서 5가 제거됨
    for (let row = 3; row < 6; row++) {
      for (let col = 3; col < 6; col++) {
        if (row !== 4 || col !== 4) {
          expect(result[row][col].notes).not.toContain(5);
        }
      }
    }
  });
});
