export const THEME_KEY = 'book_app_theme';

export const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const applyTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle('light', theme === 'light');
};
