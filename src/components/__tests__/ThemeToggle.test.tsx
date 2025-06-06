import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { ThemeContext } from '../../contexts/ThemeContext';

// ThemeContext 모킹
const mockToggleTheme = jest.fn();

// ThemeContext 모킹
jest.mock('../../contexts/ThemeContext', () => ({
  ThemeContext: {
    Consumer: ({ children }) => children({ 
      theme: 'light', 
      toggleTheme: mockToggleTheme 
    }),
  },
  useTheme: () => ({ 
    theme: 'light', 
    toggleTheme: mockToggleTheme 
  }),
}));

describe('ThemeToggle 컴포넌트', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  test('테마 토글 버튼이 렌더링됨', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('버튼 클릭 시 테마가 전환됨', () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole('button');
    
    fireEvent.click(toggleButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
