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
              onCellClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
