import React, { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import GameMenu from './components/GameMenu';
import GameBoard from './components/GameBoard';
import SaveGameModal from './components/SaveGameModal';
import LoadGameModal from './components/LoadGameModal';
import AutoSaveModal from './components/AutoSaveModal';
import SettingsModal from './components/SettingsModal';
import StatisticsModal from './components/StatisticsModal';
import { useGameState } from './hooks/useGameState';
import { useGameActions } from './hooks/useGameActions';
import { useGameStorage } from './hooks/useGameStorage';
import { useAutoSave } from './hooks/useAutoSave';
import { useGameStatistics } from './hooks/useGameStatistics';
import { gameHistory } from './utils/history/gameHistory';
import './styles/App.css';

const App: React.FC = () => {
  // 설정 모달 상태
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // 게임 상태 관리 훅
  const {
    gameState,
    setGameState,
    isNotesMode,
    timerInterval,
    setTimerInterval,
    gameStarted,
    setGameStarted,
    autoNotesEnabled,
    setAutoNotesEnabled,
    showSaveModal,
    setShowSaveModal,
    showLoadModal,
    setShowLoadModal,
    showAutoSaveModal,
    setShowAutoSaveModal,
    autoSaveInterval,
    setAutoSaveInterval,
    startGame,
    togglePause,
    toggleAutoNotes,
    handleNotesToggle
  } = useGameState();

  // 게임 액션 관리 훅
  const {
    handleCellClick,
    handleNumberClick,
    handleEraseClick,
    handleHintClick,
    handleUndo,
    handleRedo
  } = useGameActions(
    gameState,
    setGameState,
    gameStarted,
    isNotesMode,
    autoNotesEnabled,
    timerInterval,
    setTimerInterval
  );

  // 자동 저장 관리 훅
  const {
    autoSaveSettings,
    updateAutoSaveSettings,
    performAutoSave,
    lastSaveTime
  } = useAutoSave(
    gameState,
    gameStarted,
    autoNotesEnabled,
    setShowAutoSaveModal
  );

  // 게임 저장 및 불러오기 관리 훅
  const {
    handleShowSaveModal,
    handleShowLoadModal,
    handleSaveGame,
    handleLoadGame,
    handleDeleteGame,
    handleLoadAutoSavedGame
  } = useGameStorage(
    gameState,
    setGameState,
    gameStarted,
    autoNotesEnabled,
    setAutoNotesEnabled,
    setShowSaveModal,
    setShowLoadModal,
    setGameStarted,
    timerInterval,
    setTimerInterval,
    autoSaveInterval,
    setAutoSaveInterval
  );

  // 게임 통계 관리 훅
  const {
    statistics,
    showStatisticsModal,
    recordGameResult,
    resetStatistics,
    handleShowStatisticsModal,
    handleCloseStatisticsModal
  } = useGameStatistics();

  // 게임 완료 또는 실패 시 통계 업데이트
  useEffect(() => {
    if ((gameState.isComplete || gameState.isFailed) && gameStarted) {
      recordGameResult(gameState, autoNotesEnabled);
    }
  }, [gameState.isComplete, gameState.isFailed, gameStarted, gameState, autoNotesEnabled, recordGameResult]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>스도쿠 게임</h1>
        <ThemeToggle />
      </header>
      
      <GameMenu
        onSaveGame={handleShowSaveModal}
        onLoadGame={handleShowLoadModal}
        onNewGame={() => setGameStarted(false)}
        onSettings={() => setShowSettingsModal(true)}
        onStatistics={handleShowStatisticsModal}
        onAchievements={() => {}}
        isGameStarted={gameStarted}
        isGameOver={gameState.isComplete || gameState.isFailed}
      />
      
      <div className="game-container">
        <GameBoard
          gameState={gameState}
          isNotesMode={isNotesMode}
          gameStarted={gameStarted}
          autoNotesEnabled={autoNotesEnabled}
          onCellClick={handleCellClick}
          onNumberClick={handleNumberClick}
          onEraseClick={handleEraseClick}
          onNotesToggle={handleNotesToggle}
          onHintClick={handleHintClick}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onNewGame={startGame}
          onTogglePause={togglePause}
          onToggleAutoNotes={toggleAutoNotes}
          canUndo={gameHistory.canUndo()}
          canRedo={gameHistory.canRedo()}
        />
      </div>
      
      {/* 게임 저장 모달 */}
      {showSaveModal && (
        <SaveGameModal
          gameState={gameState}
          autoNotesEnabled={autoNotesEnabled}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveGame}
        />
      )}
      
      {/* 게임 불러오기 모달 */}
      {showLoadModal && (
        <LoadGameModal
          onClose={() => setShowLoadModal(false)}
          onLoad={handleLoadGame}
          onDelete={handleDeleteGame}
        />
      )}
      
      {/* 자동 저장 게임 불러오기 확인 모달 */}
      {showAutoSaveModal && (
        <AutoSaveModal
          onClose={() => setShowAutoSaveModal(false)}
          onLoad={() => {
            handleLoadAutoSavedGame();
            setShowAutoSaveModal(false);
          }}
          onDelete={() => {
            handleDeleteGame('auto');
            setShowAutoSaveModal(false);
          }}
        />
      )}
      
      {/* 설정 모달 */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          autoSaveSettings={autoSaveSettings}
          onUpdateAutoSaveSettings={updateAutoSaveSettings}
          lastSaveTime={lastSaveTime}
          onSaveNow={performAutoSave}
        />
      )}
      
      {/* 통계 모달 */}
      {showStatisticsModal && (
        <StatisticsModal
          onClose={handleCloseStatisticsModal}
          statistics={statistics}
          onResetStatistics={resetStatistics}
        />
      )}
    </div>
  );
};

export default App;
