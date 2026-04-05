import React, { useState } from 'react';
import axios from 'axios';
import '../pages/Profile/Profile.css';

const MonetizationTab = ({ profileUser, videos }) => {
  // Only long videos can be monetized for now
  const longVideos = videos.filter(v => !v.isShort);
  const [videoList, setVideoList] = useState(longVideos);

  const toggleMonetize = async (videoId) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/videos/${videoId}/monetize`, {}, { withCredentials: true });
      setVideoList(prevList => 
        prevList.map(v => v._id === videoId ? { ...v, isMonetized: data.isMonetized } : v)
      );
    } catch (error) {
      console.error('Error toggling monetization', error);
      alert('Failed to toggle monetization. Please ensure you are logged in.');
    }
  };

  return (
    <div className="monetization-tab">
      <div className="earnings-summary">
        <h2>Estimated Earnings</h2>
        <h1 className="earnings-amount">${profileUser.accumulatedEarnings ? profileUser.accumulatedEarnings.toFixed(2) : '0.00'}</h1>
        <p>Earnings are updated whenever an ad is successfully shown on your monetized videos.</p>
      </div>

      <div className="monetize-videos-section">
        <h3>Your Long Videos</h3>
        {videoList.length === 0 ? (
          <p>You have no long videos yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Video</th>
                <th>Title</th>
                <th>Monetized Views</th>
                <th>Monetization</th>
              </tr>
            </thead>
            <tbody>
              {videoList.map(video => (
                <tr key={video._id}>
                  <td>
                    <img src={video.thumbnailUrl} alt={video.title} width="80" />
                  </td>
                  <td>{video.title}</td>
                  <td>{video.monetizedViews || 0}</td>
                  <td>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={video.isMonetized || false}
                        onChange={() => toggleMonetize(video._id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MonetizationTab;
