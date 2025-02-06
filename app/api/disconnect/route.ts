import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Disconnected from Spotify' });
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    sameSite: 'strict',
  });
  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    sameSite: 'strict',
  });

  return response;
}