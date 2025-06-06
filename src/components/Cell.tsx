import React from 'react';
import { CellValue } from '../types/index';

interface CellProps {
  value: CellValue;
  notes: number[];
  isSelected: boolean;
  isHighlighted: boolean;
  isInitial: boolean;
  isInvalid: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  notes,
  isSelected,
  isHighlighted,
  isInitial,
  isInvalid,
  onClick
}) => {
  const classNames = [
    'cell',
    isSelected ? 'selected' : '',
    isHighlighted && !isSelected ? 'highlighted' : '',
    isInitial ? 'initial' : '',
    isInvalid ? 'invalid' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick}>
      {value === 0 || value === null ? (
        notes.length > 0 && (
          <div className="notes-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <div key={num} className="note">
                {notes.includes(num) ? num : ''}
              </div>
            ))}
          </div>
        )
      ) : (
        value
      )}
    </div>
  );
};

export default Cell;
