import React from 'react';
import '../styles/Controls.css';

interface ControlsProps {
  onNumberClick: (number: number) => void;
  onEraseClick: () => void;
  onNotesToggle: () => void;
  onHintClick: () => void;
  isNotesMode: boolean;
  hintsRemaining: number;
  usedNumbers?: number[];
}

const Controls: React.FC<ControlsProps> = ({
  onNumberClick,
  onEraseClick,
  onNotesToggle,
  onHintClick,
  isNotesMode,
  hintsRemaining,
  usedNumbers = []
}) => {
  return (
    <div className="controls">
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <button
            key={number}
            onClick={() => onNumberClick(number)}
            disabled={usedNumbers.includes(number) && usedNumbers.filter(n => n === number).length >= 9}
            className="ripple"
          >
            {number}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button 
          className="erase-button ripple" 
          onClick={onEraseClick}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
          지우기
        </button>
        <button 
          className={`notes-button ripple ${isNotesMode ? 'active' : ''}`} 
          onClick={onNotesToggle}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          메모
        </button>
        <button 
          className="hint-button ripple" 
          onClick={onHintClick}
          disabled={hintsRemaining <= 0}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
          </svg>
          힌트 ({hintsRemaining})
        </button>
      </div>
    </div>
  );
};

export default Controls;
