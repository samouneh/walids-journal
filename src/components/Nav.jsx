import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Nav() {
  const navigate  = useNavigate();
  const location  = useLocation();

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
        <li><NavLink to="/" end>Home</NavLink></li>
        <li>
          <a href="#topics" onClick={goToTopics} className="nav-topics-link">
            Topics
          </a>
        </li>
        <li><NavLink to="/research">Research</NavLink></li>
        <li><NavLink to="/archive">Archive</NavLink></li>
        <li><NavLink to="/admin">Admin</NavLink></li>
      </ul>
    </nav>
  );
}
