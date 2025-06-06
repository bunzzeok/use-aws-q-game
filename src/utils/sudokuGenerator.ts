import { Difficulty, GridType } from '../types';

// 빈 9x9 그리드 생성
export const createEmptyGrid = (): GridType => {
  return Array(9).fill(null).map(() => Array(9).fill(null));
};

// 배열을 랜덤하게 섞는 함수
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 스도쿠 솔루션 생성 (랜덤하게)
export const generateSolution = (): GridType => {
  const grid = createEmptyGrid();
  
  // 랜덤한 시작점으로 첫 번째 행 채우기
  const firstRow = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let col = 0; col < 9; col++) {
    grid[0][col] = firstRow[col];
  }
  
  // 나머지 그리드 채우기
  if (!solveSudoku(grid)) {
    // 실패하면 다시 시도
    return generateSolution();
  }
  
  return grid;
};

// 스도쿠 퍼즐 생성 (솔루션에서 숫자 제거)
export const generatePuzzle = (difficulty: Difficulty): { puzzle: GridType, solution: GridType } => {
  // 유효한 솔루션 생성
  const solution = generateSolution();
  
  // 추가 랜덤화: 행과 열 교환 (3x3 블록 내에서)
  const randomizedSolution = randomizeGrid(solution);
  
  const puzzle = JSON.parse(JSON.stringify(randomizedSolution)) as GridType;
  
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

  // 셀 제거 순서를 랜덤화
  const allCells: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      allCells.push([row, col]);
    }
  }
  
  // 셀 순서 섞기
  const shuffledCells = shuffleArray(allCells);
  
  // 랜덤하게 셀 제거 (최대 시도 횟수 제한)
  let removed = 0;
  let cellIndex = 0;
  
  while (removed < cellsToRemove && cellIndex < shuffledCells.length) {
    const [row, col] = shuffledCells[cellIndex++];
    
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
    }
  }
  
  // 최종 검증: 퍼즐이 유일한 해결책을 가지는지 확인
  if (!hasUniqueSolution(puzzle)) {
    console.warn("생성된 퍼즐이 유일한 해결책을 가지지 않습니다. 다시 시도합니다.");
    return generatePuzzle(difficulty);
  }
  
  return { puzzle, solution: randomizedSolution };
};

// 그리드를 추가로 랜덤화하는 함수 (3x3 블록 내에서 행과 열 교환)
const randomizeGrid = (grid: GridType): GridType => {
  const newGrid = JSON.parse(JSON.stringify(grid)) as GridType;
  
  // 각 3x3 블록 내에서 행 교환
  for (let block = 0; block < 3; block++) {
    const rowStart = block * 3;
    
    // 각 블록 내에서 행 교환 횟수
    const swapCount = 2 + Math.floor(Math.random() * 3); // 2~4회
    
    for (let i = 0; i < swapCount; i++) {
      const row1 = rowStart + Math.floor(Math.random() * 3);
      let row2 = rowStart + Math.floor(Math.random() * 3);
      
      // 같은 행이 선택되지 않도록
      while (row1 === row2) {
        row2 = rowStart + Math.floor(Math.random() * 3);
      }
      
      // 행 교환
      for (let col = 0; col < 9; col++) {
        [newGrid[row1][col], newGrid[row2][col]] = [newGrid[row2][col], newGrid[row1][col]];
      }
    }
  }
  
  // 각 3x3 블록 내에서 열 교환
  for (let block = 0; block < 3; block++) {
    const colStart = block * 3;
    
    // 각 블록 내에서 열 교환 횟수
    const swapCount = 2 + Math.floor(Math.random() * 3); // 2~4회
    
    for (let i = 0; i < swapCount; i++) {
      const col1 = colStart + Math.floor(Math.random() * 3);
      let col2 = colStart + Math.floor(Math.random() * 3);
      
      // 같은 열이 선택되지 않도록
      while (col1 === col2) {
        col2 = colStart + Math.floor(Math.random() * 3);
      }
      
      // 열 교환
      for (let row = 0; row < 9; row++) {
        [newGrid[row][col1], newGrid[row][col2]] = [newGrid[row][col2], newGrid[row][col1]];
      }
    }
  }
  
  // 3x3 블록 자체를 교환 (행 방향)
  const blockRowSwaps = Math.floor(Math.random() * 3); // 0~2회
  for (let i = 0; i < blockRowSwaps; i++) {
    const block1 = Math.floor(Math.random() * 3);
    let block2 = Math.floor(Math.random() * 3);
    
    // 같은 블록이 선택되지 않도록
    while (block1 === block2) {
      block2 = Math.floor(Math.random() * 3);
    }
    
    // 블록 교환 (행 방향)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        [newGrid[block1 * 3 + row][col], newGrid[block2 * 3 + row][col]] = 
        [newGrid[block2 * 3 + row][col], newGrid[block1 * 3 + row][col]];
      }
    }
  }
  
  // 3x3 블록 자체를 교환 (열 방향)
  const blockColSwaps = Math.floor(Math.random() * 3); // 0~2회
  for (let i = 0; i < blockColSwaps; i++) {
    const block1 = Math.floor(Math.random() * 3);
    let block2 = Math.floor(Math.random() * 3);
    
    // 같은 블록이 선택되지 않도록
    while (block1 === block2) {
      block2 = Math.floor(Math.random() * 3);
    }
    
    // 블록 교환 (열 방향)
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 9; row++) {
        [newGrid[row][block1 * 3 + col], newGrid[row][block2 * 3 + col]] = 
        [newGrid[row][block2 * 3 + col], newGrid[row][block1 * 3 + col]];
      }
    }
  }
  
  return newGrid;
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
        // 첫 번째 해결책과 다른 값을 먼저 시도하기 위해 숫자 순서를 섞음
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        for (const num of numbers) {
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
    
    // 빈 셀 찾기
    let emptyCell: [number, number] | null = null;
    
    // 가장 제약이 많은 셀 먼저 채우기 (MRV - Minimum Remaining Values)
    let minPossibleValues = 10; // 1~9까지 가능하므로 10으로 초기화
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          // 이 셀에 가능한 값의 개수 계산
          let possibleCount = 0;
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              possibleCount++;
            }
          }
          
          if (possibleCount < minPossibleValues) {
            minPossibleValues = possibleCount;
            emptyCell = [row, col];
            
            // 가능한 값이 1개면 더 이상 찾을 필요 없음
            if (possibleCount === 1) {
              break;
            }
          }
        }
      }
      
      // 가능한 값이 1개인 셀을 찾았으면 더 이상 찾을 필요 없음
      if (minPossibleValues === 1 && emptyCell) {
        break;
      }
    }
    
    // 빈 셀이 없으면 완료
    if (!emptyCell) {
      return true;
    }
    
    const [row, col] = emptyCell;
    
    // 1-9 숫자를 랜덤 순서로 시도
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (isValidPlacement(grid, row, col, num)) {
        grid[row][col] = num;
        
        if (solve(grid)) {
          return true;
        }
        
        grid[row][col] = null; // 백트래킹
      }
    }
    
    return false; // 해결책 없음
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

