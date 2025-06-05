import { Difficulty, GridType } from '../types';

// 빈 9x9 그리드 생성
export const createEmptyGrid = (): GridType => {
  return Array(9).fill(null).map(() => Array(9).fill(null));
};

// 스도쿠 솔루션 생성
export const generateSolution = (): GridType => {
  const grid = createEmptyGrid();
  solveSudoku(grid);
  return grid;
};

// 스도쿠 퍼즐 생성 (솔루션에서 숫자 제거)
export const generatePuzzle = (difficulty: Difficulty): { puzzle: GridType, solution: GridType } => {
  const solution = generateSolution();
  const puzzle = JSON.parse(JSON.stringify(solution)) as GridType;
  
  // 난이도에 따라 제거할 셀 수 결정
  let cellsToRemove: number;
  switch (difficulty) {
    case Difficulty.EASY:
      cellsToRemove = 35; // 약 35개 셀 제거
      break;
    case Difficulty.MEDIUM:
      cellsToRemove = 45; // 약 45개 셀 제거
      break;
    case Difficulty.HARD:
      cellsToRemove = 55; // 약 55개 셀 제거
      break;
    default:
      cellsToRemove = 40;
  }

  // 랜덤하게 셀 제거 (최대 시도 횟수 제한)
  let removed = 0;
  let attempts = 0;
  const maxAttempts = 1000; // 최대 시도 횟수 제한
  
  while (removed < cellsToRemove && attempts < maxAttempts) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== null) {
      // 임시로 값을 제거
      const temp = puzzle[row][col];
      puzzle[row][col] = null;
      
      // 임시 그리드 복사
      const tempGrid = JSON.parse(JSON.stringify(puzzle)) as GridType;
      
      // 이 상태에서 유일한 해결책이 있는지 확인
      if (hasUniqueSolution(tempGrid)) {
        removed++;
      } else {
        // 유일한 해결책이 없으면 값 복원
        puzzle[row][col] = temp;
      }
      
      attempts++;
    }
  }
  
  // 최종 검증: 퍼즐이 유일한 해결책을 가지는지 확인
  if (!hasUniqueSolution(puzzle)) {
    console.warn("생성된 퍼즐이 유일한 해결책을 가지지 않습니다. 다시 시도합니다.");
    return generatePuzzle(difficulty);
  }
  
  return { puzzle, solution };
};

// 유일한 해결책이 있는지 확인
const hasUniqueSolution = (grid: GridType): boolean => {
  // 그리드 복사
  const tempGrid = JSON.parse(JSON.stringify(grid)) as GridType;
  
  // 첫 번째 해결책 찾기
  if (!solveSudoku(tempGrid)) {
    return false; // 해결책이 없음
  }
  
  // 첫 번째 해결책 저장
  const firstSolution = JSON.parse(JSON.stringify(tempGrid)) as GridType;
  
  // 그리드 다시 복사
  const secondGrid = JSON.parse(JSON.stringify(grid)) as GridType;
  
  // 다른 해결책이 있는지 확인 (첫 번째 해결책과 다른)
  return !hasAnotherSolution(secondGrid, firstSolution);
};

// 다른 해결책이 있는지 확인
const hasAnotherSolution = (grid: GridType, firstSolution: GridType): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          // 첫 번째 해결책과 다른 값 시도
          if (firstSolution[row][col] !== num && isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            
            // 재귀적으로 다른 해결책 찾기
            if (hasAnotherSolution(grid, firstSolution)) {
              return true;
            }
            
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  
  // 그리드가 채워졌고 첫 번째 해결책과 다른지 확인
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== firstSolution[row][col]) {
        return true; // 다른 해결책 발견
      }
    }
  }
  
  return false; // 다른 해결책 없음
};

// 스도쿠 풀이 알고리즘 (백트래킹)
export const solveSudoku = (grid: GridType): boolean => {
  // 최대 재귀 깊이 제한
  const maxRecursionDepth = 1000;
  let recursionCount = 0;
  
  const solve = (grid: GridType): boolean => {
    recursionCount++;
    if (recursionCount > maxRecursionDepth) {
      return false; // 최대 재귀 깊이 초과
    }
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          // 1-9 숫자 시도
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              
              if (solve(grid)) {
                return true;
              }
              
              grid[row][col] = null; // 백트래킹
            }
          }
          return false; // 해결책 없음
        }
      }
    }
    return true; // 모든 셀이 채워짐
  };
  
  return solve(grid);
};

// 숫자 배치가 유효한지 확인
export const isValidPlacement = (grid: GridType, row: number, col: number, num: number): boolean => {
  // 행 확인
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) {
      return false;
    }
  }
  
  // 열 확인
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) {
      return false;
    }
  }
  
  // 3x3 박스 확인
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

// 스도쿠 퍼즐이 유효한지 확인
export const isValidSudoku = (grid: GridType): boolean => {
  // 모든 행, 열, 3x3 박스 확인
  for (let i = 0; i < 9; i++) {
    if (!isValidRow(grid, i) || !isValidColumn(grid, i) || !isValidBox(grid, i)) {
      return false;
    }
  }
  return true;
};

// 행이 유효한지 확인
const isValidRow = (grid: GridType, row: number): boolean => {
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
const isValidColumn = (grid: GridType, col: number): boolean => {
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
const isValidBox = (grid: GridType, box: number): boolean => {
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
