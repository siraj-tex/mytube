import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import VideoCard from '../../components/VideoCard';
import '../Home/Home.css';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLiked = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/videos/liked');
        setVideos(data);
      } catch (error) {
        console.error('Error fetching liked videos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div style={{padding: 24}}>Please login to view liked videos</div>;

  return (
    <div style={{padding: '0 24px'}}>
      <h2 style={{margin: '24px 0'}}>Liked Videos</h2>
      <div className="home-feed">
        {videos.length === 0 ? (
          <div>No liked videos found</div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default LikedVideos;
