"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SpotifyDetailsCard } from "./SpotifyDetailsCard";
import {
  getUrlParamValue,
  generateCodeVerifier,
  generateCodeChallenge,
  removeCodeFromUrl
} from "@/helpers/authHelper";
import { SpotifyUserProfile } from "@/types/spotifyUserProfile";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const authEndpoint = "https://accounts.spotify.com/authorize";
const scopes = ["user-read-email", "user-read-private", "user-read-currently-playing"];

const SpotifyWidget = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<SpotifyUserProfile | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  
  const removeCodeFromUrlCallback = useCallback(() => {
    removeCodeFromUrl(searchParams, (url) => router.replace(url, undefined));
  }, [searchParams, router]);
  
  useEffect(() => {
    const code = getUrlParamValue("code");
    setLoading(true);
    const verifier = localStorage.getItem('verifier');
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, verifier }),
    })
      .then((res) => res.json())
      .then(({user, tokenData}) => {
        localStorage.setItem("access_token", tokenData.access_token);
        setUser(user);
        removeCodeFromUrlCallback();
      })
      .finally(() => setLoading(false));
  }, [removeCodeFromUrlCallback]);

  const handleLogin = async () => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    const challengeUrlParam = `code_challenge_method=S256&code_challenge=${challenge}`;
    const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
      scopes.join(" ")
    )}&response_type=code&show_dialog=true&${challengeUrlParam}`;
    router.push(url);
  };

  const handleDisconnect = async () => {
    await fetch("/api/disconnect", {
      method: "POST",
    });
    setUser(null);
  };

  if (loading) {
    return <div className="p-6 min-h-screen flex flex-col items-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen flex flex-col items-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Spotify Music Widget</h1>
      {!user ? (
        <Button onClick={handleLogin} className="bg-green-500 hover:bg-green-600 text-white">
          Connect to Spotify
        </Button>
        
      ) : (
        <>
          <SpotifyDetailsCard user={user} baseUrl={baseUrl}/>
          <Button onClick={handleDisconnect} className="bg-green-500 hover:bg-green-600 text-white">
            Disconnect from Spotify
          </Button>
        </>
      )}
    </div>
  );
};

export default SpotifyWidget;
