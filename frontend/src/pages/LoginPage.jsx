import { BookOpenText, KeyRound, Mail, MoveRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@library.com');
  const [password, setPassword] = useState('password123');

  const onSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) return;

    localStorage.setItem('book_app_auth', 'true');
    navigate('/books');
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#5f55ff1c] text-electric">
          <BookOpenText size={24} />
        </div>

        <h1 className="mt-7 text-center text-[2rem] font-semibold tracking-tight text-[#111827]">Welcome back</h1>
        <p className="mx-auto mt-2 max-w-[280px] text-center text-sm text-[#7b89a2]">
          Enter your credentials to access the library system
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <label className="auth-field">
            <span>Email Address</span>
            <div className="auth-input-wrap">
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
              <button type="button" className="text-xs font-medium text-electric hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="auth-input-wrap">
              <KeyRound size={16} className="text-[#9ca9bf]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="***********"
                required
              />
            </div>
          </label>

          <button type="submit" className="auth-primary-btn">
            <span>Sign In</span>
            <MoveRight size={16} />
          </button>

          <div className="auth-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <button type="button" className="auth-ghost-btn">
            <BookOpenText size={17} />
            Single Sign-On (SSO)
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#96a3b8]">
          Don't have an account? <button className="font-medium text-electric">Request access</button>
        </p>
      </section>
    </main>
  );
}
