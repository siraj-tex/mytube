import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
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
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const { data } = await axios.get(`/api/videos/${id}`);
        setVideo(data);
        
        // Also fetch comments
        const commentsData = await axios.get(`/api/comments/${id}`);
        setComments(commentsData.data);

        // Increment view count since we opened it Let's not await this so it doesn't block
        axios.put(`/api/videos/${id}/view`);
      } catch (error) {
        console.error('Error fetching video', error);
      }
    };
    fetchVideoData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like');
    try {
      const { data } = await axios.put(`/api/videos/${id}/like`);
      setVideo(prev => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
    } catch (error) {
      console.error('Error liking video', error);
    }
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
        <div className="video-player">
          <video src={video.videoUrl} controls autoPlay></video>
        </div>
        <h1 className="video-player-title">{video.title}</h1>
        
        <div className="watch-actions">
          <div className="channel-info">
            {video.uploader?.avatar ? (
              <img src={video.uploader.avatar} alt="avatar" className="channel-avatar" />
            ) : (
              <UserCircle size={40} />
            )}
            <div>
              <div style={{fontWeight: 600}}>{video.uploader?.username}</div>
              <div style={{fontSize: 12, color: 'var(--text-color-secondary)'}}>{video.uploader?.subscribers || 0} subscribers</div>
            </div>
            <button className="subscribe-btn">Subscribe</button>
          </div>

          <div className="video-stats">
            <button className="action-btn" onClick={handleLike}>
              <ThumbsUp size={18} fill={user && video.likes?.includes(user._id) ? "currentColor" : "none"} /> 
              {video.likes?.length || 0}
            </button>
            <button className="action-btn">
              <ThumbsDown size={18} fill={user && video.dislikes?.includes(user._id) ? "currentColor" : "none"} />
            </button>
            <button className="action-btn"><Share2 size={18} /> Share</button>
            <button className="action-btn"><Save size={18} /> Save</button>
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
