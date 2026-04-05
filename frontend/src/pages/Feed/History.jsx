import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import VideoCard from '../../components/VideoCard';
import '../Home/Home.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/users/history');
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div style={{padding: 24}}>Please login to view history</div>;

  return (
    <div style={{padding: '0 24px'}}>
      <h2 style={{margin: '24px 0'}}>Watch History</h2>
      <div className="home-feed">
        {history.length === 0 ? (
          <div>No history found</div>
        ) : (
          history.map((item) => (
            <VideoCard key={item._id} video={item.videoId} />
          ))
        )}
      </div>
    </div>
  );
};

export default History;
