import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

// 모달 관련 오류 방지를 위한 모킹
jest.mock('./components/SaveGameModal', () => () => <div data-testid="save-game-modal" />);
jest.mock('./components/LoadGameModal', () => () => <div data-testid="load-game-modal" />);
jest.mock('./components/AutoSaveModal', () => () => <div data-testid="auto-save-modal" />);
jest.mock('./components/SettingsModal', () => () => <div data-testid="settings-modal" />);
jest.mock('./components/GameMenu', () => () => <div data-testid="game-menu" />);
jest.mock('./components/GameBoard', () => () => <div data-testid="game-board" />);
jest.mock('./components/ThemeToggle', () => () => <div data-testid="theme-toggle" />);

// 커스텀 훅 모킹
jest.mock('./hooks/useGameState', () => ({
  useGameState: () => ({
    gameState: {
      isComplete: false,
      isFailed: false
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

test('renders game menu component', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const gameMenuElement = screen.getByTestId('game-menu');
  expect(gameMenuElement).toBeInTheDocument();
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
