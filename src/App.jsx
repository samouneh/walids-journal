import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Chat from './components/Chat';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Archive from './pages/Archive';
import Admin from './pages/Admin';
import Research from './pages/Research';
import { usePosts } from './hooks/usePosts';
import './styles/global.css';

export default function App() {
  const { posts, addPost, editPost, removePost, togglePin, toggleInProgress } = usePosts();

  // Safety fallback: ensure loader is removed even if the JS inside index.html fails
  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById('page-loader')?.remove();
      const root = document.getElementById('root');
      if (root) root.style.filter = ''; // ensure blur is cleared if loader JS failed
    }, 1400); // delay (0.05s) + bar (0.7s) + fadeout (0.45s) + buffer
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      <Nav />
      <div className="page-wrapper">
        <Routes>
          <Route path="/"                element={<Home posts={posts} onTogglePin={togglePin} />} />
          <Route path="/post/:id"        element={<PostDetail posts={posts} onDelete={removePost} onTogglePin={togglePin} onToggleInProgress={toggleInProgress} />} />
          <Route path="/archive"         element={<Archive posts={posts} onTogglePin={togglePin} />} />
          <Route path="/research"        element={<Research posts={posts} />} />
          <Route path="/admin"           element={<Admin posts={posts} onAdd={addPost} onEdit={editPost} onDelete={removePost} onTogglePin={togglePin} onToggleInProgress={toggleInProgress} />} />
          <Route path="/admin/edit/:id"  element={<Admin posts={posts} onAdd={addPost} onEdit={editPost} onDelete={removePost} onTogglePin={togglePin} onToggleInProgress={toggleInProgress} />} />
        </Routes>
      </div>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span className="site-footer-brand">Walid's Journal</span>
          <span className="site-footer-sep">·</span>
          <a href="mailto:walidymessafer@gmail.com" className="site-footer-email">
            walidymessafer@gmail.com
          </a>
          <span className="site-footer-sep">·</span>
          <a href="https://github.com/samouneh" target="_blank" rel="noreferrer" className="site-footer-link">
            GitHub
          </a>
        </div>
      </footer>
      <Chat />
    </BrowserRouter>
  );
}
