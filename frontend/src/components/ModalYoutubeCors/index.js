import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

const YouTubePreview = ({ videoUrl }) => {
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    // Extract the video ID from the URL
    let videoId = videoUrl.split('v=')[1];

    if (!videoId) {
      const match = videoUrl.match(/(?:youtu\.be\/)([^?\n]+)/);
      videoId = match ? match[1] : null;

    }

    let ampersandPosition = videoId.indexOf('&');

    if (ampersandPosition != -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    
    setVideoId(videoId);
  }, [videoUrl]);

  const opts = {
    height: '300',
    width: '100%',
  };

  return (
    <div>
      {videoId && <YouTube videoId={videoId} opts={opts} style={{ borderRadius: 10, overflow: 'hidden' }} />}
    </div>
  );
};

export default YouTubePreview;