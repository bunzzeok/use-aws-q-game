import { useState, useEffect, useCallback } from 'react';
import { Achievement } from '../utils/achievements/achievementData';
import { AchievementManager } from '../utils/achievements/achievementManager';
import { GameStatistics } from '../utils/statistics/gameStatistics';

/**
 * 업적 관리 커스텀 훅
 */
export const useAchievements = (statistics: GameStatistics) => {
  // 업적 데이터 상태
  const [achievements, setAchievements] = useState<Achievement[]>(
    AchievementManager.loadAchievements()
  );
  
  // 새로 달성한 업적 상태
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  
  // 업적 모달 표시 상태
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  
  // 업적 알림 표시 상태
  const [showAchievementNotification, setShowAchievementNotification] = useState<boolean>(false);
  
  // 업적 달성 모달 표시 상태
  const [showAchievementModal, setShowAchievementModal] = useState<boolean>(false);
  
  // 현재 표시 중인 업적 알림
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  
  // 알림 대기열
  const [notificationQueue, setNotificationQueue] = useState<Achievement[]>([]);

  // 컴포넌트 마운트 시 업적 데이터 로드
  useEffect(() => {
    const loadedAchievements = AchievementManager.loadAchievements();
    setAchievements(loadedAchievements);
  }, []);

  // 통계 데이터 변경 시 업적 확인
  useEffect(() => {
    const result = AchievementManager.checkAchievements(statistics);
    setAchievements(result.achievements);
    
    if (result.newlyUnlocked.length > 0) {
      setNewlyUnlocked(result.newlyUnlocked);
      setNotificationQueue(prev => [...prev, ...result.newlyUnlocked]);
      
      // 새로운 업적 달성 시 모달 표시
      if (result.newlyUnlocked.length > 0) {
        setCurrentNotification(result.newlyUnlocked[0]);
        setShowAchievementModal(true);
      }
    }
  }, [statistics]);

  // 알림 대기열 처리
  useEffect(() => {
    if (notificationQueue.length > 0 && !showAchievementNotification && !showAchievementModal) {
      // 대기열에서 첫 번째 업적 가져오기
      const nextNotification = notificationQueue[0];
      setCurrentNotification(nextNotification);
      setShowAchievementNotification(true);
      
      // 대기열에서 제거
      setNotificationQueue(prev => prev.slice(1));
      
      // 5초 후 알림 닫기
      const timer = setTimeout(() => {
        setShowAchievementNotification(false);
        setCurrentNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notificationQueue, showAchievementNotification, showAchievementModal]);

  // 업적 초기화
  const resetAchievements = useCallback(() => {
    AchievementManager.resetAchievements();
    setAchievements(AchievementManager.loadAchievements());
    setNewlyUnlocked([]);
  }, []);

  // 업적 모달 표시
  const handleShowAchievementsModal = useCallback(() => {
    setShowAchievementsModal(true);
  }, []);

  // 업적 모달 닫기
  const handleCloseAchievementsModal = useCallback(() => {
    setShowAchievementsModal(false);
  }, []);

  // 업적 알림 닫기
  const handleCloseNotification = useCallback(() => {
    setShowAchievementNotification(false);
    setShowAchievementModal(false);
    setCurrentNotification(null);
  }, []);

  // 총 업적 포인트 계산
  const totalPoints = AchievementManager.calculateTotalPoints(achievements);
  
  // 달성한 업적 수
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  // 전체 업적 수
  const totalCount = achievements.length;

  return {
    achievements,
    newlyUnlocked,
    showAchievementsModal,
    showAchievementNotification,
    showAchievementModal,
    currentNotification,
    totalPoints,
    unlockedCount,
    totalCount,
    resetAchievements,
    handleShowAchievementsModal,
    handleCloseAchievementsModal,
    handleCloseNotification
  };
};
