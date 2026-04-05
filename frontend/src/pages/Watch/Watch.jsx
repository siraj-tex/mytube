import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, UserCircle, Share2, Save } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Watch.css';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useContext(AuthContext);

  // Monetization Ad States
  const [ad, setAd] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(5);
  const [canSkipAd, setCanSkipAd] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const { data } = await axios.get(`/api/videos/${id}`);
        setVideo(data);
        
        // Also fetch comments
        const commentsData = await axios.get(`/api/comments/${id}`);
        setComments(commentsData.data);

        // Increment view count since we opened it
        axios.put(`/api/videos/${id}/view`).catch(console.error);

        // Fetch random ad if the video is not short
        if (!data.isShort) {
          try {
            const adRes = await axios.get('/api/ads/random');
            if (adRes.data) {
              setAd(adRes.data);
              setShowAd(true);
            }
          } catch (err) {
            console.log('No ads available or failed to fetch ad');
          }
        }

        // Add to history if logged in
        if (user) {
          axios.put(`/api/users/history/${id}`).catch(console.error);
        }
      } catch (error) {
        console.error('Error fetching video', error);
      }
    };
    fetchVideoData();
  }, [id, user]);

  // Handle Ad Timer
  useEffect(() => {
    let timer;
    if (showAd && adTimeLeft > 0) {
      timer = setInterval(() => {
        setAdTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (showAd && adTimeLeft === 0) {
      setCanSkipAd(true);
    }
    return () => clearInterval(timer);
  }, [showAd, adTimeLeft]);

  const handleSkipAd = async () => {
    setShowAd(false);
    // Register Ad View
    try {
      await axios.post(`/api/videos/${id}/ad-view`);
    } catch (error) {
      console.error('Error logging ad view', error);
    }
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      const { data } = await axios.put(`/api/videos/${id}/like`);
      setVideo(prev => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
    } catch (error) {
      console.error('Error liking video', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return alert('Please login to subscribe');
    try {
      const { data } = await axios.put(`/api/users/subscribe/${video.uploader._id}`);
      setIsSubscribed(!isSubscribed);
      setVideo(prev => ({ 
        ...prev, 
        uploader: { ...prev.uploader, subscribers: data.subscribers } 
      }));
    } catch (error) {
      console.error('Error subscribing', error);
    }
  };

  const handleSave = async () => {
    if (!user) return alert('Please login to save');
    try {
      await axios.put(`/api/users/save/${id}`);
      setIsSaved(!isSaved);
      alert(isSaved ? 'Video removed from saved' : 'Video saved to library');
    } catch (error) {
      console.error('Error saving video', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/api/comments', { videoId: id, text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="watch-container">
      <div className="watch-main">
        <div className="video-player-container">
          {showAd && ad ? (
            <div className="ad-overlay">
              <div className="ad-content">
                {ad.type === 'video' ? (
                  <video src={ad.mediaUrl} autoPlay controls={false} disablePictureInPicture muted={false} className="ad-media"></video>
                ) : (
                  <img src={ad.mediaUrl} alt={ad.title} className="ad-media" />
                )}
              </div>
              <div className="ad-badge">Advertisement - {ad.title}</div>
              <div className="skip-ad-container">
                {canSkipAd ? (
                  <button onClick={handleSkipAd} className="skip-ad-btn">Skip Ad ⏭</button>
                ) : (
                  <div className="skip-ad-timer">You can skip in {adTimeLeft}s</div>
                )}
              </div>
            </div>
          ) : (
            <video src={video.videoUrl} controls autoPlay className="main-video-player"></video>
          )}
        </div>
        <h1 className="video-player-title">{video.title}</h1>
        
        <div className="watch-actions">
          <div className="channel-info">
            <Link to={`/profile/${video.uploader?._id}`}>
              {video.uploader?.avatar ? (
                <img src={video.uploader.avatar} alt="avatar" className="channel-avatar" />
              ) : (
                <UserCircle size={40} style={{color: 'var(--text-color)'}} />
              )}
            </Link>
            <div>
              <Link to={`/profile/${video.uploader?._id}`} style={{textDecoration: 'none', color: 'var(--text-color)'}}>
                <div style={{fontWeight: 600}}>{video.uploader?.username}</div>
              </Link>
              <div style={{fontSize: 12, color: 'var(--text-color-secondary)'}}>{video.uploader?.subscribers || 0} subscribers</div>
            </div>
            <button 
              className="subscribe-btn" 
              onClick={handleSubscribe}
              style={{ backgroundColor: isSubscribed ? 'var(--bg-color-secondary)' : 'var(--text-color)', color: isSubscribed ? 'var(--text-color)' : 'var(--bg-color)' }}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="video-stats">
            <button className="action-btn" onClick={handleLike}>
              <ThumbsUp size={18} fill={user && video.likes?.includes(user._id) ? "currentColor" : "none"} /> 
              {video.likes?.length || 0}
            </button>
            <button className="action-btn">
              <ThumbsDown size={18} fill={user && video.dislikes?.includes(user._id) ? "currentColor" : "none"} />
            </button>
            <button className="action-btn" onClick={handleShare}><Share2 size={18} /> Share</button>
            <button className="action-btn" onClick={handleSave}>
              <Save size={18} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="description-box">
          <div style={{fontWeight: 600, marginBottom: 8}}>
            {video.views + 1} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </div>
          <p>{video.description}</p>
          <div style={{marginTop: 12, color: 'var(--primary-color)'}}>
            {video.tags?.map(tag => `#${tag} `)}
          </div>
        </div>

        <div className="comments-section">
          <h3>{comments.length} Comments</h3>
          
          <form className="comment-input-box" onSubmit={handleCommentSubmit}>
            <UserCircle size={40} />
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{display: newComment ? 'block' : 'none'}}>Comment</button>
          </form>

          <div>
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                {comment.userId?.avatar ? (
                  <img src={comment.userId.avatar} alt="avatar" className="channel-avatar" />
                ) : (
                  <UserCircle size={40} />
                )}
                <div className="comment-details">
                  <div className="comment-header">
                    {comment.userId?.username} 
                    <span className="comment-date">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p>{comment.text}</p>
                  {(user && (user._id === comment.userId?._id || user.role === 'admin')) && (
                    <button onClick={() => handleDeleteComment(comment._id)} style={{color: 'var(--primary-color)', fontSize: 12, textAlign: 'left', marginTop: 4}}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="watch-sidebar">
        {/* Mocking recommended videos for now */}
        <h3>Recommended</h3>
      </div>
    </div>
  );
};

export default Watch;
