import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryControls from './HistoryControls';

describe('HistoryControls', () => {
  const defaultProps = {
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    canUndo: true,
    canRedo: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('실행 취소 버튼이 렌더링됨', () => {
    render(<HistoryControls {...defaultProps} />);
    const undoButton = screen.getByText('실행 취소');
    expect(undoButton).toBeInTheDocument();
  });

  test('다시 실행 버튼이 렌더링됨', () => {
    render(<HistoryControls {...defaultProps} />);
    const redoButton = screen.getByText('다시 실행');
    expect(redoButton).toBeInTheDocument();
  });

  test('실행 취소 버튼 클릭 시 onUndo 호출됨', () => {
    render(<HistoryControls {...defaultProps} />);
    const undoButton = screen.getByText('실행 취소');
    fireEvent.click(undoButton);
    expect(defaultProps.onUndo).toHaveBeenCalledTimes(1);
  });

  test('다시 실행 버튼 클릭 시 onRedo 호출됨', () => {
    render(<HistoryControls {...defaultProps} />);
    const redoButton = screen.getByText('다시 실행');
    fireEvent.click(redoButton);
    expect(defaultProps.onRedo).toHaveBeenCalledTimes(1);
  });

  test('canUndo가 false일 때 실행 취소 버튼이 비활성화됨', () => {
    render(<HistoryControls {...defaultProps} canUndo={false} />);
    const undoButton = screen.getByText('실행 취소').closest('button');
    expect(undoButton).toBeDisabled();
  });

  test('canRedo가 false일 때 다시 실행 버튼이 비활성화됨', () => {
    render(<HistoryControls {...defaultProps} canRedo={false} />);
    const redoButton = screen.getByText('다시 실행').closest('button');
    expect(redoButton).toBeDisabled();
  });

  test('canUndo가 true일 때 실행 취소 버튼이 활성화됨', () => {
    render(<HistoryControls {...defaultProps} canUndo={true} />);
    const undoButton = screen.getByText('실행 취소').closest('button');
    expect(undoButton).not.toBeDisabled();
  });

  test('canRedo가 true일 때 다시 실행 버튼이 활성화됨', () => {
    render(<HistoryControls {...defaultProps} canRedo={true} />);
    const redoButton = screen.getByText('다시 실행').closest('button');
    expect(redoButton).not.toBeDisabled();
  });
});
