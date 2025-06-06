import React, { useEffect } from 'react';
import { Achievement } from '../utils/achievements/achievementData';
import '../styles/AchievementNotification.css';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

/**
 * 업적 달성 알림 컴포넌트
 */
const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  // 자동 닫기 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="achievement-notification">
      <div className="notification-content">
        <div className="notification-icon">{achievement.icon}</div>
        <div className="notification-text">
          <h3>업적 달성!</h3>
          <h4>{achievement.title}</h4>
          <p>{achievement.description}</p>
          <div className="notification-points">+{achievement.points} 포인트</div>
        </div>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AchievementNotification;
