import React, { useState, useContext } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EditProfileModal = ({ onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user.username || '');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      if (username !== user.username) {
        formData.append('username', username);
      }
      if (avatar) {
        formData.append('avatar', avatar);
      }

      await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Simple reload to fetch new data via context/effect
      onSuccess();
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--bg-color)', padding: 32, borderRadius: 12,
        width: '100%', maxWidth: 400, position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer'
        }}>
          <X size={24} />
        </button>
        
        <h2 style={{marginBottom: 24}}>Edit Profile</h2>
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div className="form-group" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{padding: 12, borderRadius: 8, background: 'var(--bg-color-secondary)', color: 'white', border: 'none'}}
            />
          </div>
          
          <div className="form-group" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <label>Profile Picture (Avatar)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setAvatar(e.target.files[0])}
              style={{padding: 12, borderRadius: 8, background: 'var(--bg-color-secondary)', color: 'white', border: 'none'}}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            padding: 12, borderRadius: 8, background: 'var(--primary-color)', color: 'white', border: 'none', 
            fontWeight: 'bold', marginTop: 16, cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
