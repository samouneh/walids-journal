import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav-brand">Walid's Journal</span>
      <ul className="nav-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/archive">Archive</NavLink></li>
        <li><NavLink to="/admin">Admin</NavLink></li>
      </ul>
    </nav>
  );
}
