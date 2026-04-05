import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { UserCircle } from 'lucide-react';

const CommunityTab = ({ channelId }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`/api/users/community/${channelId}`);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching community posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [channelId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    try {
      const { data } = await axios.post('/api/users/community', { text: newPost });
      setPosts([data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post', error);
    }
  };

  const isOwner = user && user._id === channelId;

  if (loading) return <div>Loading community...</div>;

  return (
    <div style={{maxWidth: 800, margin: '0 auto'}}>
      {isOwner && (
        <form onSubmit={handlePostSubmit} style={{marginBottom: 32, display: 'flex', gap: 16}}>
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" style={{width: 48, height: 48, borderRadius: '50%'}} />
          ) : (
            <UserCircle size={48} />
          )}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Post an update to your fans..."
              style={{
                width: '100%', minHeight: 80, padding: 12, borderRadius: 8, 
                background: 'var(--bg-color-secondary)', color: 'white', border: 'none', resize: 'vertical'
              }}
            />
            <button type="submit" disabled={!newPost.trim()} style={{
              alignSelf: 'flex-end', padding: '8px 24px', borderRadius: 20, 
              background: newPost.trim() ? 'var(--primary-color)' : 'var(--bg-color-secondary)', 
              color: 'white', border: 'none', fontWeight: 'bold', cursor: newPost.trim() ? 'pointer' : 'default'
            }}>
              Post
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div style={{textAlign: 'center', padding: 40}}>No community posts yet.</div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {posts.map(post => (
            <div key={post._id} style={{padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', background: 'var(--bg-color)'}}>
              <div style={{display: 'flex', gap: 12, marginBottom: 16}}>
                {post.author?.avatar ? (
                  <img src={post.author.avatar} alt="avatar" style={{width: 40, height: 40, borderRadius: '50%'}} />
                ) : (
                  <UserCircle size={40} />
                )}
                <div>
                  <div style={{fontWeight: 'bold', fontSize: 16}}>{post.author?.username}</div>
                  <div style={{fontSize: 12, color: 'var(--text-color-secondary)'}}>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <p style={{fontSize: 15, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>{post.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityTab;
