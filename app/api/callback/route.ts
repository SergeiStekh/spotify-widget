import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code from Spotify' },
      { status: 400 }
    );
  }

  // Redirect to frontend with the code
  return NextResponse.redirect(new URL(`/?code=${code}`, req.url));
}