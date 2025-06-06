import React from 'react';
import Cell from './Cell';
import { CellState } from '../types/index';
import '../styles/Grid.css';

interface GridProps {
  grid: CellState[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  initialGrid: CellState[][];
}

const Grid: React.FC<GridProps> = ({ grid, selectedCell, onCellClick, initialGrid }) => {
  const isInSameRow = (row: number) => selectedCell && selectedCell.row === row;
  const isInSameCol = (col: number) => selectedCell && selectedCell.col === col;
  const isInSameBox = (row: number, col: number) => {
    if (!selectedCell) return false;
    const boxRow = Math.floor(selectedCell.row / 3);
    const boxCol = Math.floor(selectedCell.col / 3);
    return Math.floor(row / 3) === boxRow && Math.floor(col / 3) === boxCol;
  };
  const isSameValue = (row: number, col: number) => {
    if (!selectedCell || !grid[selectedCell.row] || !grid[selectedCell.row][selectedCell.col]) return false;
    const selectedValue = grid[selectedCell.row][selectedCell.col].value;
    return selectedValue !== 0 && selectedValue !== null && grid[row][col].value === selectedValue;
  };

  return (
    <div className="sudoku-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isHighlighted = 
              isInSameRow(rowIndex) || 
              isInSameCol(colIndex) || 
              isInSameBox(rowIndex, colIndex) ||
              isSameValue(rowIndex, colIndex);
            const isInitial = initialGrid && initialGrid[rowIndex] && initialGrid[rowIndex][colIndex] ? 
              initialGrid[rowIndex][colIndex].isInitial : false;
            const isInvalid = cell.isInvalid || false;

            return (
              <Cell
                key={colIndex}
                value={cell.value}
                notes={cell.notes}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isInitial={isInitial}
                isInvalid={isInvalid}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
