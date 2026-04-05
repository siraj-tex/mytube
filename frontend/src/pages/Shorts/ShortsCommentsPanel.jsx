import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { X, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../../context/AuthContext';
import './Shorts.css'; // Add any panel-specific CSS here if needed

const ShortsCommentsPanel = ({ videoId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/api/comments/${videoId}`);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/api/comments', { videoId, text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  return (
    <div className="shorts-comments-panel" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} style={{
      position: 'absolute', right: 0, bottom: 0, width: '100%', height: '70%',
      backgroundColor: 'var(--bg-color)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
      display: 'flex', flexDirection: 'column', zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)', overflow: 'hidden',
      animation: 'slideUp 0.3s ease-out forwards'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text-color)' }}>Comments ({comments.length})</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{color: 'var(--text-color)'}}>Loading comments...</div>
        ) : comments.length === 0 ? (
          <div style={{color: 'var(--text-color)'}}>No comments yet.</div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} style={{ display: 'flex', gap: 12 }}>
              {comment.userId?.avatar ? (
                <img src={comment.userId.avatar} alt="avatar" style={{width: 32, height: 32, borderRadius: '50%'}} />
              ) : (
                <UserCircle size={32} color="var(--text-color)" />
              )}
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-color-secondary)', marginBottom: 4 }}>
                  @{comment.userId?.username} • {formatDistanceToNow(new Date(comment.createdAt))}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-color)', lineHeight: 1.4 }}>
                  {comment.text}
                </div>
                {(user && user._id === comment.userId?._id) && (
                  <button 
                    onClick={() => handleDelete(comment._id)} 
                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: 12, padding: 0, marginTop: 4, cursor: 'pointer'}}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: 16, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 12, backgroundColor: 'var(--bg-color-secondary)' }}>
        {user?.avatar ? (
          <img src={user.avatar} alt="avatar" style={{width: 32, height: 32, borderRadius: '50%'}} />
        ) : (
          <UserCircle size={32} color="var(--text-color)" />
        )}
        <input 
          type="text" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..." 
          style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: 'var(--text-color)', outline: 'none' }}
        />
        <button type="submit" disabled={!newComment.trim()} style={{ background: 'none', border: 'none', color: newComment.trim() ? 'var(--primary-color)' : 'var(--text-color-secondary)', fontWeight: 'bold' }}>
          Post
        </button>
      </form>
    </div>
  );
};

export default ShortsCommentsPanel;
