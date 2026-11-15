import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('cup2eat_admin_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cup2eat_admin_theme', theme);
    } catch (e) {
      console.error('Failed to save admin theme in localStorage:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  // Semantic styles for admin dashboard components
  const themeClasses = {
    theme,
    isDark,
    toggleTheme,
    // Page container background
    pageBg: isDark ? 'bg-[#121212] text-[#F3F4F6]' : 'bg-slate-50 text-slate-800',
    // Card background & borders
    cardBg: isDark ? 'bg-[#1E1E1E] border-[#2C2C2C] text-[#F3F4F6]' : 'bg-white border-slate-200 text-slate-800 shadow-sm',
    // Sidebar background & borders
    sidebarBg: isDark ? 'bg-[#181818] border-[#282828] text-[#E0E0E0]' : 'bg-white border-slate-200 text-slate-700 shadow-sm',
    // Header background
    headerBg: isDark ? 'bg-[#181818] border-[#282828] text-[#F3F4F6]' : 'bg-white border-slate-200 text-slate-800 shadow-sm',
    // Table styling
    tableHeaderBg: isDark ? 'bg-[#252525] text-slate-400 border-[#2E2E2E]' : 'bg-slate-100 text-slate-600 border-slate-200',
    tableRowBg: isDark ? 'hover:bg-[#252525]/60 border-[#282828]' : 'hover:bg-slate-50 border-slate-100',
    // Input styling
    inputBg: isDark ? 'bg-[#242424] border-[#383838] text-white placeholder-slate-500 focus:border-[#C8A051]' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#C8A051]',
    // Subtle border color
    border: isDark ? 'border-[#2C2C2C]' : 'border-slate-200',
    // Text colors
    textMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    textMain: isDark ? 'text-white' : 'text-slate-900',
  };

  return (
    <AdminThemeContext.Provider value={themeClasses}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  }
  return context;
};
