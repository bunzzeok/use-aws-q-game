import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sudoku game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/스도쿠 게임/i);
  expect(titleElement).toBeInTheDocument();
});
