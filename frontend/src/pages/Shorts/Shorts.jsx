import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../../components/VideoCard';
import '../Home/Home.css';

const Shorts = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const { data } = await axios.get('/api/videos/shorts');
        setVideos(data);
      } catch (error) {
        console.error('Error fetching shorts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{padding: '0 24px'}}>
      <h2 style={{margin: '24px 0'}}>Shorts</h2>
      <div className="home-feed" style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' // Narrower for shorts
      }}>
        {videos.length === 0 ? (
          <div>No shorts found</div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default Shorts;
