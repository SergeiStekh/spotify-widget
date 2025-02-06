import { cookies } from 'next/headers';
import axios from 'axios';

const UserPage = async () => {
  const accessTokenCookie = (await cookies()).get('access_token')?.value;

  if (!accessTokenCookie) {
    return (
      <div>
        <h1>Authorization required</h1>
        <script>
          {`window.location.href = '/'`}
        </script>
      </div>
    );
  }

  let track = null;

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessTokenCookie}`,
      },
    });

    if (response.status !== 204 && response.data) {
      track = response.data;
    }
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
  }

  if (!track) {
    return <div>No track currently playing</div>;
  }

  const songName = track.item.name;
  interface Artist {
    name: string;
  }

  const artistName = track.item.artists.map((artist: Artist) => artist.name).join(', ');

  return (
      <pre>{`${songName} - ${artistName}`}</pre>
  );
};

export default UserPage;