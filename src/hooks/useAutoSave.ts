import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types';
import { GameStorage } from '../utils/storage/gameStorage';

/**
 * 자동 저장 설정 타입
 */
export type AutoSaveSettings = {
  enabled: boolean;
  interval: number; // 분 단위
  saveOnExit: boolean;
};

/**
 * 자동 저장 관리 커스텀 훅
 */
export const useAutoSave = (
  gameState: GameState,
  gameStarted: boolean,
  autoNotesEnabled: boolean,
  setShowAutoSaveModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // 자동 저장 설정
  const [autoSaveSettings, setAutoSaveSettings] = useState<AutoSaveSettings>({
    enabled: true,
    interval: 2, // 기본 2분
    saveOnExit: true
  });
  
  // 자동 저장 인터벌
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);
  
  // 마지막 저장 시간
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // 자동 저장 설정 변경 핸들러
  const updateAutoSaveSettings = useCallback((settings: Partial<AutoSaveSettings>) => {
    setAutoSaveSettings(prev => {
      const newSettings = { ...prev, ...settings };
      
      // 로컬 스토리지에 설정 저장
      localStorage.setItem('autoSaveSettings', JSON.stringify(newSettings));
      
      return newSettings;
    });
  }, []);

  // 자동 저장 실행
  const performAutoSave = useCallback(() => {
    if (gameStarted && !gameState.isComplete && !gameState.isFailed) {
      GameStorage.saveGame(gameState, autoNotesEnabled, undefined, true);
      setLastSaveTime(new Date());
    }
  }, [gameStarted, gameState, autoNotesEnabled]);

  // 자동 저장 인터벌 설정
  useEffect(() => {
    // 이전 인터벌 정리
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
    }
    
    // 자동 저장이 활성화되어 있고 게임이 시작된 경우에만 인터벌 설정
    if (autoSaveSettings.enabled && gameStarted && !gameState.isComplete && !gameState.isFailed) {
      const interval = setInterval(() => {
        performAutoSave();
      }, autoSaveSettings.interval * 60 * 1000); // 분 단위를 밀리초로 변환
      
      setAutoSaveInterval(interval);
    }
    
    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSaveSettings.enabled, autoSaveSettings.interval, gameStarted, gameState.isComplete, gameState.isFailed, performAutoSave, autoSaveInterval]);

  // 컴포넌트 마운트 시 로컬 스토리지에서 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem('autoSaveSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as AutoSaveSettings;
        setAutoSaveSettings(parsedSettings);
      } catch (error) {
        console.error('자동 저장 설정을 불러오는 중 오류 발생:', error);
      }
    }
  }, []);

  // 자동 저장된 게임 확인
  const checkAutoSavedGame = useCallback(() => {
    const autoSavedGame = GameStorage.loadAutoSavedGame();
    if (autoSavedGame) {
      setShowAutoSaveModal(true);
    }
  }, [setShowAutoSaveModal]);

  // 컴포넌트 마운트 시 자동 저장된 게임 확인
  useEffect(() => {
    checkAutoSavedGame();
  }, [checkAutoSavedGame]);

  // 페이지 종료 시 자동 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoSaveSettings.saveOnExit && gameStarted && !gameState.isComplete && !gameState.isFailed) {
        GameStorage.saveGame(gameState, autoNotesEnabled, undefined, true);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [autoSaveSettings.saveOnExit, gameStarted, gameState, autoNotesEnabled]);

  return {
    autoSaveSettings,
    updateAutoSaveSettings,
    performAutoSave,
    lastSaveTime,
    autoSaveInterval,
    setAutoSaveInterval
  };
};
