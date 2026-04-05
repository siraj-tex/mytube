import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { UserCircle } from 'lucide-react';
import '../pages/Home/Home.css';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/watch/${video._id}`} className="video-card">
      <div className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
      </div>
      <div className="video-info">
        {video.uploader?.avatar ? (
          <img src={video.uploader.avatar} alt="channel" className="channel-avatar" />
        ) : (
          <UserCircle size={36} className="channel-avatar" />
        )}
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <span className="channel-name">{video.uploader?.username}</span>
          <div className="video-meta">
            <span>{video.views} views</span> • <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
