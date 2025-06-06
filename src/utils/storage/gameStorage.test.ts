import { GameStorage, SavedGame } from './gameStorage';
import { CellState, Difficulty, GameState } from '../../types';

// localStorage 모킹
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('GameStorage', () => {
  // 테스트용 게임 상태 생성
  const createMockGameState = (): GameState => {
    const grid: CellState[][] = Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => ({
        value: null,
        isInitial: false,
        isValid: true,
        notes: []
      }))
    );
    
    // 일부 셀 초기값 설정
    for (let i = 0; i < 9; i++) {
      grid[i][i].value = i + 1;
      grid[i][i].isInitial = true;
    }
    
    // 일부 셀 사용자 입력값 설정
    grid[1][2].value = 3;
    grid[2][3].value = 4;
    
    return {
      grid,
      solution: Array(9).fill(null).map(() => Array(9).fill(5)),
      selectedCell: null,
      difficulty: Difficulty.MEDIUM,
      isComplete: false,
      isFailed: false,
      timer: 120,
      errorCount: 1,
      hintsRemaining: 2,
      isPaused: false
    };
  };
  
  beforeEach(() => {
    localStorageMock.clear();
  });
  
  test('게임 저장 및 불러오기', () => {
    const gameState = createMockGameState();
    const autoNotesEnabled = true;
    const name = '테스트 게임';
    
    // 게임 저장
    const id = GameStorage.saveGame(gameState, autoNotesEnabled, name);
    expect(id).toBeTruthy();
    
    // 저장된 게임 불러오기
    const savedGame = GameStorage.loadGame(id);
    expect(savedGame).not.toBeNull();
    expect(savedGame?.name).toBe(name);
    expect(savedGame?.difficulty).toBe(Difficulty.MEDIUM);
    expect(savedGame?.timer).toBe(120);
    expect(savedGame?.errorCount).toBe(1);
    expect(savedGame?.hintsRemaining).toBe(2);
    expect(savedGame?.autoNotesEnabled).toBe(true);
    
    // 그리드 데이터 확인
    expect(savedGame?.grid[1][1].value).toBe(2); // 초기값
    expect(savedGame?.grid[1][1].isInitial).toBe(true);
    expect(savedGame?.grid[1][2].value).toBe(3); // 사용자 입력값
    expect(savedGame?.grid[1][2].isInitial).toBe(false);
  });
  
  test('자동 저장 및 불러오기', () => {
    const gameState = createMockGameState();
    const autoNotesEnabled = true;
    
    // 자동 저장
    GameStorage.saveGame(gameState, autoNotesEnabled, undefined, true);
    
    // 자동 저장된 게임 확인
    expect(GameStorage.hasAutoSavedGame()).toBe(true);
    
    // 자동 저장된 게임 불러오기
    const savedGame = GameStorage.loadAutoSavedGame();
    expect(savedGame).not.toBeNull();
    expect(savedGame?.difficulty).toBe(Difficulty.MEDIUM);
    expect(savedGame?.timer).toBe(120);
  });
  
  test('게임 삭제', () => {
    const gameState = createMockGameState();
    
    // 게임 저장
    const id = GameStorage.saveGame(gameState, false, '삭제할 게임');
    
    // 저장된 게임 확인
    expect(GameStorage.getSavedGames().length).toBe(1);
    
    // 게임 삭제
    const result = GameStorage.deleteGame(id);
    expect(result).toBe(true);
    
    // 삭제 확인
    expect(GameStorage.getSavedGames().length).toBe(0);
  });
  
  test('자동 저장 게임 삭제', () => {
    const gameState = createMockGameState();
    
    // 자동 저장
    GameStorage.saveGame(gameState, false, undefined, true);
    
    // 자동 저장된 게임 확인
    expect(GameStorage.hasAutoSavedGame()).toBe(true);
    
    // 자동 저장 게임 삭제
    const result = GameStorage.deleteGame('auto');
    expect(result).toBe(true);
    
    // 삭제 확인
    expect(GameStorage.hasAutoSavedGame()).toBe(false);
  });
  
  test('모든 게임 삭제', () => {
    const gameState = createMockGameState();
    
    // 일반 게임 저장
    GameStorage.saveGame(gameState, false, '게임 1');
    GameStorage.saveGame(gameState, false, '게임 2');
    
    // 자동 저장
    GameStorage.saveGame(gameState, false, undefined, true);
    
    // 저장된 게임 확인
    expect(GameStorage.getSavedGames().length).toBe(2);
    expect(GameStorage.hasAutoSavedGame()).toBe(true);
    
    // 모든 게임 삭제
    GameStorage.deleteAllGames();
    
    // 삭제 확인
    expect(GameStorage.getSavedGames().length).toBe(0);
    expect(GameStorage.hasAutoSavedGame()).toBe(false);
  });
  
  test('저장된 게임 정보 목록 불러오기', () => {
    const gameState = createMockGameState();
    
    // 게임 저장
    GameStorage.saveGame(gameState, false, '게임 1');
    GameStorage.saveGame(gameState, true, '게임 2');
    
    // 저장된 게임 정보 목록 불러오기
    const infoList = GameStorage.getSavedGameInfoList();
    
    // 정보 확인
    expect(infoList.length).toBe(2);
    expect(infoList[0].name).toBe('게임 1');
    expect(infoList[1].name).toBe('게임 2');
    
    // 완료율 확인 (2개의 셀이 채워짐)
    expect(infoList[0].completionPercentage).toBeGreaterThan(0);
  });
  
  test('완료되거나 실패한 게임은 저장되지 않음', () => {
    const gameState = createMockGameState();
    
    // 완료된 게임
    const completedGame = { ...gameState, isComplete: true };
    const completedId = GameStorage.saveGame(completedGame, false);
    expect(completedId).toBe('');
    
    // 실패한 게임
    const failedGame = { ...gameState, isFailed: true };
    const failedId = GameStorage.saveGame(failedGame, false);
    expect(failedId).toBe('');
    
    // 저장된 게임 확인
    expect(GameStorage.getSavedGames().length).toBe(0);
  });
});
