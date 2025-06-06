import { GameStatisticsManager, GameResult } from './gameStatistics';
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

describe('GameStatisticsManager', () => {
  beforeEach(() => {
    localStorageMock.clear();
    
    // 날짜 모킹 (스트릭 테스트를 위해)
    jest.spyOn(Date, 'now').mockImplementation(() => 1717171717171); // 고정된 타임스탬프
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('loadStatistics returns default statistics when no data exists', () => {
    const stats = GameStatisticsManager.loadStatistics();
    expect(stats.totalGames).toBe(0);
    expect(stats.completedGames).toBe(0);
    expect(stats.bestTimes[Difficulty.EASY]).toBeNull();
    expect(stats.bestTimes[Difficulty.MEDIUM]).toBeNull();
    expect(stats.bestTimes[Difficulty.HARD]).toBeNull();
    expect(stats.winRate).toBe(0);
  });

  test('saveStatistics stores data in localStorage', () => {
    const mockStats = {
      totalGames: 5,
      completedGames: 3,
      bestTimes: {
        [Difficulty.EASY]: 120,
        [Difficulty.MEDIUM]: 300,
        [Difficulty.HARD]: null,
      },
      averageTimes: {
        [Difficulty.EASY]: 150,
        [Difficulty.MEDIUM]: 350,
        [Difficulty.HARD]: null,
      },
      winRate: 60,
      hintsUsed: 10,
      mistakesMade: 15,
      lastPlayed: Date.now(),
      streakDays: 2,
    };

    GameStatisticsManager.saveStatistics(mockStats);
    
    const savedData = localStorageMock.getItem('sudoku_game_statistics');
    expect(savedData).not.toBeNull();
    
    const parsedData = JSON.parse(savedData!);
    expect(parsedData.totalGames).toBe(5);
    expect(parsedData.completedGames).toBe(3);
    expect(parsedData.bestTimes[Difficulty.EASY]).toBe(120);
    expect(parsedData.winRate).toBe(60);
  });

  test('recordGameResult updates statistics correctly for completed game', () => {
    const gameResult: GameResult = {
      difficulty: Difficulty.EASY,
      completed: true,
      time: 180,
      hintsUsed: 2,
      mistakesMade: 3,
      timestamp: Date.now(),
    };

    const updatedStats = GameStatisticsManager.recordGameResult(gameResult);
    
    expect(updatedStats.totalGames).toBe(1);
    expect(updatedStats.completedGames).toBe(1);
    expect(updatedStats.bestTimes[Difficulty.EASY]).toBe(180);
    expect(updatedStats.hintsUsed).toBe(2);
    expect(updatedStats.mistakesMade).toBe(3);
    expect(updatedStats.winRate).toBe(100);
  });

  test('recordGameResult updates statistics correctly for failed game', () => {
    const gameResult: GameResult = {
      difficulty: Difficulty.MEDIUM,
      completed: false,
      time: 250,
      hintsUsed: 3,
      mistakesMade: 5,
      timestamp: Date.now(),
    };

    const updatedStats = GameStatisticsManager.recordGameResult(gameResult);
    
    expect(updatedStats.totalGames).toBe(1);
    expect(updatedStats.completedGames).toBe(0);
    expect(updatedStats.bestTimes[Difficulty.MEDIUM]).toBeNull();
    expect(updatedStats.hintsUsed).toBe(3);
    expect(updatedStats.mistakesMade).toBe(5);
    expect(updatedStats.winRate).toBe(0);
  });

  test('resetStatistics clears all statistics', () => {
    // 먼저 통계 데이터 추가
    const gameResult: GameResult = {
      difficulty: Difficulty.EASY,
      completed: true,
      time: 180,
      hintsUsed: 2,
      mistakesMade: 3,
      timestamp: Date.now(),
    };
    
    GameStatisticsManager.recordGameResult(gameResult);
    
    // 통계 초기화
    GameStatisticsManager.resetStatistics();
    
    // localStorage에서 데이터가 삭제되었는지 확인
    const savedData = localStorage.getItem('sudoku_game_statistics');
    expect(savedData).toBeNull();
  });
});
