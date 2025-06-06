import { GameStatistics } from '../statistics/gameStatistics';
import { Difficulty } from '../../types';

/**
 * 업적 카테고리
 */
export enum AchievementCategory {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERT = 'expert',
  SPECIAL = 'special'
}

/**
 * 업적 데이터 인터페이스
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: GameStatistics) => boolean;
  progress: (stats: GameStatistics) => number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt: number | null;
  category: AchievementCategory;
  points: number;
  progressValue?: number;
}

/**
 * 업적 목록
 */
export const achievements: Achievement[] = [
  // 초보자 업적
  {
    id: 'first_win',
    title: '첫 승리',
    description: '첫 번째 스도쿠 게임을 완료하세요.',
    icon: '🏆',
    condition: (stats: GameStatistics) => stats.completedGames >= 1,
    progress: (stats: GameStatistics) => Math.min(stats.completedGames, 1),
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.BEGINNER,
    points: 10
  },
  {
    id: 'five_games',
    title: '열정적인 플레이어',
    description: '5개의 게임을 플레이하세요.',
    icon: '🎮',
    condition: (stats: GameStatistics) => stats.totalGames >= 5,
    progress: (stats: GameStatistics) => Math.min(stats.totalGames, 5),
    maxProgress: 5,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.BEGINNER,
    points: 20
  },
  {
    id: 'all_difficulties',
    title: '모든 난이도 도전',
    description: '모든 난이도의 게임을 최소 한 번씩 완료하세요.',
    icon: '🌟',
    condition: (stats: GameStatistics) => 
      stats.bestTimes[Difficulty.EASY] !== null && 
      stats.bestTimes[Difficulty.MEDIUM] !== null && 
      stats.bestTimes[Difficulty.HARD] !== null,
    progress: (stats: GameStatistics) => {
      let count = 0;
      if (stats.bestTimes[Difficulty.EASY] !== null) count++;
      if (stats.bestTimes[Difficulty.MEDIUM] !== null) count++;
      if (stats.bestTimes[Difficulty.HARD] !== null) count++;
      return count;
    },
    maxProgress: 3,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.BEGINNER,
    points: 30
  },
  
  // 중급자 업적
  {
    id: 'speed_runner_easy',
    title: '스피드 러너: 쉬움',
    description: '쉬움 난이도를 3분(180초) 이내에 완료하세요.',
    icon: '⏱️',
    condition: (stats: GameStatistics) => 
      stats.bestTimes[Difficulty.EASY] !== null && 
      stats.bestTimes[Difficulty.EASY]! <= 180,
    progress: (stats: GameStatistics) => {
      if (stats.bestTimes[Difficulty.EASY] === null) return 0;
      if (stats.bestTimes[Difficulty.EASY]! <= 180) return 1;
      return 0;
    },
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.INTERMEDIATE,
    points: 40
  },
  {
    id: 'speed_runner_medium',
    title: '스피드 러너: 중간',
    description: '중간 난이도를 5분(300초) 이내에 완료하세요.',
    icon: '🏃',
    condition: (stats: GameStatistics) => 
      stats.bestTimes[Difficulty.MEDIUM] !== null && 
      stats.bestTimes[Difficulty.MEDIUM]! <= 300,
    progress: (stats: GameStatistics) => {
      if (stats.bestTimes[Difficulty.MEDIUM] === null) return 0;
      if (stats.bestTimes[Difficulty.MEDIUM]! <= 300) return 1;
      return 0;
    },
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.INTERMEDIATE,
    points: 50
  },
  {
    id: 'win_streak',
    title: '연승 기록',
    description: '3일 연속으로 게임을 플레이하세요.',
    icon: '📅',
    condition: (stats: GameStatistics) => stats.streakDays >= 3,
    progress: (stats: GameStatistics) => Math.min(stats.streakDays, 3),
    maxProgress: 3,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.INTERMEDIATE,
    points: 30
  },
  
  // 전문가 업적
  {
    id: 'speed_runner_hard',
    title: '스피드 러너: 어려움',
    description: '어려움 난이도를 10분(600초) 이내에 완료하세요.',
    icon: '🚀',
    condition: (stats: GameStatistics) => 
      stats.bestTimes[Difficulty.HARD] !== null && 
      stats.bestTimes[Difficulty.HARD]! <= 600,
    progress: (stats: GameStatistics) => {
      if (stats.bestTimes[Difficulty.HARD] === null) return 0;
      if (stats.bestTimes[Difficulty.HARD]! <= 600) return 1;
      return 0;
    },
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.EXPERT,
    points: 70
  },
  {
    id: 'perfect_game',
    title: '퍼펙트 게임',
    description: '실수 없이 어려움 난이도를 완료하세요.',
    icon: '💯',
    condition: (stats: GameStatistics) => {
      // 이 조건은 실제로는 게임 완료 시 실수 횟수를 확인해야 함
      // 여기서는 간단한 구현을 위해 통계 데이터만 사용
      return stats.bestTimes[Difficulty.HARD] !== null && stats.mistakesMade === 0;
    },
    progress: (stats: GameStatistics) => {
      if (stats.bestTimes[Difficulty.HARD] !== null && stats.mistakesMade === 0) return 1;
      return 0;
    },
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.EXPERT,
    points: 100
  },
  {
    id: 'sudoku_master',
    title: '스도쿠 마스터',
    description: '모든 난이도에서 10게임 이상 완료하세요.',
    icon: '👑',
    condition: (stats: GameStatistics) => stats.completedGames >= 30,
    progress: (stats: GameStatistics) => Math.min(stats.completedGames, 30),
    maxProgress: 30,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.EXPERT,
    points: 150
  },
  
  // 특별 업적
  {
    id: 'night_owl',
    title: '야행성',
    description: '밤 10시부터 새벽 5시 사이에 게임을 완료하세요.',
    icon: '🦉',
    condition: (stats: GameStatistics) => {
      // 이 조건은 실제로는 게임 완료 시간을 확인해야 함
      // 여기서는 간단한 구현을 위해 항상 false 반환
      return false;
    },
    progress: (stats: GameStatistics) => 0,
    maxProgress: 1,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.SPECIAL,
    points: 50
  },
  {
    id: 'weekend_warrior',
    title: '주말 전사',
    description: '주말에 5게임 이상 완료하세요.',
    icon: '🏄',
    condition: (stats: GameStatistics) => {
      // 이 조건은 실제로는 게임 완료 요일을 확인해야 함
      // 여기서는 간단한 구현을 위해 항상 false 반환
      return false;
    },
    progress: (stats: GameStatistics) => 0,
    maxProgress: 5,
    unlocked: false,
    unlockedAt: null,
    category: AchievementCategory.SPECIAL,
    points: 40
  }
];
