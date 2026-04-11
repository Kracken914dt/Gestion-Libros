import { BookOpenText, KeyRound, Mail, MoveRight, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { applyTheme, getInitialTheme } from '../utils/theme';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [theme] = useState(() => getInitialTheme());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('book_app_token')) {
      navigate('/books');
    }
  }, [navigate]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) return;

    if (mode === 'register' && password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response =
        mode === 'login'
          ? await login({ email, password })
          : await register({ email, password });

      localStorage.setItem('book_app_token', response.token);
      localStorage.setItem('book_app_user', JSON.stringify(response.user));
      navigate('/books');
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        (mode === 'login' ? 'Credenciales invalidas' : 'No se pudo crear la cuenta');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const isLight = theme === 'light';

  return (
    <main className={`login-shell ${isLight ? 'login-shell-light' : 'login-shell-dark'}`}>
      <section className={`login-card ${isLight ? 'login-card-light' : 'login-card-dark'}`}>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#5f55ff1c] text-electric">
          <BookOpenText size={24} />
        </div>

        <h1 className={`mt-7 text-center text-[2rem] font-semibold tracking-tight ${isLight ? 'text-[#111827]' : 'text-slate-100'}`}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className={`mx-auto mt-2 max-w-[280px] text-center text-sm ${isLight ? 'text-[#7b89a2]' : 'text-slate-400'}`}>
          {mode === 'login'
            ? 'Enter your credentials to access the library system'
            : 'Register your credentials to access the library system'}
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          {error && (
            <p className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <label className="auth-field">
            <span>Email Address</span>
            <div className={`auth-input-wrap ${isLight ? '' : 'auth-input-wrap-dark'}`}>
              <Mail size={16} className="text-[#9ca9bf]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@library.com"
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <div className="mb-2 flex items-center justify-between">
              <span>Password</span>
              {mode === 'login' && (
                <button type="button" className="text-xs font-medium text-electric hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className={`auth-input-wrap ${isLight ? '' : 'auth-input-wrap-dark'}`}>
              <KeyRound size={16} className="text-[#9ca9bf]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="***********"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="inline-flex items-center justify-center text-[#9ca9bf] transition hover:text-electric"
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {mode === 'register' && (
            <label className="auth-field">
              <span>Confirm Password</span>
              <div className={`auth-input-wrap ${isLight ? '' : 'auth-input-wrap-dark'}`}>
                <KeyRound size={16} className="text-[#9ca9bf]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="***********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="inline-flex items-center justify-center text-[#9ca9bf] transition hover:text-electric"
                  aria-label={showConfirmPassword ? 'Ocultar confirmacion de contrasena' : 'Mostrar confirmacion de contrasena'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
          )}

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            <span>
              {loading
                ? mode === 'login'
                  ? 'Signing In...'
                  : 'Creating account...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </span>
            {!loading && <MoveRight size={16} />}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${isLight ? 'text-[#96a3b8]' : 'text-slate-400'}`}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="font-medium text-electric"
            onClick={() => {
              setMode((prev) => (prev === 'login' ? 'register' : 'login'));
              setError('');
              setConfirmPassword('');
            }}
          >
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  );
}
