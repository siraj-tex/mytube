import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import VideoCard from '../../components/VideoCard';
import EditProfileModal from '../../components/EditProfileModal';
import CommunityTab from '../../components/CommunityTab';
import './Profile.css';
import '../Home/Home.css';

const Profile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('Videos');
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/users/profile/${id}`);
        setProfileUser(data.user);
        setVideos(data.videos);

        if (user && user.subscribedChannels?.includes(data.user._id)) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false); // Reset on id change
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, user]);

  const handleSubscribe = async () => {
    if (!user) return alert('Please login to subscribe');
    try {
      const { data } = await axios.put(`/api/users/subscribe/${id}`);
      setIsSubscribed(!isSubscribed);
      setProfileUser(prev => ({ ...prev, subscribers: data.subscribers }));
    } catch (error) {
      console.error('Error subscribing', error);
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    window.location.reload(); // Simple refresh to apply global auth user and local profile updates
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profileUser) return <div>User not found</div>;

  const isOwnProfile = user && user._id === profileUser._id;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-info-section">
          {profileUser.avatar ? (
            <img src={profileUser.avatar} alt={profileUser.username} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              <UserCircle size={80} color="var(--text-color-secondary)" />
            </div>
          )}
          
          <div className="profile-details">
            <h1 className="profile-username">{profileUser.username}</h1>
            <div className="profile-stats">
              {profileUser.subscribers} subscribers • {videos.length} videos
            </div>
            
            <div className="profile-actions">
              {isOwnProfile ? (
                <button className="edit-profile-btn" onClick={handleEditProfile}>
                  Edit Profile
                </button>
              ) : (
                <button 
                  className="subscribe-btn" 
                  onClick={handleSubscribe}
                  style={{ 
                    backgroundColor: isSubscribed ? 'var(--bg-color-secondary)' : 'var(--text-color)', 
                    color: isSubscribed ? 'var(--text-color)' : 'var(--bg-color)',
                    marginLeft: 0
                  }}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-nav">
          <div className={`profile-nav-item ${activeTab === 'Videos' ? 'active' : ''}`} onClick={() => setActiveTab('Videos')}>Videos</div>
          <div className={`profile-nav-item ${activeTab === 'Shorts' ? 'active' : ''}`} onClick={() => setActiveTab('Shorts')}>Shorts</div>
          <div className={`profile-nav-item ${activeTab === 'Playlists' ? 'active' : ''}`} onClick={() => setActiveTab('Playlists')}>Playlists</div>
          <div className={`profile-nav-item ${activeTab === 'Community' ? 'active' : ''}`} onClick={() => setActiveTab('Community')}>Community</div>
        </div>
      </div>

      <div className="profile-content">
        {activeTab === 'Videos' && (
          <div className="home-feed">
            {videos.filter(v => !v.isShort).length === 0 ? (
              <div>This channel has no standard videos.</div>
            ) : (
              videos.filter(v => !v.isShort).map((video) => (
                <VideoCard key={video._id} video={video} hideChannelInfo={true} />
              ))
            )}
          </div>
        )}
        
        {activeTab === 'Shorts' && (
          <div className="home-feed" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}}>
            {videos.filter(v => v.isShort).length === 0 ? (
              <div>This channel has no Shorts.</div>
            ) : (
              videos.filter(v => v.isShort).map((video) => (
                <VideoCard key={video._id} video={video} hideChannelInfo={true} />
              ))
            )}
          </div>
        )}

        {activeTab === 'Playlists' && (
          <div>This channel has no public playlists. (Feature coming soon)</div>
        )}

        {activeTab === 'Community' && (
          <CommunityTab channelId={id} />
        )}
      </div>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} onSuccess={handleEditSuccess} />}
    </div>
  );
};

export default Profile;
