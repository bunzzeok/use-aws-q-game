import { AchievementManager } from './achievementManager';
import { achievements, AchievementCategory } from './achievementData';
import { Difficulty } from '../../types';

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AchievementManager', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('loadAchievements returns default achievements when no data exists', () => {
    const loadedAchievements = AchievementManager.loadAchievements();
    expect(loadedAchievements.length).toBe(achievements.length);
    expect(loadedAchievements[0].unlocked).toBe(false);
  });

  test('saveAchievements stores data in localStorage', () => {
    const testAchievements = [...achievements];
    testAchievements[0].unlocked = true;
    testAchievements[0].unlockedAt = 123456789;
    
    AchievementManager.saveAchievements(testAchievements);
    
    const savedData = localStorageMock.getItem('sudoku_achievements');
    expect(savedData).not.toBeNull();
    
    const parsedData = JSON.parse(savedData!);
    expect(parsedData[0].unlocked).toBe(true);
    expect(parsedData[0].unlockedAt).toBe(123456789);
  });

  test('checkAchievements correctly identifies newly unlocked achievements', () => {
    // 테스트용 통계 데이터 생성
    const testStats = {
      totalGames: 5,
      completedGames: 3,
      bestTimes: {
        [Difficulty.EASY]: 200,
        [Difficulty.MEDIUM]: 400,
        [Difficulty.HARD]: null,
      },
      averageTimes: {
        [Difficulty.EASY]: 250,
        [Difficulty.MEDIUM]: 450,
        [Difficulty.HARD]: null,
      },
      winRate: 60,
      hintsUsed: 10,
      mistakesMade: 5,
      lastPlayed: Date.now(),
      streakDays: 1,
    };
    
    const result = AchievementManager.checkAchievements(testStats);
    
    // 첫 승리와 5게임 플레이 업적이 달성되어야 함
    const firstWinAchievement = result.achievements.find(a => a.id === 'first_win');
    const fiveGamesAchievement = result.achievements.find(a => a.id === 'five_games');
    
    expect(firstWinAchievement?.unlocked).toBe(true);
    expect(fiveGamesAchievement?.unlocked).toBe(true);
    
    // 참고: 실제 newlyUnlocked 길이는 구현에 따라 달라질 수 있음
    // 여기서는 최소 1개 이상의 업적이 달성되었는지만 확인
    expect(result.newlyUnlocked.length).toBeGreaterThan(0);
  });

  test('filterByCategory returns achievements of specified category', () => {
    const allAchievements = AchievementManager.loadAchievements();
    const beginnerAchievements = AchievementManager.filterByCategory(
      allAchievements, 
      AchievementCategory.BEGINNER
    );
    
    expect(beginnerAchievements.length).toBeGreaterThan(0);
    expect(beginnerAchievements.every(a => a.category === AchievementCategory.BEGINNER)).toBe(true);
  });

  test('calculateTotalPoints returns correct sum of unlocked achievement points', () => {
    const testAchievements = [...achievements];
    testAchievements[0].unlocked = true; // 10 points
    testAchievements[1].unlocked = true; // 20 points
    
    const totalPoints = AchievementManager.calculateTotalPoints(testAchievements);
    expect(totalPoints).toBe(30);
  });

  test('resetAchievements clears all achievement data', () => {
    // 먼저 업적 데이터 저장
    const testAchievements = [...achievements];
    testAchievements[0].unlocked = true;
    AchievementManager.saveAchievements(testAchievements);
    
    // 업적 초기화
    AchievementManager.resetAchievements();
    
    // localStorage에서 데이터가 삭제되었는지 확인
    const savedData = localStorage.getItem('sudoku_achievements');
    expect(savedData).toBeNull();
  });
});
