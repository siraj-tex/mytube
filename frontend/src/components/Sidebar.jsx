import React, { useContext } from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Flame, Gamepad2, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);

  const mainLinks = [
    { name: 'Home', icon: <Home size={24} />, path: '/' },
    { name: 'Shorts', icon: <Compass size={24} />, path: '/' },
    { name: 'Subscriptions', icon: <PlaySquare size={24} />, path: '/' },
  ];

  const userLinks = [
    { name: 'History', icon: <Clock size={24} />, path: '/' },
    { name: 'Liked Videos', icon: <ThumbsUp size={24} />, path: '/' },
  ];

  const exploreLinks = [
    { name: 'Trending', icon: <Flame size={24} />, path: '/' },
    { name: 'Gaming', icon: <Gamepad2 size={24} />, path: '/' },
    { name: 'Movies', icon: <Film size={24} />, path: '/' },
  ];

  return (
    <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="sidebar-category">
        {mainLinks.map((link, index) => (
          <Link to={link.path} key={index} className="sidebar-item">
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </div>

      {user && (
        <div className="sidebar-category">
          {isOpen && <h3 className="sidebar-title">You</h3>}
          {userLinks.map((link, index) => (
            <Link to={link.path} key={index} className="sidebar-item">
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="sidebar-category">
        {isOpen && <h3 className="sidebar-title">Explore</h3>}
        {exploreLinks.map((link, index) => (
          <Link to={link.path} key={index} className="sidebar-item">
            {link.icon}
            <span>{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
