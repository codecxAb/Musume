"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Play, SkipForward, Music } from "lucide-react";
import Image from "next/image";

// Function to fetch the playlist from the API
const fetchPlaylist = async () => {
  const response = await fetch("/api/streams");
  if (response.ok) {
    return await response.json();
  } else {
    console.error("Failed to fetch playlist");
    return [];
  }
};

export default function Dashboard() {
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [inputLink, setInputLink] = useState("");
  const [userVotes, setUserVotes] = useState(new Set()); // Track user votes

  // Fetch playlist from the database on mount
  useEffect(() => {
    const loadPlaylist = async () => {
      const fetchedPlaylist = await fetchPlaylist();
      setPlaylist(fetchedPlaylist);
    };
    loadPlaylist();
  }, []);

  // Function to handle adding a new song
  const handleAddSong = async () => {
    // Validate the YouTube link
    const videoIdMatch = inputLink.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      console.error("Invalid YouTube URL");
      return; // Show an error to the user if needed
    }

    const newSong = {
      creatorId: "63ace882-b7e2-421d-9eb1-27b33d3f64c3", // Replace with the actual creator ID
      url: inputLink,
    };

    // Send a POST request to add a new song
    const response = await fetch("/api/streams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSong),
    });

    if (response.ok) {
      const addedSong = await response.json();
      setPlaylist((prev) => [...prev, addedSong.stream]); // Add the new song to the playlist
      setInputLink(""); // Clear the input field
    } else {
      const errorMessage = await response.text();
      console.error("Failed to add song:", errorMessage);
    }
  };

  // Function to handle voting (upvote or downvote)
  const handleVote = async (id, increment) => {
    if ((increment > 0 && userVotes.has(id)) || (increment < 0 && !userVotes.has(id))) {
      console.error("Invalid voting action");
      return; // Prevent duplicate upvotes and downvotes
    }

    const voteAction = increment > 0 ? "upvote" : "downvote";
    const response = await fetch(`/api/streams/${voteAction}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ streamId: id }),
    });

    if (response.ok) {
      const updatedStream = await response.json();
      setPlaylist((prev) =>
        prev.map((song) =>
          song.id === id ? { ...song, votes: updatedStream.votes } : song
        )
      );

      // Update user votes
      if (increment > 0) {
        userVotes.add(id);
      } else {
        userVotes.delete(id);
      }
      setUserVotes(new Set(userVotes)); // Update the state
    } else {
      const errorMessage = await response.text();
      console.error("Failed to update vote:", errorMessage);
    }
  };

  // Function to play the next song
  const handlePlayNext = () => {
    if (playlist.length > 0) {
      const nextSong = playlist[0];
      setCurrentSong(nextSong);
      setPlaylist((prev) => prev.slice(1)); // Remove the song from the playlist
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-purple-300">
          Musume Dashboard
        </h1>

        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder="Enter YouTube link"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
            className="flex-grow bg-gray-800 text-white border-purple-500"
          />
          <Button
            onClick={handleAddSong}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add to Playlist
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-purple-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                Playlist Queue
              </h2>
              <ul className="space-y-4">
                {playlist.map((song) => (
                  <li key={song.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Image src={song.thumbnail} alt={song.title} width={60} height={45} className="rounded" />
                      <div>
                        <h3 className="font-semibold text-purple-200">{song.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-purple-300">{song.votes || 0}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(song.id, 1)} // Upvote
                          className="text-purple-300 hover:text-purple-100 hover:bg-purple-800"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(song.id, -1)} // Downvote
                          className="text-purple-300 hover:text-purple-100 hover:bg-purple-800"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">Now Playing</h2>
              {currentSong ? (
                <div className="space-y-4">
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentSong.extractedId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-200">{currentSong.title}</h3>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-lg">
                  <Music className="h-16 w-16 text-purple-400 mb-4" />
                  <p className="text-gray-400">No song playing</p>
                </div>
              )}
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handlePlayNext}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {currentSong ? (
                    <>
                      <SkipForward className="mr-2 h-4 w-4" /> Play Next
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Play
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
