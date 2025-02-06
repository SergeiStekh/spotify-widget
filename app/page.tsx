import SpotifyWidget from "@/components/SpotifyWidget"
import { Suspense } from 'react';

const Home = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <SpotifyWidget />
      </div>
    </Suspense>
  );
};

export default Home;