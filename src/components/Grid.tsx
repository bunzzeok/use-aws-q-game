import React from 'react';
import Cell from './Cell';
import { CellState } from '../types';
import '../styles/Grid.css';

interface GridProps {
  grid: CellState[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, selectedCell, onCellClick }) => {
  // 선택된 셀과 같은 숫자를 가진 셀 하이라이트
  const isSameNumber = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    
    const [selectedRow, selectedCol] = selectedCell;
    const selectedValue = grid[selectedRow][selectedCol].value;
    
    // 선택된 셀에 값이 없으면 하이라이트 없음
    if (selectedValue === null) return false;
    
    // 현재 셀의 값이 선택된 셀의 값과 같은지 확인
    return grid[row][col].value === selectedValue;
  };
  
  // 선택된 셀과 같은 행, 열, 또는 3x3 박스에 있는 셀 하이라이트
  const isSamePosition = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    
    const [selectedRow, selectedCol] = selectedCell;
    
    // 같은 행
    if (row === selectedRow) return true;
    
    // 같은 열
    if (col === selectedCol) return true;
    
    // 같은 3x3 박스
    const boxRow = Math.floor(selectedRow / 3);
    const boxCol = Math.floor(selectedCol / 3);
    const currentBoxRow = Math.floor(row / 3);
    const currentBoxCol = Math.floor(col / 3);
    
    return boxRow === currentBoxRow && boxCol === currentBoxCol;
  };

  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid-row">
          {row.map((cellState, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              cellState={cellState}
              rowIndex={rowIndex}
              colIndex={colIndex}
              isSelected={
                selectedCell !== null && 
                selectedCell[0] === rowIndex && 
                selectedCell[1] === colIndex
              }
              sameNumber={isSameNumber(rowIndex, colIndex)}
              samePosition={isSamePosition(rowIndex, colIndex)}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
