import { NextRequest, NextResponse } from "next/server";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

async function getRefreshToken(refresh_token: string) {
  const url = "https://accounts.spotify.com/api/token";

  const params = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token || '',
    client_id: clientId,
  };

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  };

  const body = await fetch(url, payload);
  if (body.ok) {
    const response = await body.json();
    return response;
  }
}

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line prefer-const
    let { code, verifier, token, refreshToken } = await req.json();
    if (!token) {
      token = req.cookies.get('access_token')?.value;
    }
     // If a token is provided, skip the authorization code exchange process
    if (token) {
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          const newTokenData = await getRefreshToken(refreshToken);
          newTokenData.isRevoked = true;
          const retryResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${newTokenData.access_token}` },
          });
          const retryUserData = await retryResponse.json();
  
          if (!retryResponse.ok) {
              return NextResponse.json(
                { error: retryUserData.error_description || "Failed to fetch user profile after refreshing token" },
                { status: 500 }
              );
          }
          const response = NextResponse.json({ user: retryUserData, tokenData: newTokenData});
          response.cookies.set('access_token', retryUserData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600,
            sameSite: 'strict',
          });
      
          response.cookies.set('refresh_token', retryUserData.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2147483647,
            sameSite: 'strict',
          });

          return response;
        } else {
          return NextResponse.json(
            { error: userData.error_description || "Failed to fetch user profile" },
            { status: 500 }
          );
        }
      }
      const tokenData = {
        access_token: token || req.cookies.get('access_token')?.value,
        refresh_token: refreshToken || req.cookies.get('refresh_token')?.value,
      }
      return NextResponse.json({ user: userData, tokenData });
    }

    // If no token, perform authorization code exchange
    if (!code || !verifier) {
      return NextResponse.json(
        { error: "Please click 'Connect to Spotify' to connect" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("code_verifier", verifier);

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const tokenData = await tokenResponse.json();
    

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: tokenData.error_description || "Token exchange failed" },
        { status: 500 }
      );
    }

    // Fetch user profile using access token
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    const response = NextResponse.json({ user: userData, tokenData });

    response.cookies.set('access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'strict',
    });

    response.cookies.set('refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2147483647,
      sameSite: 'strict',
    });
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

