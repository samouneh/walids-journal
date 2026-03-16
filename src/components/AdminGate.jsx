import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'admin_token';

export default function AdminGate({ children }) {
  const [state, setState] = useState('checking'); // checking | locked | unlocked
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState('locked');
      return;
    }
    fetch(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => setState(r.ok ? 'unlocked' : 'locked'))
      .catch(() => setState('locked'));
  }, []);

  // Auto-focus input when locked
  useEffect(() => {
    if (state === 'locked') setTimeout(() => inputRef.current?.focus(), 100);
  }, [state]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password.trim()) return;
    setError('');

    try {
      const resp = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!resp.ok) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setError('Incorrect password');
        setPassword('');
        return;
      }

      const { token } = await resp.json();
      sessionStorage.setItem(TOKEN_KEY, token);
      setState('unlocked');
    } catch {
      setError('Connection failed — try again');
    }
  }

  if (state === 'checking') {
    return (
      <div className="admin-gate">
        <div className="admin-gate-card">
          <div className="admin-gate-spinner" />
        </div>
      </div>
    );
  }

  if (state === 'unlocked') return children;

  return (
    <div className="admin-gate">
      <div className={`admin-gate-card${shake ? ' shake' : ''}`}>
        <div className="admin-gate-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="admin-gate-title">Admin Access</h2>
        <p className="admin-gate-desc">Enter your password to manage journal entries.</p>
        <form onSubmit={handleSubmit} className="admin-gate-form">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="admin-gate-input"
            autoComplete="current-password"
          />
          <button type="submit" className="admin-gate-btn" disabled={!password.trim()}>
            Authenticate
          </button>
        </form>
        {error && <p className="admin-gate-error">{error}</p>}
      </div>
    </div>
  );
}
