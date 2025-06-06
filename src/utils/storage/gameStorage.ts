import { CellState, Difficulty, GameState } from '../../types/index';

/**
 * 저장된 게임 정보 인터페이스
 */
export interface SavedGame {
  id: string;
  timestamp: number;
  name: string;
  difficulty: Difficulty;
  grid: CellState[][];
  initialGrid: CellState[][];
  solution: number[][];
  timer: number;
  errorCount: number;
  hintsRemaining: number;
  autoNotesEnabled: boolean;
}

/**
 * 저장된 게임 목록 인터페이스
 */
export interface SavedGameInfo {
  id: string;
  name: string;
  timestamp: number;
  difficulty: Difficulty;
  timer: number;
  completionPercentage: number;
}

// 로컬 스토리지 키
const SAVED_GAMES_KEY = 'sudoku_saved_games';
const AUTO_SAVE_KEY = 'sudoku_auto_save';

/**
 * 게임 저장 및 불러오기 유틸리티 클래스
 */
export class GameStorage {
  /**
   * 게임 저장
   * @param gameState 현재 게임 상태
   * @param autoNotesEnabled 자동 메모 활성화 여부
   * @param name 저장 이름 (기본값: 현재 날짜/시간)
   * @param isAutoSave 자동 저장 여부
   * @returns 저장된 게임 ID
   */
  static saveGame(
    gameState: GameState,
    autoNotesEnabled: boolean,
    name?: string,
    isAutoSave: boolean = false
  ): string {
    // 이미 완료되었거나 실패한 게임은 저장하지 않음
    if (gameState.isComplete || gameState.isFailed) {
      return '';
    }

    const timestamp = Date.now();
    const id = `game_${timestamp}`;
    const gameName = name || `게임 ${new Date(timestamp).toLocaleString()}`;

    const savedGame: SavedGame = {
      id,
      timestamp,
      name: gameName,
      difficulty: gameState.difficulty,
      grid: JSON.parse(JSON.stringify(gameState.grid)), // 깊은 복사
      initialGrid: JSON.parse(JSON.stringify(gameState.initialGrid)), // 깊은 복사
      solution: JSON.parse(JSON.stringify(gameState.solution)), // 깊은 복사
      timer: gameState.timer,
      errorCount: gameState.errorCount,
      hintsRemaining: gameState.hintsRemaining,
      autoNotesEnabled
    };

    if (isAutoSave) {
      // 자동 저장은 별도 키에 저장
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(savedGame));
    } else {
      // 기존 저장 목록 불러오기
      const savedGames = this.getSavedGames();
      
      // 새 게임 추가
      savedGames.push(savedGame);
      
      // 저장 (최대 10개까지만 저장)
      localStorage.setItem(
        SAVED_GAMES_KEY,
        JSON.stringify(savedGames.slice(-10))
      );
    }

    return id;
  }

  /**
   * 자동 저장된 게임 불러오기
   * @returns 자동 저장된 게임 또는 null
   */
  static loadAutoSavedGame(): SavedGame | null {
    const savedGameJson = localStorage.getItem(AUTO_SAVE_KEY);
    if (!savedGameJson) return null;

    try {
      return JSON.parse(savedGameJson) as SavedGame;
    } catch (error) {
      console.error('자동 저장된 게임을 불러오는 중 오류 발생:', error);
      return null;
    }
  }

  /**
   * 저장된 게임 불러오기
   * @param id 게임 ID
   * @returns 저장된 게임 또는 null
   */
  static loadGame(id: string): SavedGame | null {
    // 자동 저장된 게임인 경우
    if (id === 'auto') {
      return this.loadAutoSavedGame();
    }

    // 일반 저장 게임 목록에서 검색
    const savedGames = this.getSavedGames();
    const game = savedGames.find(game => game.id === id);
    return game || null;
  }

  /**
   * 저장된 모든 게임 불러오기
   * @returns 저장된 게임 배열
   */
  static getSavedGames(): SavedGame[] {
    const savedGamesJson = localStorage.getItem(SAVED_GAMES_KEY);
    if (!savedGamesJson) return [];

    try {
      return JSON.parse(savedGamesJson) as SavedGame[];
    } catch (error) {
      console.error('저장된 게임 목록을 불러오는 중 오류 발생:', error);
      return [];
    }
  }

  /**
   * 저장된 게임 정보 목록 불러오기
   * @returns 저장된 게임 정보 배열
   */
  static getSavedGameInfoList(): SavedGameInfo[] {
    const savedGames = this.getSavedGames();
    
    return savedGames.map(game => {
      // 완료율 계산 (채워진 셀 / 전체 셀)
      let filledCells = 0;
      let totalEmptyCells = 0;
      
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!game.grid[r][c].isInitial) {
            totalEmptyCells++;
            if (game.grid[r][c].value !== null) {
              filledCells++;
            }
          }
        }
      }
      
      const completionPercentage = totalEmptyCells > 0
        ? Math.round((filledCells / totalEmptyCells) * 100)
        : 0;
      
      return {
        id: game.id,
        name: game.name,
        timestamp: game.timestamp,
        difficulty: game.difficulty,
        timer: game.timer,
        completionPercentage
      };
    });
  }

  /**
   * 저장된 게임 삭제
   * @param id 게임 ID
   * @returns 삭제 성공 여부
   */
  static deleteGame(id: string): boolean {
    // 자동 저장 게임 삭제
    if (id === 'auto') {
      localStorage.removeItem(AUTO_SAVE_KEY);
      return true;
    }

    // 일반 저장 게임 삭제
    const savedGames = this.getSavedGames();
    const filteredGames = savedGames.filter(game => game.id !== id);
    
    if (filteredGames.length === savedGames.length) {
      return false; // 삭제할 게임이 없음
    }
    
    localStorage.setItem(SAVED_GAMES_KEY, JSON.stringify(filteredGames));
    return true;
  }

  /**
   * 모든 저장된 게임 삭제
   */
  static deleteAllGames(): void {
    localStorage.removeItem(SAVED_GAMES_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
  }

  /**
   * 자동 저장된 게임이 있는지 확인
   * @returns 자동 저장된 게임 존재 여부
   */
  static hasAutoSavedGame(): boolean {
    return localStorage.getItem(AUTO_SAVE_KEY) !== null;
  }
}
