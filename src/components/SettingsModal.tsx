import React from 'react';
import AutoSaveSettingsComponent from './AutoSaveSettings';
import { AutoSaveSettings } from '../hooks/useAutoSave';
import '../styles/SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
  autoSaveSettings: AutoSaveSettings;
  onUpdateAutoSaveSettings: (settings: Partial<AutoSaveSettings>) => void;
  lastSaveTime: Date | null;
  onSaveNow: () => void;
}

/**
 * 게임 설정 모달 컴포넌트
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  autoSaveSettings,
  onUpdateAutoSaveSettings,
  lastSaveTime,
  onSaveNow
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <h2>게임 설정</h2>
        
        <div className="settings-section">
          <AutoSaveSettingsComponent
            settings={autoSaveSettings}
            onUpdateSettings={onUpdateAutoSaveSettings}
            lastSaveTime={lastSaveTime}
            onSaveNow={onSaveNow}
          />
        </div>
        
        <div className="modal-actions">
          <button className="close-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
