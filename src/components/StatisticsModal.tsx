import React from 'react';
import { GameStatistics } from '../utils/statistics/gameStatistics';
import { Difficulty } from '../types';
import '../styles/StatisticsModal.css';

interface StatisticsModalProps {
  onClose: () => void;
  statistics: GameStatistics;
  onResetStatistics: () => void;
}

/**
 * 게임 통계 모달 컴포넌트
 */
const StatisticsModal: React.FC<StatisticsModalProps> = ({
  onClose,
  statistics,
  onResetStatistics
}) => {
  // 시간 포맷팅 함수 (초 -> 분:초)
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 난이도 텍스트 변환
  const getDifficultyText = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '중간';
      case 'hard': return '어려움';
      default: return '알 수 없음';
    }
  };

  // 마지막 플레이 날짜 포맷팅
  const formatLastPlayed = (timestamp: number): string => {
    if (timestamp === 0) return '없음';
    return new Date(timestamp).toLocaleDateString();
  };

  // 통계 초기화 확인
  const handleResetStatistics = () => {
    if (window.confirm('모든 통계 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onResetStatistics();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content statistics-modal">
        <h2>게임 통계</h2>
        
        <div className="statistics-section">
          <h3>전체 통계</h3>
          <div className="statistics-grid">
            <div className="statistic-item">
              <div className="statistic-value">{statistics.totalGames}</div>
              <div className="statistic-label">총 게임 수</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-value">{statistics.completedGames}</div>
              <div className="statistic-label">완료한 게임</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-value">{statistics.winRate.toFixed(1)}%</div>
              <div className="statistic-label">승률</div>
            </div>
            <div className="statistic-item">
              <div className="statistic-value">{statistics.streakDays}</div>
              <div className="statistic-label">연속 플레이</div>
            </div>
          </div>
        </div>
        
        <div className="statistics-section">
          <h3>최고 기록</h3>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>난이도</th>
                <th>최고 시간</th>
                <th>평균 시간</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(Difficulty).map((difficulty) => (
                <tr key={difficulty}>
                  <td>{getDifficultyText(difficulty)}</td>
                  <td>{formatTime(statistics.bestTimes[difficulty])}</td>
                  <td>{formatTime(statistics.averageTimes[difficulty])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="statistics-section">
          <h3>기타 통계</h3>
          <div className="statistics-list">
            <div className="statistic-row">
              <span className="statistic-label">사용한 힌트:</span>
              <span className="statistic-value">{statistics.hintsUsed}</span>
            </div>
            <div className="statistic-row">
              <span className="statistic-label">실수 횟수:</span>
              <span className="statistic-value">{statistics.mistakesMade}</span>
            </div>
            <div className="statistic-row">
              <span className="statistic-label">마지막 플레이:</span>
              <span className="statistic-value">{formatLastPlayed(statistics.lastPlayed)}</span>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="reset-button" onClick={handleResetStatistics}>
            통계 초기화
          </button>
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
