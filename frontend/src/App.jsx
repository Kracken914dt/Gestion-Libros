import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';

const isAuthenticated = () => localStorage.getItem('book_app_auth') === 'true';

function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/books"
        element={
          <PrivateRoute>
            <BooksPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/books/:id"
        element={
          <PrivateRoute>
            <BookDetailPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated() ? '/books' : '/login'} replace />} />
    </Routes>
  );
}
