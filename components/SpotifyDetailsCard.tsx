import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SpotifyUserProfile } from "@/types/spotifyUserProfile";
import { CopyButton } from "./CopyButton";

interface SpotifyDetailsCardProps {
  user: SpotifyUserProfile | null | undefined;
}

export const SpotifyDetailsCard: React.FC<SpotifyDetailsCardProps> = ({ user }) => {
  console.log(user);
  return (
    <Card className="w-full max-w-md bg-gray-800">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-4 text-white">Spotify Details</h2>
        {user && (
          <>
            <p className="mb-4 text-white">
              <strong>Spotify Username:</strong>:
            </p>
            <div className="flex items-center space-x-2">
              <Input type="text" value={user.id} readOnly className="bg-gray-700 text-white" />
              <CopyButton contentToCopy={user.id} />
            </div>

            <p className="mb-4 text-white">
              <strong>Nightbot Command:</strong>:
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={`http://localhost:3000/bot/${user?.id}`}
                readOnly
                className="bg-gray-700 text-white"
              />
              <CopyButton contentToCopy={`http://localhost:3000/bot/${user?.id}`} />
            </div>

            <p className="mb-4 text-white">
              <strong>StreamElements Command:</strong>:
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={`http://localhost:3000/bot/${user?.id}`}
                readOnly
                className="bg-gray-700 text-white"
              />
              <CopyButton contentToCopy={`http://localhost:3000/bot/${user?.id}`} />
            </div>

            <p className="mb-4 text-white">
              <strong>Current Song Link:</strong>:
            </p>
            <div className="flex items-center space-x-2">
              <a
                href={`http://localhost:3000/bot/${user?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Current Song
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};