import React, { useRef, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, UserCircle, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Shorts.css';

const ShortPlayer = ({ video, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likes, setLikes] = useState(video.likes || []);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.subscribedChannels?.includes(video.uploader?._id)) {
      setIsSubscribed(true);
    }
  }, [user, video]);

  useEffect(() => {
    // When the 'isActive' prop changes (controlled by IntersectionObserver in parent),
    // we play or pause the video accordingly.
    if (isActive) {
      videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
      setIsPlaying(true);
      // Fire history view
      if (user) {
        axios.put(`/api/users/history/${video._id}`).catch(console.error);
        axios.put(`/api/videos/${video._id}/view`).catch(console.error);
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
      // Reset video to start to behave like TikTok
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [isActive, user, video._id]);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      const { data } = await axios.put(`/api/videos/${video._id}/like`);
      setLikes(data.likes);
    } catch (error) {
      console.error('Error liking video', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert('Please login to subscribe');
    try {
      await axios.put(`/api/users/subscribe/${video.uploader?._id}`);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error subscribing', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/watch/${video._id}`);
    alert('Short link copied to clipboard!');
  };

  const isLiked = user && likes.includes(user._id);

  return (
    <div className="short-container">
      <div className="short-player-wrapper">
        <video 
          ref={videoRef}
          src={video.videoUrl} 
          className="short-video"
          onClick={togglePlay}
          loop
          playsInline
        ></video>

        {!isPlaying && (
          <div className="short-play-pause-overlay show">
            <Play size={48} color="white" fill="white" />
          </div>
        )}

        {/* Right Actions */}
        <div className="short-actions-sidebar">
          <button className={`short-action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
             <ThumbsUp size={28} fill={isLiked ? "currentColor" : "none"} />
             <span>{likes.length}</span>
          </button>
          <button className="short-action-btn">
             <ThumbsDown size={28} />
             <span>Dislike</span>
          </button>
          <Link to={`/watch/${video._id}`} className="short-action-btn" style={{textDecoration: 'none'}}>
             <MessageSquare size={28} />
             <span>{video.commentsCount || 'Views ' + video.views}</span>
          </Link>
          <button className="short-action-btn" onClick={handleShare}>
             <Share2 size={28} />
             <span>Share</span>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="short-info-bottom">
          <div className="short-channel-row">
            <Link to={`/profile/${video.uploader?._id}`}>
              {video.uploader?.avatar ? (
                <img src={video.uploader.avatar} alt="avatar" className="short-channel-avatar" />
              ) : (
                <UserCircle size={40} className="short-channel-avatar" />
              )}
            </Link>
            <Link to={`/profile/${video.uploader?._id}`} style={{textDecoration: 'none', color: 'white'}}>
              <span className="short-channel-name">@{video.uploader?.username}</span>
            </Link>
            <button 
              className="short-subscribe-btn"
              onClick={handleSubscribe}
              style={{ backgroundColor: isSubscribed ? 'rgba(255,255,255,0.2)' : 'white', color: isSubscribed ? 'white' : 'black' }}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          <div className="short-title">
            {video.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortPlayer;
