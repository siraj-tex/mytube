import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import VideoCard from '../../components/VideoCard';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/videos${searchQuery ? `?search=${searchQuery}` : ''}`);
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [searchQuery]);

  if (loading) return <div>Loading...</div>;

  const longVideos = videos.filter(v => !v.isShort);
  const shortVideos = videos.filter(v => v.isShort);

  return (
    <div className="home-container">
      {shortVideos.length > 0 && (
        <div className="shorts-shelf-section">
          <h2>Shorts</h2>
          <div className="shorts-shelf">
            {shortVideos.map((video) => (
              <div key={video._id} className="shorts-shelf-card">
                <VideoCard video={video} hideChannelInfo={true} />
              </div>
            ))}
          </div>
          <hr className="shelf-divider" />
        </div>
      )}

      <div className="home-feed">
        {longVideos.length === 0 ? (
          <div>No videos found</div>
        ) : (
          longVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
