import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '../Controls';

describe('Controls Component', () => {
  const defaultProps = {
    onNumberClick: jest.fn(),
    onEraseClick: jest.fn(),
    onNotesToggle: jest.fn(),
    onHintClick: jest.fn(),
    isNotesMode: false,
    hintsRemaining: 3,
    usedNumbers: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders number buttons from 1 to 9', () => {
    render(<Controls {...defaultProps} />);
    
    for (let i = 1; i <= 9; i++) {
      const button = screen.getByText(i.toString());
      expect(button).toBeInTheDocument();
    }
  });

  test('calls onNumberClick when a number button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    // 숫자 5 버튼 클릭
    const button5 = screen.getByText('5');
    fireEvent.click(button5);
    
    expect(defaultProps.onNumberClick).toHaveBeenCalledWith(5);
  });

  test('calls onEraseClick when erase button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    const eraseButton = screen.getByText('지우기');
    fireEvent.click(eraseButton);
    
    expect(defaultProps.onEraseClick).toHaveBeenCalledTimes(1);
  });

  test('calls onNotesToggle when notes button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    const notesButton = screen.getByText('메모');
    fireEvent.click(notesButton);
    
    expect(defaultProps.onNotesToggle).toHaveBeenCalledTimes(1);
  });

  test('calls onHintClick when hint button is clicked', () => {
    render(<Controls {...defaultProps} />);
    
    const hintButton = screen.getByText(/힌트/);
    fireEvent.click(hintButton);
    
    expect(defaultProps.onHintClick).toHaveBeenCalledTimes(1);
  });

  test('disables hint button when no hints remaining', () => {
    render(
      <Controls
        {...defaultProps}
        hintsRemaining={0}
      />
    );
    
    const hintButton = screen.getByText(/힌트/).closest('button');
    expect(hintButton).toBeDisabled();
  });

  test('applies active class to notes button when in notes mode', () => {
    render(
      <Controls
        {...defaultProps}
        isNotesMode={true}
      />
    );
    
    const notesButton = screen.getByText('메모').closest('button');
    expect(notesButton).toHaveClass('active');
  });

  test('disables number buttons that have been used 9 times', () => {
    render(
      <Controls
        {...defaultProps}
        usedNumbers={[1, 1, 1, 1, 1, 1, 1, 1, 1]} // 숫자 1이 9번 사용됨
      />
    );
    
    const button1 = screen.getByText('1');
    expect(button1).toBeDisabled();
    
    const button2 = screen.getByText('2');
    expect(button2).not.toBeDisabled();
  });
});
