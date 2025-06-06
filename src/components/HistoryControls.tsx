import React from 'react';
import '../styles/HistoryControls.css';

interface HistoryControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isGameOver: boolean;
  isPaused: boolean;
}

/**
 * 실행 취소/다시 실행 컨트롤 컴포넌트
 */
const HistoryControls: React.FC<HistoryControlsProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isGameOver,
  isPaused
}) => {
  return (
    <div className="history-controls">
      <button 
        className={`history-button undo-button ${!canUndo || isGameOver || isPaused ? 'disabled' : ''}`}
        onClick={onUndo}
        disabled={!canUndo || isGameOver || isPaused}
        title="실행 취소 (이전 동작)"
      >
        <span className="button-icon">↩</span>
        <span className="button-text">실행 취소</span>
      </button>
      
      <button 
        className={`history-button redo-button ${!canRedo || isGameOver || isPaused ? 'disabled' : ''}`}
        onClick={onRedo}
        disabled={!canRedo || isGameOver || isPaused}
        title="다시 실행 (다음 동작)"
      >
        <span className="button-icon">↪</span>
        <span className="button-text">다시 실행</span>
      </button>
    </div>
  );
};

export default HistoryControls;
