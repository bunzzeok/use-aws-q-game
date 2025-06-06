import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';

// ThemeToggle 컴포넌트는 ThemeProvider 내에서만 작동하므로 래퍼 컴포넌트 생성
const ThemeToggleWithProvider = () => (
  <ThemeProvider>
    <ThemeToggle />
  </ThemeProvider>
);

describe('ThemeToggle 컴포넌트', () => {
  test('테마 토글 버튼이 렌더링됨', () => {
    render(<ThemeToggleWithProvider />);
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  test('버튼 클릭 시 테마가 전환됨', () => {
    render(<ThemeToggleWithProvider />);
    const toggleButton = screen.getByRole('button');
    
    // 초기 상태는 라이트 모드 (🌙 아이콘 표시)
    expect(toggleButton).toHaveTextContent('🌙');
    
    // 버튼 클릭
    fireEvent.click(toggleButton);
    
    // 다크 모드로 전환 (☀️ 아이콘 표시)
    expect(toggleButton).toHaveTextContent('☀️');
    
    // 다시 클릭
    fireEvent.click(toggleButton);
    
    // 라이트 모드로 돌아옴
    expect(toggleButton).toHaveTextContent('🌙');
  });
});
