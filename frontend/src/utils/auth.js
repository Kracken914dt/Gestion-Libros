export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('book_app_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getCurrentUserRole = () => getCurrentUser()?.role || 'user';

export const isAdminUser = () => getCurrentUserRole() === 'admin';
