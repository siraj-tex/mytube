import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Video, Bell, UserCircle, Sun, Moon, LogOut, Upload } from 'lucide-react';
import './Navbar.css';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logoutContext } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    logoutContext();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="icon-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/" className="logo">
          <Video className="logo-icon" size={28} />
          <span>MyTube</span>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <Search size={20} />
        </button>
      </form>

      <div className="nav-right">
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        
        {user ? (
          <>
            <Link to="/upload" className="icon-btn">
              <Upload size={24} />
            </Link>
            <button className="icon-btn">
              <Bell size={24} />
            </button>
            <div className="profile-menu" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="avatar" />
              ) : (
                <UserCircle size={32} />
              )}
              {user.role === 'admin' && (
                 <Link to="/admin" className="btn btn-primary" style={{fontSize: '12px', padding: '6px 12px'}}>Admin</Link>
              )}
              <button className="icon-btn" onClick={handleLogout} title="Logout">
                <LogOut size={24} />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCircle size={20} />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
