import React, { useState } from 'react';
import { GameState } from '../types';
import { GameStorage } from '../utils/storage/gameStorage';
import '../styles/Modal.css';
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
          <div className="game-info-item">
            <span className="game-info-label">난이도</span>
            <span className="game-info-value">{getDifficultyText(gameState.difficulty)}</span>
          </div>
          <div className="game-info-item">
            <span className="game-info-label">진행 시간</span>
            <span className="game-info-value">{formatTime(gameState.timer)}</span>
          </div>
          <div className="game-info-item">
            <span className="game-info-label">오답 횟수</span>
            <span className="game-info-value">{gameState.errorCount}/5</span>
          </div>
          <div className="game-info-item">
            <span className="game-info-label">남은 힌트</span>
            <span className="game-info-value">{gameState.hintsRemaining}</span>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="modal-button secondary-button" onClick={onClose}>취소</button>
          <button className="modal-button primary-button" onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
};

// 난이도 텍스트 변환
function getDifficultyText(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return '쉬움';
    case 'medium': return '중간';
    case 'hard': return '어려움';
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
