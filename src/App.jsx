import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Archive from './pages/Archive';
import Admin from './pages/Admin';
import { usePosts } from './hooks/usePosts';
import { seedIfEmpty } from './utils/seed';
import './styles/global.css';

seedIfEmpty();

export default function App() {
  const { posts, addPost, editPost, removePost, togglePin } = usePosts();

  // Safety fallback: ensure loader is removed even if the JS inside index.html fails
  useEffect(() => {
    const t = setTimeout(() => {
      const loader = document.getElementById('page-loader');
      loader?.remove();
      document.getElementById('root')?.classList.add('page-ready');
    }, 1400); // delay (0.05s) + bar (0.7s) + fadeout (0.45s) + buffer
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      <Nav />
      <div className="page-wrapper">
        <Routes>
          <Route path="/"                element={<Home posts={posts} onTogglePin={togglePin} />} />
          <Route path="/post/:id"        element={<PostDetail posts={posts} onDelete={removePost} onTogglePin={togglePin} />} />
          <Route path="/archive"         element={<Archive posts={posts} onTogglePin={togglePin} />} />
          <Route path="/admin"           element={<Admin posts={posts} onAdd={addPost} onEdit={editPost} onDelete={removePost} onTogglePin={togglePin} />} />
          <Route path="/admin/edit/:id"  element={<Admin posts={posts} onAdd={addPost} onEdit={editPost} onDelete={removePost} onTogglePin={togglePin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
