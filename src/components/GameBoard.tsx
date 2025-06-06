import React from 'react';
import Grid from './Grid';
import Controls from './Controls';
import HistoryControls from './HistoryControls';
import { GameState, Difficulty } from '../types';
import '../styles/GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  isNotesMode: boolean;
  gameStarted: boolean;
  autoNotesEnabled: boolean;
  onCellClick: (row: number, col: number) => void;
  onNumberClick: (num: number) => void;
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

/**
 * 게임 보드 컴포넌트
 */
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
  const isGameOver = gameState.isComplete || gameState.isFailed;

  // 게임 시작 화면
  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h2>난이도를 선택하고 게임을 시작하세요</h2>
        <div className="difficulty-buttons">
          <button onClick={() => onNewGame(Difficulty.EASY)}>쉬움 (힌트 5개)</button>
          <button onClick={() => onNewGame(Difficulty.MEDIUM)}>중간 (힌트 3개)</button>
          <button onClick={() => onNewGame(Difficulty.HARD)}>어려움 (힌트 1개)</button>
        </div>
        <div className="options">
          <label className="auto-notes-toggle">
            <input
              type="checkbox"
              checked={autoNotesEnabled}
              onChange={onToggleAutoNotes}
            />
            자동 메모 활성화
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      <div className="game-info">
        <div className="timer">시간: {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}</div>
        <div className="error-count">오답: {gameState.errorCount}/5</div>
        <div className="hints-remaining">남은 힌트: {gameState.hintsRemaining}</div>
      </div>
      
      <div className="game-controls">
        <button onClick={onTogglePause}>
          {gameState.isPaused ? '게임 재개' : '일시정지'}
        </button>
        <button onClick={onToggleAutoNotes}>
          {autoNotesEnabled ? '자동 메모 끄기' : '자동 메모 켜기'}
        </button>
      </div>
      
      {gameState.isPaused ? (
        <div className="message">
          게임이 일시정지되었습니다. '게임 재개' 버튼을 클릭하여 계속하세요.
        </div>
      ) : (
        <Grid
          grid={gameState.grid}
          selectedCell={gameState.selectedCell}
          onCellClick={onCellClick}
        />
      )}
      
      {gameState.isComplete && (
        <div className="message success-message">
          축하합니다! 스도쿠를 완성했습니다!
        </div>
      )}
      
      {gameState.isFailed && (
        <div className="message fail-message">
          게임 오버! 5번 이상 틀렸습니다.
        </div>
      )}
      
      <Controls
        onNewGame={onNewGame}
        onNumberClick={onNumberClick}
        onEraseClick={onEraseClick}
        onNotesToggle={onNotesToggle}
        onHintClick={onHintClick}
        isNotesMode={isNotesMode}
        timer={gameState.timer}
        hintsRemaining={gameState.hintsRemaining}
        isGameOver={isGameOver}
        isPaused={gameState.isPaused}
      />
      
      <HistoryControls
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isGameOver={isGameOver}
        isPaused={gameState.isPaused}
      />
      
      {isGameOver && (
        <button className="new-game-button" onClick={() => onNewGame(gameState.difficulty)}>
          새 게임 시작
        </button>
      )}
    </div>
  );
};

export default GameBoard;
