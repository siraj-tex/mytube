import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ShortPlayer from './ShortPlayer';
import './Shorts.css';

const Shorts = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Find index of the intersecting element
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6 // Trigger when 60% of the video is visible
      }
    );

    const elements = document.querySelectorAll('.short-container-wrapper');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [videos]);

  if (loading) return <div style={{padding: 24, color: 'white'}}>Loading Shorts...</div>;

  return (
    <div className="shorts-wrapper-root" ref={containerRef}>
      {videos.length === 0 ? (
        <div style={{color: 'white', marginTop: 40}}>No shorts found</div>
      ) : (
        videos.map((video, index) => (
          <div key={video._id} className="short-container-wrapper" data-index={index}>
            <ShortPlayer 
              video={video} 
              isActive={activeIndex === index} 
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Shorts;
