import React from 'react';
import { CellState } from '../types';
import '../styles/Cell.css';

interface CellProps {
  cellState: CellState;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  onCellClick: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ 
  cellState, 
  rowIndex, 
  colIndex, 
  isSelected, 
  onCellClick 
}) => {
  const { value, isInitial, isValid, notes } = cellState;
  
  // 셀 클래스 결정
  const cellClass = `
    cell 
    ${isSelected ? 'selected' : ''} 
    ${!isValid ? 'invalid' : ''} 
    ${isInitial ? 'initial' : ''}
    ${rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-bottom' : ''}
    ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-right' : ''}
  `;

  // 노트 렌더링
  const renderNotes = () => {
    if (value !== null || notes.length === 0) return null;
    
    return (
      <div className="notes-container">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <div key={num} className={`note ${notes.includes(num) ? 'visible' : ''}`}>
            {notes.includes(num) ? num : ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={cellClass}
      onClick={() => onCellClick(rowIndex, colIndex)}
    >
      {value ? <span>{value}</span> : renderNotes()}
    </div>
  );
};

export default Cell;
