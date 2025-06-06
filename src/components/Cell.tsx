import React, { useEffect, useRef } from 'react';
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
  const cellRef = useRef<HTMLDivElement>(null);
  
  // 셀이 invalid 상태가 되면 애니메이션 효과를 위해 클래스를 재적용
  useEffect(() => {
    if (isInvalid && cellRef.current) {
      cellRef.current.classList.remove('invalid');
      void cellRef.current.offsetWidth; // 강제 리플로우
      cellRef.current.classList.add('invalid');
    }
  }, [isInvalid, value]);

  const classNames = [
    'cell',
    isSelected ? 'selected' : '',
    isHighlighted && !isSelected ? 'highlighted' : '',
    isInitial ? 'initial' : '',
    isInvalid ? 'invalid' : ''
  ].filter(Boolean).join(' ');

  return (
    <div ref={cellRef} className={classNames} onClick={onClick}>
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
