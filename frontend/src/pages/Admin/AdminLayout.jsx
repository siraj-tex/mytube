import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Video } from 'lucide-react';
import './Admin.css';

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <Link to="/admin" className="admin-nav-item">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/admin/users" className="admin-nav-item">
          <Users size={20} />
          Users
        </Link>
        <Link to="/admin/videos" className="admin-nav-item">
          <Video size={20} />
          Videos
        </Link>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
