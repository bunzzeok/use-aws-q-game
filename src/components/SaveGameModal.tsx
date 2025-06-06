import React, { useState } from 'react';
import { GameState } from '../types';
import { GameStorage } from '../utils/storage/gameStorage';
import '../styles/SaveGameModal.css';

interface SaveGameModalProps {
  gameState: GameState;
  autoNotesEnabled: boolean;
  onClose: () => void;
  onSave: (id: string) => void;
}

/**
 * 게임 저장 모달 컴포넌트
 */
const SaveGameModal: React.FC<SaveGameModalProps> = ({
  gameState,
  autoNotesEnabled,
  onClose,
  onSave
}) => {
  const [gameName, setGameName] = useState<string>(`게임 ${new Date().toLocaleString()}`);
  const [error, setError] = useState<string>('');

  // 게임 저장 처리
  const handleSave = () => {
    if (!gameName.trim()) {
      setError('게임 이름을 입력해주세요.');
      return;
    }

    // 게임 저장
    const id = GameStorage.saveGame(gameState, autoNotesEnabled, gameName);
    
    if (id) {
      onSave(id);
    } else {
      setError('게임 저장에 실패했습니다.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content save-game-modal">
        <h2>게임 저장</h2>
        
        <div className="form-group">
          <label htmlFor="game-name">게임 이름</label>
          <input
            id="game-name"
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="게임 이름을 입력하세요"
            autoFocus
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="game-info">
          <p>난이도: {getDifficultyText(gameState.difficulty)}</p>
          <p>진행 시간: {formatTime(gameState.timer)}</p>
          <p>오답 횟수: {gameState.errorCount}/5</p>
          <p>남은 힌트: {gameState.hintsRemaining}</p>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="save-button" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

// 난이도 텍스트 변환
function getDifficultyText(difficulty: number): string {
  switch (difficulty) {
    case 0: return '쉬움';
    case 1: return '중간';
    case 2: return '어려움';
    default: return '알 수 없음';
  }
}

// 시간 포맷팅 (초 -> 분:초)
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default SaveGameModal;
