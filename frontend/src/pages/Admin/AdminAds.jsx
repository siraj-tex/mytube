import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import './Admin.css';

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('video');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ads', { withCredentials: true });
      setAds(res.data);
    } catch (error) {
      console.error('Error fetching ads', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('media', file);

    try {
      await axios.post('http://localhost:5000/api/ads', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchAds();
      setTitle('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading ad', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ads/${id}`, { withCredentials: true });
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad', error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Advertisements</h2>
      
      <div className="upload-ad-form">
        <h3>Upload New Ad</h3>
        <form onSubmit={handleUpload}>
          <div>
            <label>Ad Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Ad Type:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </select>
          </div>
          <div>
            <label>Media File:</label>
            <input type="file" accept={type === 'video' ? 'video/*' : 'image/*'} onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <button type="submit" className="upload-btn">Upload Ad</button>
        </form>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Media</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.type}</td>
                <td>
                  {ad.type === 'image' ? (
                    <img src={ad.mediaUrl} alt={ad.title} width="80" />
                  ) : (
                    <video src={ad.mediaUrl} width="80" />
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(ad._id)} className="action-btn delete-btn">
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAds;
