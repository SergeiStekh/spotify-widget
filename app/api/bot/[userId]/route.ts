import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function GET(req: NextRequest) {
  // Check if access token cookie exists
  const accessTokenCookie = req.cookies.get('access_token')?.value;
  
  if (!accessTokenCookie) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessTokenCookie}`,
      },
    });
    
    if (response.status === 204 || !response.data) {
      return NextResponse.json({ message: 'No track currently playing' });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token expired, try to refresh it
      try {
        await axios.post('/api/auth');
        const accessToken = req.cookies.get('access_token')?.value;
        // Retry the request with the new access token
        const retryResponse = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (retryResponse.status === 204 || !retryResponse.data) {
          return NextResponse.json({ message: 'No track currently playing' });
        }

        return NextResponse.json(retryResponse.data);
      } catch {
        return NextResponse.json(
          { error: 'Failed to refresh token' },
          { status: 401 }
        );
      }
    }

    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    const errorMessage = axiosError.response?.data || 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status });
  }
};