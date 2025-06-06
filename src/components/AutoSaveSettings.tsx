import React from 'react';
import { AutoSaveSettings } from '../hooks/useAutoSave';
import '../styles/AutoSaveSettings.css';

interface AutoSaveSettingsProps {
  settings: AutoSaveSettings;
  onUpdateSettings: (settings: Partial<AutoSaveSettings>) => void;
  lastSaveTime: Date | null;
  onSaveNow: () => void;
}

/**
 * 자동 저장 설정 컴포넌트
 */
const AutoSaveSettingsComponent: React.FC<AutoSaveSettingsProps> = ({
  settings,
  onUpdateSettings,
  lastSaveTime,
  onSaveNow
}) => {
  // 인터벌 옵션
  const intervalOptions = [
    { value: 1, label: '1분' },
    { value: 2, label: '2분' },
    { value: 5, label: '5분' },
    { value: 10, label: '10분' }
  ];

  return (
    <div className="auto-save-settings">
      <h3>자동 저장 설정</h3>
      
      <div className="setting-row">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onUpdateSettings({ enabled: e.target.checked })}
          />
          자동 저장 활성화
        </label>
      </div>
      
      <div className="setting-row">
        <label className="setting-label">
          저장 주기:
          <select
            value={settings.interval}
            onChange={(e) => onUpdateSettings({ interval: Number(e.target.value) })}
            disabled={!settings.enabled}
          >
            {intervalOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      <div className="setting-row">
        <label className="setting-label">
          <input
            type="checkbox"
            checked={settings.saveOnExit}
            onChange={(e) => onUpdateSettings({ saveOnExit: e.target.checked })}
            disabled={!settings.enabled}
          />
          게임 종료 시 자동 저장
        </label>
      </div>
      
      <div className="setting-row save-status">
        <div className="last-save-time">
          {lastSaveTime ? (
            <>마지막 저장: {lastSaveTime.toLocaleTimeString()}</>
          ) : (
            <>아직 저장된 적 없음</>
          )}
        </div>
        
        <button className="save-now-button" onClick={onSaveNow}>
          지금 저장
        </button>
      </div>
    </div>
  );
};

export default AutoSaveSettingsComponent;
