import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

test('renders sudoku game title', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
  const titleElement = screen.getByText(/스도쿠 게임/i);
  expect(titleElement).toBeInTheDocument();
});
