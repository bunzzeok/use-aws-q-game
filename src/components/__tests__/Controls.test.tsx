import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '../Controls';
import { Difficulty } from '../../types';

describe('Controls Component', () => {
  const mockOnNewGame = jest.fn();
  const mockOnNumberClick = jest.fn();
  const mockOnEraseClick = jest.fn();
  const mockOnNotesToggle = jest.fn();
  const mockOnHintClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders number buttons from 1 to 9', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={3}
        isGameOver={false}
      />
    );
    
    // 1부터 9까지의 숫자 버튼이 있는지 확인
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });
  
  it('calls onNumberClick when a number button is clicked', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={3}
        isGameOver={false}
      />
    );
    
    // 숫자 버튼 클릭
    fireEvent.click(screen.getByText('5'));
    expect(mockOnNumberClick).toHaveBeenCalledWith(5);
  });
  
  it('calls onEraseClick when erase button is clicked', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={3}
        isGameOver={false}
      />
    );
    
    // 지우기 버튼 클릭
    fireEvent.click(screen.getByText(/지우기/i));
    expect(mockOnEraseClick).toHaveBeenCalled();
  });
  
  it('calls onNotesToggle when notes button is clicked', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={3}
        isGameOver={false}
      />
    );
    
    // 메모 버튼 클릭
    fireEvent.click(screen.getByText(/메모/i));
    expect(mockOnNotesToggle).toHaveBeenCalled();
  });
  
  it('calls onHintClick when hint button is clicked', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={3}
        isGameOver={false}
      />
    );
    
    // 힌트 버튼 클릭
    fireEvent.click(screen.getByText(/힌트/i));
    expect(mockOnHintClick).toHaveBeenCalled();
  });
  
  it('disables hint button when no hints remaining', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={0}
        isGameOver={false}
      />
    );
    
    // 힌트 버튼이 비활성화되어 있는지 확인
    const hintButton = screen.getByText(/힌트/i);
    expect(hintButton).toBeDisabled();
  });
  
  it('applies active class to notes button when in notes mode', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={true}
        timer={0}
        hintsRemaining={3}
        isGameOver={false}
      />
    );
    
    // 메모 버튼에 active 클래스가 적용되어 있는지 확인
    const notesButton = screen.getByText(/메모/i);
    expect(notesButton.className).toContain('active');
  });
  
  it('disables all buttons when game is over', () => {
    render(
      <Controls
        onNewGame={mockOnNewGame}
        onNumberClick={mockOnNumberClick}
        onEraseClick={mockOnEraseClick}
        onNotesToggle={mockOnNotesToggle}
        onHintClick={mockOnHintClick}
        isNotesMode={false}
        timer={0}
        hintsRemaining={3}
        isGameOver={true}
      />
    );
    
    // 모든 버튼이 비활성화되어 있는지 확인
    const numberButtons = screen.getAllByText(/[1-9]/);
    numberButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
    
    expect(screen.getByText(/지우기/i)).toBeDisabled();
    expect(screen.getByText(/메모/i)).toBeDisabled();
    expect(screen.getByText(/힌트/i)).toBeDisabled();
  });
});
