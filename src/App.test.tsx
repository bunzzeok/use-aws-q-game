import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// 모달 관련 오류 방지를 위한 모킹
jest.mock('./components/SaveGameModal', () => () => <div data-testid="save-game-modal" />);
jest.mock('./components/LoadGameModal', () => () => <div data-testid="load-game-modal" />);
jest.mock('./components/GameMenu', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="game-menu" />
}));

test('renders sudoku game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/스도쿠 게임/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders difficulty selection buttons', () => {
  render(<App />);
  const easyButton = screen.getByText(/쉬움/i);
  const mediumButton = screen.getByText(/중간/i);
  const hardButton = screen.getByText(/어려움/i);
  
  expect(easyButton).toBeInTheDocument();
  expect(mediumButton).toBeInTheDocument();
  expect(hardButton).toBeInTheDocument();
});
