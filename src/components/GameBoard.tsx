import React from 'react';
import Grid from './Grid';
import Controls from './Controls';
import HistoryControls from './HistoryControls';
import { GameState } from '../types/index';
import { getUsedNumbers } from '../utils/sudokuUtils';
import { Difficulty } from '../types/index';
import '../styles/GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  isNotesMode: boolean;
  gameStarted: boolean;
  autoNotesEnabled: boolean;
  onCellClick: (row: number, col: number) => void;
  onNumberClick: (number: number) => void;
  onEraseClick: () => void;
  onNotesToggle: () => void;
  onHintClick: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onNewGame: (difficulty: Difficulty) => void;
  onTogglePause: () => void;
  onToggleAutoNotes: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  isNotesMode,
  gameStarted,
  autoNotesEnabled,
  onCellClick,
  onNumberClick,
  onEraseClick,
  onNotesToggle,
  onHintClick,
  onUndo,
  onRedo,
  onNewGame,
  onTogglePause,
  onToggleAutoNotes,
  canUndo,
  canRedo
}) => {
  const usedNumbers = gameStarted ? getUsedNumbers(gameState.grid) : [];

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h2>난이도를 선택하세요</h2>
        <div className="difficulty-buttons">
          <button className="ripple" onClick={() => onNewGame(Difficulty.EASY)}>쉬움</button>
          <button className="ripple" onClick={() => onNewGame(Difficulty.MEDIUM)}>중간</button>
          <button className="ripple" onClick={() => onNewGame(Difficulty.HARD)}>어려움</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="game-info">
        <div className="timer">
          {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}
        </div>
        <div className="error-count">
          오류: {gameState.errorCount}/5
        </div>
        <div className="hints-remaining">
          힌트: {gameState.hintsRemaining}
        </div>
      </div>

      {gameState.isPaused && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2>게임 일시정지</h2>
            <p>게임을 계속하려면 아래 버튼을 클릭하세요</p>
            <button className="modal-button primary-button ripple" onClick={onTogglePause}>
              게임 재개
            </button>
          </div>
        </div>
      )}

      {!gameState.isPaused && (
        <>
          <Grid
            grid={gameState.grid}
            selectedCell={gameState.selectedCell}
            onCellClick={onCellClick}
            initialGrid={gameState.initialGrid}
          />

          {gameState.isComplete && (
            <div className="message success-message">
              축하합니다! 스도쿠를 완성했습니다!
            </div>
          )}

          {gameState.isFailed && (
            <div className="message fail-message">
              게임 오버! 오류 횟수가 5회를 초과했습니다.
            </div>
          )}

          {!gameState.isComplete && !gameState.isFailed && (
            <>
              <Controls
                onNumberClick={onNumberClick}
                onEraseClick={onEraseClick}
                onNotesToggle={onNotesToggle}
                onHintClick={onHintClick}
                isNotesMode={isNotesMode}
                hintsRemaining={gameState.hintsRemaining}
                usedNumbers={usedNumbers}
              />

              <div className="history-controls-container">
                <HistoryControls
                  onUndo={onUndo}
                  onRedo={onRedo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                />
              </div>

              <div className="options">
                <label className="auto-notes-toggle">
                  <input
                    type="checkbox"
                    checked={autoNotesEnabled}
                    onChange={onToggleAutoNotes}
                  />
                  자동 메모 기능
                </label>

                <button className="pause-button ripple" onClick={onTogglePause}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  게임 일시정지
                </button>
              </div>
            </>
          )}

          {(gameState.isComplete || gameState.isFailed) && (
            <button className="new-game-button ripple" onClick={() => onNewGame(gameState.difficulty)}>
              새 게임 시작
            </button>
          )}
        </>
      )}
    </>
  );
};

export default GameBoard;
