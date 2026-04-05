import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleBanToggle = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/ban`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling ban', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  return (
    <div>
      <h2 style={{marginBottom: 24}}>Manage Users</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span style={{color: user.isBanned ? 'red' : 'green'}}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td>
                  {user.role !== 'admin' && (
                    <div style={{display: 'flex', gap: 8}}>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleBanToggle(user._id)}
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
