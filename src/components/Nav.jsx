import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  function goHome(e) {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goToTopics(e) {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      sessionStorage.setItem('scrollTo', 'topics');
      navigate('/');
    }
  }

  function goToWorkingOn(e) {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('working-on')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      sessionStorage.setItem('scrollTo', 'working-on');
      navigate('/');
    }
  }

  return (
    <nav className="nav">
      <span className="nav-brand">Walid's Journal</span>
      <ul className="nav-links">
        <li><NavLink to="/" end onClick={goHome}>Home</NavLink></li>
        <li>
          <a href="#topics" onClick={goToTopics} className="nav-topics-link">
            Topics
          </a>
        </li>
        <li>
          <a href="#working-on" onClick={goToWorkingOn}>Working On</a>
        </li>
        <li><NavLink to="/research">Research</NavLink></li>
        <li><NavLink to="/archive">Archive</NavLink></li>
        <li><NavLink to="/admin">Admin</NavLink></li>
      </ul>
      <div className="nav-actions">
        <a
          href="mailto:walidymessafer@gmail.com"
          className="nav-email-btn"
          aria-label="Email Walid"
          title="walidymessafer@gmail.com"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <polyline points="2,4 12,13 22,4"/>
          </svg>
        </a>
        <button
          className="nav-theme-toggle"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle dark mode"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀' : '☾'}
        </button>
      </div>
    </nav>
  );
}
