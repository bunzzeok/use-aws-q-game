import React from 'react';
import '../styles/AutoSaveModal.css';

interface AutoSaveModalProps {
  onClose: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

/**
 * 자동 저장된 게임 불러오기 확인 모달 컴포넌트
 */
const AutoSaveModal: React.FC<AutoSaveModalProps> = ({
  onClose,
  onLoad,
  onDelete
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content auto-save-modal">
        <h2>자동 저장된 게임</h2>
        
        <p className="auto-save-message">
          이전에 플레이하던 게임이 자동 저장되어 있습니다. 불러오시겠습니까?
        </p>
        
        <div className="modal-actions">
          <button className="delete-button" onClick={onDelete}>
            삭제하기
          </button>
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button className="load-button" onClick={onLoad}>
            불러오기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveModal;
