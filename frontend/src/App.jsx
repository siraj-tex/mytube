import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import Watch from './pages/Watch/Watch';
import Upload from './pages/Upload/Upload';
import LikedVideos from './pages/Feed/LikedVideos';
import History from './pages/Feed/History';
import Subscriptions from './pages/Feed/Subscriptions';
import SavedVideos from './pages/Feed/SavedVideos';
import Shorts from './pages/Shorts/Shorts';
import Profile from './pages/Profile/Profile';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminVideos from './pages/Admin/AdminVideos';
import AdminAds from './pages/Admin/AdminAds';
import AdminSettings from './pages/Admin/AdminSettings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="container">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/history" element={<History />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/saved" element={<SavedVideos />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/watch/:id" element={<Watch />} />
            
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
