"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Music, Play, Plus, ThumbsUp, Youtube } from "lucide-react";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 to-black animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwMDAwMjAiPjwvcmVjdD4KPHBhdGggZD0iTTAgNUw1IDBaTTYgNEw0IDZaTS0xIDFMMSAtMVoiIHN0cm9rZT0iIzRjMDA4MjEwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 animate-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
            Musume
          </h1>
          <p className="text-xl text-violet-300 animate-fade-in-up">
            Create and share playlists from YouTube and Spotify
          </p>
        </header>

        <main className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-semibold animate-fade-in-left">
              For Creators
            </h2>
            <p className="text-lg text-violet-200 animate-fade-in-left delay-100">
              Create unique playlists by combining tracks from YouTube and
              Spotify. Share your curated music experience with your fans.
            </p>
            <div className="flex space-x-4 animate-fade-in-left delay-200">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="mr-2 h-4 w-4" /> Create Playlist
              </Button>
              <Button
                variant="outline"
                className="text-violet-300 border-violet-600 hover:bg-violet-900/50"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-semibold animate-fade-in-right">
              For Fans
            </h2>
            <p className="text-lg text-violet-200 animate-fade-in-right delay-100">
              Discover new music, add tracks to playlists, and vote for the next
              song to play. Engage with your favorite creators' music
              selections.
            </p>
            <div className="animate-fade-in-right delay-200">
              <Input
                placeholder="Enter playlist link"
                className="bg-violet-900/50 border-violet-600 text-white placeholder-violet-300"
              />
              <Button className="mt-4 bg-violet-600 hover:bg-violet-700">
                <Play className="mr-2 h-4 w-4" /> Join Playlist
              </Button>
            </div>
          </div>
        </main>

        <section className="mt-24 text-center">
          <h2 className="text-3xl font-semibold mb-8 animate-fade-in-up">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Music className="h-12 w-12 mb-4" />,
                title: "Create",
                description: "Start a playlist with your favorite tracks",
              },
              {
                icon: <Plus className="h-12 w-12 mb-4" />,
                title: "Collaborate",
                description: "Let fans add songs and vote",
              },
              {
                icon: <Play className="h-12 w-12 mb-4" />,
                title: "Enjoy",
                description: "Listen together in real-time",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-violet-900/30 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-violet-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-24 text-center">
          <p className="text-violet-400">
            &copy; 2024 Musume. All rights reserved.
          </p>
        </footer>

        {/* Floating music note animation */}
        <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <Music className="text-violet-500 opacity-50" />
            </div>
          ))}
        </div>

        {/* Interactive playlist button */}
        <div
          className="fixed bottom-8 right-8 animate-bounce"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            className={`bg-violet-600 hover:bg-violet-700 rounded-full p-4 transition-all duration-300 ${
              isHovered ? "scale-110" : ""
            }`}
          >
            {isHovered ? (
              <ThumbsUp className="h-6 w-6" />
            ) : (
              <Youtube className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
