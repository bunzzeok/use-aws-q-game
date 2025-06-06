import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryControls from './HistoryControls';

describe('HistoryControls', () => {
  const mockOnUndo = jest.fn();
  const mockOnRedo = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('실행 취소/다시 실행 버튼이 렌더링되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={true}
        canRedo={true}
        isGameOver={false}
        isPaused={false}
      />
    );
    
    expect(screen.getByText('실행 취소')).toBeInTheDocument();
    expect(screen.getByText('다시 실행')).toBeInTheDocument();
  });
  
  test('실행 취소 버튼 클릭 시 onUndo 함수가 호출되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={true}
        canRedo={true}
        isGameOver={false}
        isPaused={false}
      />
    );
    
    fireEvent.click(screen.getByText('실행 취소'));
    expect(mockOnUndo).toHaveBeenCalledTimes(1);
  });
  
  test('다시 실행 버튼 클릭 시 onRedo 함수가 호출되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={true}
        canRedo={true}
        isGameOver={false}
        isPaused={false}
      />
    );
    
    fireEvent.click(screen.getByText('다시 실행'));
    expect(mockOnRedo).toHaveBeenCalledTimes(1);
  });
  
  test('canUndo가 false일 때 실행 취소 버튼이 비활성화되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={false}
        canRedo={true}
        isGameOver={false}
        isPaused={false}
      />
    );
    
    const undoButton = screen.getByText('실행 취소').closest('button');
    expect(undoButton).toBeDisabled();
    
    fireEvent.click(screen.getByText('실행 취소'));
    expect(mockOnUndo).not.toHaveBeenCalled();
  });
  
  test('canRedo가 false일 때 다시 실행 버튼이 비활성화되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={true}
        canRedo={false}
        isGameOver={false}
        isPaused={false}
      />
    );
    
    const redoButton = screen.getByText('다시 실행').closest('button');
    expect(redoButton).toBeDisabled();
    
    fireEvent.click(screen.getByText('다시 실행'));
    expect(mockOnRedo).not.toHaveBeenCalled();
  });
  
  test('게임이 종료되었을 때 모든 버튼이 비활성화되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={true}
        canRedo={true}
        isGameOver={true}
        isPaused={false}
      />
    );
    
    const undoButton = screen.getByText('실행 취소').closest('button');
    const redoButton = screen.getByText('다시 실행').closest('button');
    
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
    
    fireEvent.click(screen.getByText('실행 취소'));
    fireEvent.click(screen.getByText('다시 실행'));
    
    expect(mockOnUndo).not.toHaveBeenCalled();
    expect(mockOnRedo).not.toHaveBeenCalled();
  });
  
  test('게임이 일시정지되었을 때 모든 버튼이 비활성화되어야 함', () => {
    render(
      <HistoryControls
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        canUndo={true}
        canRedo={true}
        isGameOver={false}
        isPaused={true}
      />
    );
    
    const undoButton = screen.getByText('실행 취소').closest('button');
    const redoButton = screen.getByText('다시 실행').closest('button');
    
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
    
    fireEvent.click(screen.getByText('실행 취소'));
    fireEvent.click(screen.getByText('다시 실행'));
    
    expect(mockOnUndo).not.toHaveBeenCalled();
    expect(mockOnRedo).not.toHaveBeenCalled();
  });
});
