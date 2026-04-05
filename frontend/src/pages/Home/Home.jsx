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

  return (
    <div>
      {searchQuery && <h3>Search Results for "{searchQuery}"</h3>}
      <div className="home-feed">
        {videos.length === 0 ? (
          <div>No videos found</div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
