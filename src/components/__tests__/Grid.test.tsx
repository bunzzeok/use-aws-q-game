import React from 'react';
import { render, screen } from '@testing-library/react';
import Grid from '../Grid';
import { CellState } from '../../types';

describe('Grid Component', () => {
  const mockGrid: CellState[][] = Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: null,
      isInitial: false,
      isValid: true,
      notes: []
    }))
  );
  
  // 일부 셀에 값 설정
  mockGrid[0][0] = { value: 1, isInitial: true, isValid: true, notes: [] };
  mockGrid[1][1] = { value: 2, isInitial: true, isValid: true, notes: [] };
  mockGrid[2][2] = { value: 3, isInitial: false, isValid: true, notes: [] };
  mockGrid[3][3] = { value: 4, isInitial: false, isValid: false, notes: [] };
  mockGrid[4][4] = { value: null, isInitial: false, isValid: true, notes: [1, 2] };
  
  const mockOnCellClick = jest.fn();
  
  it('renders the grid with correct number of cells', () => {
    render(
      <Grid 
        grid={mockGrid} 
        selectedCell={null} 
        onCellClick={mockOnCellClick} 
      />
    );
    
    // 9x9 그리드이므로 81개의 셀이 있어야 함
    const cells = screen.getAllByTestId(/cell-\d+-\d+/);
    expect(cells.length).toBe(81);
  });
  
  it('renders cells with correct values', () => {
    render(
      <Grid 
        grid={mockGrid} 
        selectedCell={null} 
        onCellClick={mockOnCellClick} 
      />
    );
    
    // 값이 있는 셀 확인
    expect(screen.getByTestId('cell-0-0').textContent).toBe('1');
    expect(screen.getByTestId('cell-1-1').textContent).toBe('2');
    expect(screen.getByTestId('cell-2-2').textContent).toBe('3');
    expect(screen.getByTestId('cell-3-3').textContent).toBe('4');
  });
  
  it('applies correct CSS classes based on cell state', () => {
    render(
      <Grid 
        grid={mockGrid} 
        selectedCell={[0, 0]} 
        onCellClick={mockOnCellClick} 
      />
    );
    
    // 초기 셀 클래스 확인
    expect(screen.getByTestId('cell-0-0').className).toContain('initial');
    
    // 선택된 셀 클래스 확인
    expect(screen.getByTestId('cell-0-0').className).toContain('selected');
    
    // 오답 셀 클래스 확인
    expect(screen.getByTestId('cell-3-3').className).toContain('invalid');
  });
  
  it('calls onCellClick with correct coordinates when a cell is clicked', () => {
    render(
      <Grid 
        grid={mockGrid} 
        selectedCell={null} 
        onCellClick={mockOnCellClick} 
      />
    );
    
    // 셀 클릭
    screen.getByTestId('cell-2-2').click();
    expect(mockOnCellClick).toHaveBeenCalledWith(2, 2);
  });
});
