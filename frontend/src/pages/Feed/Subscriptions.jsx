import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import VideoCard from '../../components/VideoCard';
import '../Home/Home.css';

const Subscriptions = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/videos/subscriptions');
        setVideos(data);
      } catch (error) {
        console.error('Error fetching subscriptions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div style={{padding: 24}}>Please login to view subscriptions</div>;

  return (
    <div style={{padding: '0 24px'}}>
      <h2 style={{margin: '24px 0'}}>Subscriptions</h2>
      <div className="home-feed">
        {videos.length === 0 ? (
          <div>No newly uploaded videos from subscribed channels</div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
