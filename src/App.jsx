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
