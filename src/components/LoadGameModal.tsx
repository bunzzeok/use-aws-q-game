import React, { useEffect, useState } from 'react';
import { GameStorage, SavedGameInfo } from '../utils/storage/gameStorage';
import '../styles/Modal.css';
import '../styles/LoadGameModal.css';

interface LoadGameModalProps {
  onClose: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * 게임 불러오기 모달 컴포넌트
 */
const LoadGameModal: React.FC<LoadGameModalProps> = ({
  onClose,
  onLoad,
  onDelete
}) => {
  const [savedGames, setSavedGames] = useState<SavedGameInfo[]>([]);
  const [hasAutoSave, setHasAutoSave] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // 컴포넌트 마운트 시 저장된 게임 목록 불러오기
  useEffect(() => {
    loadSavedGames();
  }, []);

  // 저장된 게임 목록 불러오기
  const loadSavedGames = () => {
    const games = GameStorage.getSavedGameInfoList();
    setSavedGames(games);
    setHasAutoSave(GameStorage.hasAutoSavedGame());
  };

  // 게임 불러오기
  const handleLoad = (id: string) => {
    onLoad(id);
  };

  // 게임 삭제
  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      GameStorage.deleteGame(id);
      loadSavedGames();
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  // 자동 저장 게임 불러오기
  const handleLoadAutoSave = () => {
    onLoad('auto');
  };

  // 자동 저장 게임 삭제
  const handleDeleteAutoSave = () => {
    if (confirmDelete === 'auto') {
      GameStorage.deleteGame('auto');
      setHasAutoSave(false);
      setConfirmDelete(null);
    } else {
      setConfirmDelete('auto');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content load-game-modal">
        <h2>저장된 게임 불러오기</h2>
        
        {hasAutoSave && (
          <div className="auto-save-section">
            <h3>자동 저장된 게임</h3>
            <div className="auto-save-actions">
              <button className="modal-button primary-button" onClick={handleLoadAutoSave}>
                불러오기
              </button>
              <button 
                className={`modal-button ${confirmDelete === 'auto' ? 'danger-button' : 'secondary-button'}`}
                onClick={handleDeleteAutoSave}
              >
                {confirmDelete === 'auto' ? '삭제 확인' : '삭제'}
              </button>
            </div>
          </div>
        )}
        
        <div className="saved-games-list">
          <h3>저장된 게임 목록</h3>
          
          {savedGames.length === 0 ? (
            <p className="no-games-message">저장된 게임이 없습니다.</p>
          ) : (
            <ul className="games-list">
              {savedGames.map((game) => (
                <li key={game.id} className="saved-game-item">
                  <div className="game-info">
                    <h4>{game.name}</h4>
                    <div className="game-details">
                      <div className="game-detail-item">
                        <span className="game-detail-label">난이도:</span>
                        <span className="game-detail-value">{getDifficultyText(game.difficulty)}</span>
                      </div>
                      <div className="game-detail-item">
                        <span className="game-detail-label">진행 시간:</span>
                        <span className="game-detail-value">{formatTime(game.timer)}</span>
                      </div>
                      <div className="game-detail-item">
                        <span className="game-detail-label">완료율:</span>
                        <span className="game-detail-value">{game.completionPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="game-actions">
                    <button className="modal-button primary-button" onClick={() => handleLoad(game.id)}>
                      불러오기
                    </button>
                    <button 
                      className={`modal-button ${confirmDelete === game.id ? 'danger-button' : 'secondary-button'}`}
                      onClick={() => handleDelete(game.id)}
                    >
                      {confirmDelete === game.id ? '삭제 확인' : '삭제'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="modal-actions">
          <button className="modal-button secondary-button" onClick={onClose}>닫기</button>
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

export default LoadGameModal;
