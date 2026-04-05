import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle } from 'lucide-react';
import '../pages/Home/Home.css';

const VideoCard = ({ video, hideChannelInfo }) => {
  return (
    <div className="video-card">
      <Link to={`/watch/${video._id}`} className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
      </Link>
      <div className="video-info">
        {!hideChannelInfo && (
          <Link to={`/profile/${video.uploader?._id}`}>
            {video.uploader?.avatar ? (
              <img src={video.uploader.avatar} alt="channel" className="channel-avatar" />
            ) : (
              <UserCircle size={36} className="channel-avatar" style={{color: 'var(--text-color)'}} />
            )}
          </Link>
        )}
        <div className="video-details">
          <Link to={`/watch/${video._id}`} style={{textDecoration: 'none'}}>
            <h3 className="video-title">{video.title}</h3>
          </Link>
          {!hideChannelInfo && (
            <Link to={`/profile/${video.uploader?._id}`} style={{textDecoration: 'none'}}>
              <span className="channel-name">{video.uploader?.username}</span>
            </Link>
          )}
          <div className="video-meta">
            <span>{video.views} views</span> • <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
