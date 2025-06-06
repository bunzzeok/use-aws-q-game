import { useState, useEffect, useCallback } from 'react';
import { GameStatistics, GameStatisticsManager, GameResult } from '../utils/statistics/gameStatistics';
import { GameState } from '../types';

/**
 * 게임 통계 관리 커스텀 훅
 */
export const useGameStatistics = () => {
  // 통계 데이터 상태
  const [statistics, setStatistics] = useState<GameStatistics>(
    GameStatisticsManager.loadStatistics()
  );
  
  // 통계 모달 표시 상태
  const [showStatisticsModal, setShowStatisticsModal] = useState<boolean>(false);

  // 컴포넌트 마운트 시 통계 데이터 로드
  useEffect(() => {
    const loadedStats = GameStatisticsManager.loadStatistics();
    setStatistics(loadedStats);
  }, []);

  // 게임 결과 기록
  const recordGameResult = useCallback((gameState: GameState, autoNotesEnabled: boolean) => {
    const gameResult: GameResult = {
      difficulty: gameState.difficulty,
      completed: gameState.isComplete,
      time: gameState.timer,
      hintsUsed: getHintsUsed(gameState),
      mistakesMade: gameState.errorCount,
      timestamp: Date.now()
    };
    
    const updatedStats = GameStatisticsManager.recordGameResult(gameResult);
    setStatistics(updatedStats);
  }, []);

  // 사용한 힌트 수 계산
  const getHintsUsed = (gameState: GameState): number => {
    // 난이도별 초기 힌트 수
    let initialHints: number;
    switch (gameState.difficulty) {
      case 'easy':
        initialHints = 5;
        break;
      case 'medium':
        initialHints = 3;
        break;
      case 'hard':
        initialHints = 1;
        break;
      default:
        initialHints = 3;
    }
    
    // 사용한 힌트 수 = 초기 힌트 수 - 남은 힌트 수
    return initialHints - gameState.hintsRemaining;
  };

  // 통계 초기화
  const resetStatistics = useCallback(() => {
    GameStatisticsManager.resetStatistics();
    setStatistics(GameStatisticsManager.loadStatistics());
  }, []);

  // 통계 모달 표시
  const handleShowStatisticsModal = useCallback(() => {
    setShowStatisticsModal(true);
  }, []);

  // 통계 모달 닫기
  const handleCloseStatisticsModal = useCallback(() => {
    setShowStatisticsModal(false);
  }, []);

  return {
    statistics,
    showStatisticsModal,
    recordGameResult,
    resetStatistics,
    handleShowStatisticsModal,
    handleCloseStatisticsModal
  };
};
