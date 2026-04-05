import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get('/api/admin/videos');
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`/api/admin/videos/${id}`);
        fetchVideos();
      } catch (error) {
        console.error('Error deleting video', error);
      }
    }
  };

  return (
    <div>
      <h2 style={{marginBottom: 24}}>Manage Videos</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Uploader</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map(video => (
              <tr key={video._id}>
                <td>{video._id}</td>
                <td>
                  <img src={video.thumbnailUrl} alt="thumbnail" style={{width: 60, height: 40, objectFit: 'cover', borderRadius: 4}} />
                </td>
                <td>{video.title}</td>
                <td>{video.uploader?.username}</td>
                <td>{video.views}</td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(video._id)}
                  >
                    Delete
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

export default AdminVideos;
