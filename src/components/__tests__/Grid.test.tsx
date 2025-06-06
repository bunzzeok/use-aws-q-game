import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Grid from '../Grid';
import { CellValue } from '../../types';

// 테스트용 그리드 데이터 생성
const createTestGrid = (): CellValue[][] => {
  const grid: CellValue[][] = [];
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = {
        value: (i * 9 + j) % 9 + 1,
        notes: [],
        isInvalid: false
      };
    }
  }
  return grid;
};

const testGrid = createTestGrid();
const testInitialGrid = createTestGrid();

describe('Grid Component', () => {
  test('renders the grid with correct number of cells', () => {
    const mockOnCellClick = jest.fn();
    render(
      <Grid
        grid={testGrid}
        selectedCell={null}
        onCellClick={mockOnCellClick}
        initialGrid={testInitialGrid}
      />
    );
    
    const gridRows = document.querySelectorAll('.grid-row');
    expect(gridRows.length).toBe(9);
    
    const cells = document.querySelectorAll('.cell');
    expect(cells.length).toBe(81);
  });
  
  test('renders cells with correct values', () => {
    const mockOnCellClick = jest.fn();
    render(
      <Grid
        grid={testGrid}
        selectedCell={null}
        onCellClick={mockOnCellClick}
        initialGrid={testInitialGrid}
      />
    );
    
    // 첫 번째 셀의 값이 1인지 확인
    const firstCell = document.querySelector('.cell');
    expect(firstCell).toHaveTextContent('1');
  });
  
  test('applies correct CSS classes based on cell state', () => {
    const mockOnCellClick = jest.fn();
    const selectedCell = { row: 0, col: 0 };
    
    // 특정 셀을 invalid로 설정
    const modifiedGrid = JSON.parse(JSON.stringify(testGrid));
    modifiedGrid[1][1].isInvalid = true;
    
    render(
      <Grid
        grid={modifiedGrid}
        selectedCell={selectedCell}
        onCellClick={mockOnCellClick}
        initialGrid={testInitialGrid}
      />
    );
    
    // 선택된 셀에 'selected' 클래스가 적용되었는지 확인
    const selectedCellElement = document.querySelector('.cell.selected');
    expect(selectedCellElement).toBeInTheDocument();
    
    // invalid 셀에 'invalid' 클래스가 적용되었는지 확인
    const cells = document.querySelectorAll('.cell');
    const invalidCell = cells[10]; // 1행 1열 (인덱스 10)
    expect(invalidCell).toHaveClass('invalid');
  });
  
  test('calls onCellClick with correct coordinates when a cell is clicked', () => {
    const mockOnCellClick = jest.fn();
    render(
      <Grid
        grid={testGrid}
        selectedCell={null}
        onCellClick={mockOnCellClick}
        initialGrid={testInitialGrid}
      />
    );
    
    // 첫 번째 셀 클릭
    const firstCell = document.querySelector('.cell');
    fireEvent.click(firstCell!);
    
    // onCellClick이 올바른 좌표로 호출되었는지 확인
    expect(mockOnCellClick).toHaveBeenCalledWith(0, 0);
  });
});
