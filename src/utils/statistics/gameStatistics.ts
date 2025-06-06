import { Difficulty } from '../../types';

/**
 * 게임 통계 데이터 인터페이스
 */
export interface GameStatistics {
  totalGames: number;
  completedGames: number;
  bestTimes: {
    [Difficulty.EASY]: number | null;
    [Difficulty.MEDIUM]: number | null;
    [Difficulty.HARD]: number | null;
  };
  averageTimes: {
    [Difficulty.EASY]: number | null;
    [Difficulty.MEDIUM]: number | null;
    [Difficulty.HARD]: number | null;
  };
  winRate: number;
  hintsUsed: number;
  mistakesMade: number;
  lastPlayed: number;
  streakDays: number;
}

/**
 * 게임 결과 데이터 인터페이스
 */
export interface GameResult {
  difficulty: Difficulty;
  completed: boolean;
  time: number;
  hintsUsed: number;
  mistakesMade: number;
  timestamp: number;
}

/**
 * 기본 통계 데이터
 */
const DEFAULT_STATISTICS: GameStatistics = {
  totalGames: 0,
  completedGames: 0,
  bestTimes: {
    [Difficulty.EASY]: null,
    [Difficulty.MEDIUM]: null,
    [Difficulty.HARD]: null,
  },
  averageTimes: {
    [Difficulty.EASY]: null,
    [Difficulty.MEDIUM]: null,
    [Difficulty.HARD]: null,
  },
  winRate: 0,
  hintsUsed: 0,
  mistakesMade: 0,
  lastPlayed: 0,
  streakDays: 0,
};

/**
 * 게임 통계 관리 클래스
 */
export class GameStatisticsManager {
  private static readonly STORAGE_KEY = 'sudoku_game_statistics';

  /**
   * 통계 데이터 로드
   */
  static loadStatistics(): GameStatistics {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (!savedData) {
        return { ...DEFAULT_STATISTICS };
      }
      
      const parsedData = JSON.parse(savedData) as GameStatistics;
      return parsedData;
    } catch (error) {
      console.error('통계 데이터 로드 중 오류 발생:', error);
      return { ...DEFAULT_STATISTICS };
    }
  }

  /**
   * 통계 데이터 저장
   */
  static saveStatistics(statistics: GameStatistics): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(statistics));
    } catch (error) {
      console.error('통계 데이터 저장 중 오류 발생:', error);
    }
  }

  /**
   * 게임 결과 기록
   */
  static recordGameResult(result: GameResult): GameStatistics {
    const currentStats = this.loadStatistics();
    
    // 총 게임 수 증가
    currentStats.totalGames += 1;
    
    // 완료된 게임 수 증가
    if (result.completed) {
      currentStats.completedGames += 1;
    }
    
    // 승률 계산
    currentStats.winRate = (currentStats.completedGames / currentStats.totalGames) * 100;
    
    // 힌트 사용 횟수 증가
    currentStats.hintsUsed += result.hintsUsed;
    
    // 실수 횟수 증가
    currentStats.mistakesMade += result.mistakesMade;
    
    // 마지막 플레이 시간 업데이트
    currentStats.lastPlayed = result.timestamp;
    
    // 연속 플레이 일수 계산
    const lastPlayedDate = new Date(currentStats.lastPlayed).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    
    if (lastPlayedDate === today) {
      // 오늘 이미 플레이한 경우 스트릭 유지
    } else if (lastPlayedDate === today - 86400000) { // 86400000 = 24시간(밀리초)
      // 어제 플레이한 경우 스트릭 증가
      currentStats.streakDays += 1;
    } else {
      // 하루 이상 건너뛴 경우 스트릭 초기화
      currentStats.streakDays = 1;
    }
    
    // 완료된 게임인 경우 최고 기록 및 평균 시간 업데이트
    if (result.completed) {
      const difficulty = result.difficulty;
      
      // 최고 기록 업데이트
      if (currentStats.bestTimes[difficulty] === null || result.time < currentStats.bestTimes[difficulty]!) {
        currentStats.bestTimes[difficulty] = result.time;
      }
      
      // 평균 시간 계산을 위한 임시 변수
      const difficultyGames = this.getCompletedGamesByDifficulty(difficulty);
      const currentAverage = currentStats.averageTimes[difficulty] || 0;
      
      // 새로운 평균 계산
      if (difficultyGames === 0) {
        currentStats.averageTimes[difficulty] = result.time;
      } else {
        // 가중 평균 계산: (기존 평균 * 기존 게임 수 + 새 시간) / (기존 게임 수 + 1)
        currentStats.averageTimes[difficulty] = 
          (currentAverage * difficultyGames + result.time) / (difficultyGames + 1);
      }
    }
    
    // 통계 저장
    this.saveStatistics(currentStats);
    
    return currentStats;
  }

  /**
   * 통계 초기화
   */
  static resetStatistics(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * 난이도별 완료된 게임 수 조회
   */
  private static getCompletedGamesByDifficulty(difficulty: Difficulty): number {
    // 실제 구현에서는 난이도별 완료 게임 수를 저장하는 필드를 추가하는 것이 좋음
    // 여기서는 간단한 구현을 위해 0을 반환
    return 0;
  }
}
