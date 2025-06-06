import { Achievement, achievements } from './achievementData';
import { GameStatistics } from '../statistics/gameStatistics';

/**
 * 업적 관리자 클래스
 */
export class AchievementManager {
  private static readonly STORAGE_KEY = 'sudoku_achievements';

  /**
   * 업적 데이터 로드
   */
  static loadAchievements(): Achievement[] {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (!savedData) {
        return [...achievements];
      }
      
      const savedAchievements = JSON.parse(savedData) as Achievement[];
      
      // 새로운 업적이 추가되었을 경우를 대비해 기본 업적과 병합
      const mergedAchievements = [...achievements];
      
      // 저장된 업적 상태 적용
      savedAchievements.forEach(savedAchievement => {
        const index = mergedAchievements.findIndex(a => a.id === savedAchievement.id);
        if (index !== -1) {
          mergedAchievements[index].unlocked = savedAchievement.unlocked;
          mergedAchievements[index].unlockedAt = savedAchievement.unlockedAt;
        }
      });
      
      return mergedAchievements;
    } catch (error) {
      console.error('업적 데이터 로드 중 오류 발생:', error);
      return [...achievements];
    }
  }

  /**
   * 업적 데이터 저장
   */
  static saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('업적 데이터 저장 중 오류 발생:', error);
    }
  }

  /**
   * 업적 달성 확인 및 업데이트
   */
  static checkAchievements(stats: GameStatistics): {
    achievements: Achievement[];
    newlyUnlocked: Achievement[];
  } {
    const currentAchievements = this.loadAchievements();
    const newlyUnlocked: Achievement[] = [];
    
    // 각 업적 확인
    currentAchievements.forEach((achievement, index) => {
      // 이미 달성한 업적은 건너뛰기
      if (achievement.unlocked) return;
      
      // 업적 조건 확인
      if (achievement.condition(stats)) {
        // 업적 달성
        currentAchievements[index].unlocked = true;
        currentAchievements[index].unlockedAt = Date.now();
        newlyUnlocked.push(currentAchievements[index]);
      }
      
      // 진행 상황 업데이트
      const progressValue = achievement.progress(stats);
      currentAchievements[index].progressValue = progressValue;
    });
    
    // 변경된 업적 저장
    if (newlyUnlocked.length > 0) {
      this.saveAchievements(currentAchievements);
    }
    
    return {
      achievements: currentAchievements,
      newlyUnlocked
    };
  }

  /**
   * 업적 초기화
   */
  static resetAchievements(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 카테고리별 업적 필터링
   */
  static filterByCategory(achievements: Achievement[], category: string): Achievement[] {
    return achievements.filter(achievement => achievement.category === category);
  }

  /**
   * 달성한 업적 필터링
   */
  static filterUnlocked(achievements: Achievement[]): Achievement[] {
    return achievements.filter(achievement => achievement.unlocked);
  }

  /**
   * 미달성 업적 필터링
   */
  static filterLocked(achievements: Achievement[]): Achievement[] {
    return achievements.filter(achievement => !achievement.unlocked);
  }

  /**
   * 총 업적 포인트 계산
   */
  static calculateTotalPoints(achievements: Achievement[]): number {
    return achievements
      .filter(achievement => achievement.unlocked)
      .reduce((total, achievement) => total + achievement.points, 0);
  }
}
