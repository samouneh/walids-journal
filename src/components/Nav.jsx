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
        <li><NavLink to="/research">Research</NavLink></li>
        <li><NavLink to="/archive">Archive</NavLink></li>
        <li><NavLink to="/admin">Admin</NavLink></li>
      </ul>
      <button
        className="nav-theme-toggle"
        onClick={() => setDark(d => !d)}
        aria-label="Toggle dark mode"
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? '☀' : '☾'}
      </button>
    </nav>
  );
}
