import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

// 모달 관련 오류 방지를 위한 모킹
jest.mock('./components/SaveGameModal', () => () => <div data-testid="save-game-modal" />);
jest.mock('./components/LoadGameModal', () => () => <div data-testid="load-game-modal" />);
jest.mock('./components/AutoSaveModal', () => () => <div data-testid="auto-save-modal" />);
jest.mock('./components/SettingsModal', () => () => <div data-testid="settings-modal" />);
jest.mock('./components/StatisticsModal', () => () => <div data-testid="statistics-modal" />);
jest.mock('./components/AchievementsModal', () => () => <div data-testid="achievements-modal" />);
jest.mock('./components/GameBoard', () => () => <div data-testid="game-board" />);
jest.mock('./components/ThemeToggle', () => () => <div data-testid="theme-toggle" />);
jest.mock('./components/Header', () => (props: any) => (
  <header data-testid="header">
    <h1>스도쿠 게임</h1>
    <div data-testid="theme-toggle"></div>
  </header>
));

// 커스텀 훅 모킹
jest.mock('./hooks/useGameState', () => ({
  useGameState: () => ({
    gameState: {
      isComplete: false,
      isFailed: false,
      grid: [],
      initialGrid: [],
      selectedCell: null,
      timer: 0,
      errorCount: 0,
      hintsRemaining: 3,
      isPaused: false,
      difficulty: 'easy'
    },
    gameStarted: false,
    showSaveModal: false,
    showLoadModal: false,
    showAutoSaveModal: false,
    isNotesMode: false,
    autoNotesEnabled: false,
    timerInterval: null,
    setGameState: jest.fn(),
    setGameStarted: jest.fn(),
    setShowSaveModal: jest.fn(),
    setShowLoadModal: jest.fn(),
    setShowAutoSaveModal: jest.fn(),
    setTimerInterval: jest.fn(),
    setAutoNotesEnabled: jest.fn(),
    setAutoSaveInterval: jest.fn(),
    startGame: jest.fn(),
    togglePause: jest.fn(),
    toggleAutoNotes: jest.fn(),
    handleNotesToggle: jest.fn(),
    autoSaveInterval: null
  })
}));

jest.mock('./hooks/useGameActions', () => ({
  useGameActions: () => ({
    handleCellClick: jest.fn(),
    handleNumberClick: jest.fn(),
    handleEraseClick: jest.fn(),
    handleHintClick: jest.fn(),
    handleUndo: jest.fn(),
    handleRedo: jest.fn()
  })
}));

jest.mock('./hooks/useGameStorage', () => ({
  useGameStorage: () => ({
    handleShowSaveModal: jest.fn(),
    handleShowLoadModal: jest.fn(),
    handleSaveGame: jest.fn(),
    handleLoadGame: jest.fn(),
    handleDeleteGame: jest.fn(),
    handleLoadAutoSavedGame: jest.fn()
  })
}));

jest.mock('./hooks/useAutoSave', () => ({
  useAutoSave: () => ({
    autoSaveSettings: {
      enabled: true,
      interval: 2,
      saveOnExit: true
    },
    updateAutoSaveSettings: jest.fn(),
    performAutoSave: jest.fn(),
    lastSaveTime: null
  })
}));

jest.mock('./hooks/useGameStatistics', () => ({
  useGameStatistics: () => ({
    statistics: {
      totalGames: 0,
      completedGames: 0,
      bestTimes: {},
      averageTimes: {},
      winRate: 0,
      hintsUsed: 0,
      mistakesMade: 0,
      lastPlayed: 0,
      streakDays: 0
    },
    showStatisticsModal: false,
    recordGameResult: jest.fn(),
    resetStatistics: jest.fn(),
    handleShowStatisticsModal: jest.fn(),
    handleCloseStatisticsModal: jest.fn()
  })
}));

jest.mock('./hooks/useAchievements', () => ({
  useAchievements: () => ({
    achievements: [],
    newlyUnlocked: [],
    showAchievementsModal: false,
    showAchievementNotification: false,
    currentNotification: null,
    totalPoints: 0,
    unlockedCount: 0,
    totalCount: 0,
    resetAchievements: jest.fn(),
    handleShowAchievementsModal: jest.fn(),
    handleCloseAchievementsModal: jest.fn(),
    handleCloseNotification: jest.fn()
  })
}));

jest.mock('./utils/history/gameHistory', () => ({
  gameHistory: {
    canUndo: () => false,
    canRedo: () => false
  }
}));

test('renders sudoku game title', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const titleElement = screen.getByText(/스도쿠 게임/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders header component', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const headerElement = screen.getByTestId('header');
  expect(headerElement).toBeInTheDocument();
});

test('renders game board component', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const gameBoardElement = screen.getByTestId('game-board');
  expect(gameBoardElement).toBeInTheDocument();
});
