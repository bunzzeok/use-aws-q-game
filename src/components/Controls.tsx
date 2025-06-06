import React from 'react';
import { Difficulty } from '../types';
import '../styles/Controls.css';

interface ControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onNumberClick: (num: number) => void;
  onEraseClick: () => void;
  onNotesToggle: () => void;
  onHintClick: () => void;
  isNotesMode: boolean;
  timer: number;
  hintsRemaining: number;
  isGameOver: boolean;
  isPaused?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onNumberClick,
  onEraseClick,
  onNotesToggle,
  onHintClick,
  isNotesMode,
  hintsRemaining,
  isGameOver,
  isPaused = false
}) => {
  return (
    <div className="controls">
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => onNumberClick(num)}
            disabled={isGameOver || isPaused}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="action-buttons">
        <button 
          className={`notes-button ${isNotesMode ? 'active' : ''}`} 
          onClick={onNotesToggle}
          disabled={isGameOver || isPaused}
        >
          메모
        </button>
        <button 
          onClick={onEraseClick}
          disabled={isGameOver || isPaused}
        >
          지우기
        </button>
        <button 
          onClick={onHintClick}
          disabled={hintsRemaining <= 0 || isGameOver || isPaused}
          className={hintsRemaining <= 0 ? 'disabled' : ''}
        >
          힌트 ({hintsRemaining})
        </button>
      </div>
      
      <div className="difficulty-controls">
        <button onClick={() => onNewGame(Difficulty.EASY)}>새 게임 (쉬움)</button>
        <button onClick={() => onNewGame(Difficulty.MEDIUM)}>새 게임 (중간)</button>
        <button onClick={() => onNewGame(Difficulty.HARD)}>새 게임 (어려움)</button>
      </div>
    </div>
  );
};

export default Controls;
