'use client';
import { useEffect } from 'react';

interface TrackInfoProps {
  token: string | null;
  trackData: string | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ token, trackData }) => {
  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
    }
  }, [token]);

  return (
    <div>
      {trackData ? (
        <pre>{trackData}</pre>
      ) : (
        <div>No track currently playing</div>
      )}
    </div>
  );
};

export default TrackInfo;
