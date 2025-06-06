import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

interface HeaderProps {
  onNewGame: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
  onStatistics: () => void;
  onAchievements: () => void;
  isGameStarted: boolean;
  isGameOver: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onNewGame,
  onSaveGame,
  onLoadGame,
  onSettings,
  onStatistics,
  onAchievements,
  isGameStarted,
  isGameOver
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
  };

  const handleMenuItemClick = (action: () => void) => {
    closeDrawer();
    action();
  };

  return (
    <>
      <header className="app-header">
        <button className="menu-button" onClick={openDrawer} aria-label="메뉴 열기">
          <svg className="menu-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <h1 className="app-title">스도쿠 게임</h1>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </header>

      <div className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={closeDrawer}></div>
      <div className={`menu-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">메뉴</h2>
          <button className="close-drawer" onClick={closeDrawer} aria-label="메뉴 닫기">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="drawer-content">
          <div className="drawer-menu-item" onClick={() => handleMenuItemClick(onNewGame)}>
            <div className="drawer-menu-item-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
            <span className="drawer-menu-item-text">새 게임</span>
          </div>
          <div 
            className={`drawer-menu-item ${!isGameStarted || isGameOver ? 'disabled' : ''}`}
            onClick={() => isGameStarted && !isGameOver && handleMenuItemClick(onSaveGame)}
          >
            <div className="drawer-menu-item-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
              </svg>
            </div>
            <span className="drawer-menu-item-text">게임 저장</span>
          </div>
          <div className="drawer-menu-item" onClick={() => handleMenuItemClick(onLoadGame)}>
            <div className="drawer-menu-item-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </div>
            <span className="drawer-menu-item-text">게임 불러오기</span>
          </div>
          <div className="drawer-menu-item" onClick={() => handleMenuItemClick(onStatistics)}>
            <div className="drawer-menu-item-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
            <span className="drawer-menu-item-text">통계</span>
          </div>
          <div className="drawer-menu-item" onClick={() => handleMenuItemClick(onAchievements)}>
            <div className="drawer-menu-item-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zm-2 3c0 2.21-1.79 4-4 4s-4-1.79-4-4V5h8v3z" />
              </svg>
            </div>
            <span className="drawer-menu-item-text">업적</span>
          </div>
          <div className="drawer-menu-item" onClick={() => handleMenuItemClick(onSettings)}>
            <div className="drawer-menu-item-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </div>
            <span className="drawer-menu-item-text">설정</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
