import React from 'react';
import { Achievement } from '../utils/achievements/achievementData';
import '../styles/Modal.css';
import '../styles/AchievementModal.css';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

/**
 * 업적 달성 모달 컴포넌트
 */
const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  onClose
}) => {
  // 날짜 포맷팅
  const formatDate = (timestamp: number | null): string => {
    if (timestamp === null) return '-';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content achievement-modal">
        <h2>업적 달성!</h2>
        
        <div className="achievement-modal-content">
          <div className="achievement-modal-icon">{achievement.icon}</div>
          <div className="achievement-modal-details">
            <h3 className="achievement-modal-title">{achievement.title}</h3>
            <p className="achievement-modal-description">{achievement.description}</p>
            <div className="achievement-modal-info">
              <div className="achievement-modal-points">
                <span className="points-label">포인트</span>
                <span className="points-value">+{achievement.points}</span>
              </div>
              <div className="achievement-modal-date">
                <span className="date-label">달성일</span>
                <span className="date-value">{formatDate(achievement.unlockedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="modal-button primary-button" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;
