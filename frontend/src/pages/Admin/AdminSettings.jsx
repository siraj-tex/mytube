import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const AdminSettings = () => {
  const [rpm, setRpm] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRPM();
  }, []);

  const fetchRPM = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/config/rpm', { withCredentials: true });
      setRpm(res.data.rpm);
    } catch (error) {
      console.error('Error fetching RPM', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.put('http://localhost:5000/api/config/rpm', { rpm }, { withCredentials: true });
      setMessage('RPM updated successfully!');
    } catch (error) {
      console.error('Error updating RPM', error);
      setMessage('Failed to update RPM.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>Platform Settings</h2>
      
      <div className="admin-settings-card">
        <h3>Monetization Settings</h3>
        <form onSubmit={handleUpdate} className="settings-form">
          <div className="form-group">
            <label>Default Revenue ($ per 10 views)</label>
            <input 
              type="number" 
              step="0.01"
              value={rpm} 
              onChange={(e) => setRpm(parseFloat(e.target.value))} 
              required 
            />
          </div>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <p className="settings-msg">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
