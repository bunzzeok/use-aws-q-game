import React, { useState } from 'react';
import { Achievement, AchievementCategory } from '../utils/achievements/achievementData';
import { AchievementManager } from '../utils/achievements/achievementManager';
import '../styles/AchievementsModal.css';

interface AchievementsModalProps {
  onClose: () => void;
  achievements: Achievement[];
  totalPoints: number;
  unlockedCount: number;
  totalCount: number;
  onResetAchievements: () => void;
}

/**
 * 업적 모달 컴포넌트
 */
const AchievementsModal: React.FC<AchievementsModalProps> = ({
  onClose,
  achievements,
  totalPoints,
  unlockedCount,
  totalCount,
  onResetAchievements
}) => {
  // 현재 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // 현재 선택된 필터
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // 업적 필터링
  const filteredAchievements = achievements.filter(achievement => {
    // 카테고리 필터링
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    
    // 상태 필터링
    if (selectedFilter === 'unlocked' && !achievement.unlocked) {
      return false;
    }
    if (selectedFilter === 'locked' && achievement.unlocked) {
      return false;
    }
    
    return true;
  });

  // 업적 초기화 확인
  const handleResetAchievements = () => {
    if (window.confirm('모든 업적 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onResetAchievements();
    }
  };

  // 카테고리 텍스트 변환
  const getCategoryText = (category: string): string => {
    switch (category) {
      case AchievementCategory.BEGINNER: return '초보자';
      case AchievementCategory.INTERMEDIATE: return '중급자';
      case AchievementCategory.EXPERT: return '전문가';
      case AchievementCategory.SPECIAL: return '특별';
      default: return '전체';
    }
  };

  // 날짜 포맷팅
  const formatDate = (timestamp: number | null): string => {
    if (timestamp === null) return '-';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content achievements-modal">
        <h2>업적</h2>
        
        <div className="achievements-summary">
          <div className="summary-item">
            <div className="summary-value">{unlockedCount}/{totalCount}</div>
            <div className="summary-label">달성한 업적</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{totalPoints}</div>
            <div className="summary-label">총 포인트</div>
          </div>
        </div>
        
        <div className="achievements-filters">
          <div className="filter-group">
            <label>카테고리:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체</option>
              <option value={AchievementCategory.BEGINNER}>초보자</option>
              <option value={AchievementCategory.INTERMEDIATE}>중급자</option>
              <option value={AchievementCategory.EXPERT}>전문가</option>
              <option value={AchievementCategory.SPECIAL}>특별</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>상태:</label>
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="unlocked">달성함</option>
              <option value="locked">미달성</option>
            </select>
          </div>
        </div>
        
        <div className="achievements-list">
          {filteredAchievements.length === 0 ? (
            <div className="no-achievements">
              선택한 필터에 해당하는 업적이 없습니다.
            </div>
          ) : (
            filteredAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-details">
                    <span className="achievement-category">{getCategoryText(achievement.category)}</span>
                    <span className="achievement-points">{achievement.points} 포인트</span>
                    {achievement.unlocked && (
                      <span className="achievement-date">
                        달성일: {formatDate(achievement.unlockedAt)}
                      </span>
                    )}
                  </div>
                  {!achievement.unlocked && achievement.maxProgress > 1 && (
                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.round((Number(achievement.progressValue || 0) / Number(achievement.maxProgress)) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {`${achievement.progressValue || 0}/${achievement.maxProgress}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="modal-actions">
          <button className="reset-button" onClick={handleResetAchievements}>
            업적 초기화
          </button>
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
