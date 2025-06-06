import React from 'react';
import '../styles/GameMenu.css';

interface GameMenuProps {
  onSaveGame: () => void;
  onLoadGame: () => void;
  onNewGame: () => void;
  onSettings: () => void;
  onStatistics: () => void;
  isGameStarted: boolean;
  isGameOver: boolean;
}

/**
 * 게임 메뉴 컴포넌트
 */
const GameMenu: React.FC<GameMenuProps> = ({
  onSaveGame,
  onLoadGame,
  onNewGame,
  onSettings,
  onStatistics,
  isGameStarted,
  isGameOver
}) => {
  return (
    <div className="game-menu">
      <button 
        className="menu-button new-game-button"
        onClick={onNewGame}
        title="새 게임 시작"
      >
        새 게임
      </button>
      
      <button 
        className="menu-button save-button"
        onClick={onSaveGame}
        disabled={!isGameStarted || isGameOver}
        title={!isGameStarted ? "게임이 시작되지 않았습니다" : 
               isGameOver ? "완료된 게임은 저장할 수 없습니다" : 
               "현재 게임 저장"}
      >
        저장
      </button>
      
      <button 
        className="menu-button load-button"
        onClick={onLoadGame}
        title="저장된 게임 불러오기"
      >
        불러오기
      </button>
      
      <button 
        className="menu-button settings-button"
        onClick={onSettings}
        title="게임 설정"
      >
        설정
      </button>
      
      <button 
        className="menu-button statistics-button"
        onClick={onStatistics}
        title="게임 통계"
      >
        통계
      </button>
    </div>
  );
};

export default GameMenu;
