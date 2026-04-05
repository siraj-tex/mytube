import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Upload.css';
import '../Auth/Auth.css'; // Reusing some base form styles

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isShort, setIsShort] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div className="upload-container"><h3>Please login to upload a video</h3></div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      return setError('Please provide both a video and a thumbnail');
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('isShort', isShort);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    try {
      const { data } = await axios.post('/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate(`/watch/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Video</h2>
        {error && <div className="auth-error" style={{marginTop: 16}}>{error}</div>}
        
        <form className="upload-form" onSubmit={handleSubmit} style={{marginTop: 24}}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input 
              type="text" 
              value={tags} 
              placeholder="coding, react, tutorial"
              onChange={(e) => setTags(e.target.value)} 
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input 
              type="checkbox" 
              id="isShort"
              checked={isShort} 
              onChange={(e) => setIsShort(e.target.checked)} 
              style={{ padding: 0, width: 'auto' }}
            />
            <label htmlFor="isShort" style={{ fontSize: 16 }}>Upload as a Short (Vertical Video)</label>
          </div>

          <div className="form-group">
            <label>Thumbnail Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setThumbnailFile(e.target.files[0])} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Video File</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={(e) => setVideoFile(e.target.files[0])} 
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
