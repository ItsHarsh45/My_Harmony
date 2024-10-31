import React from 'react';
import { Music2, Play, Pause, SkipForward, Volume2 } from 'lucide-react';

export default function MusicTherapy() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Music2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Music Therapy</h1>
          <p className="text-xl text-gray-600">Find peace and healing through the power of music</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Recommended Playlists</h2>
            <div className="space-y-4">
              {['Calming Meditation', 'Stress Relief', 'Sleep & Relaxation', 'Focus & Study'].map((playlist) => (
                <div key={playlist} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-blue-600" />
                    <span>{playlist}</span>
                  </div>
                  <Volume2 className="h-5 w-5 text-blue-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Current Session</h2>
            <div className="text-center">
              <div className="w-48 h-48 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Music2 className="h-24 w-24 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calming Meditation</h3>
              <p className="text-gray-600 mb-6">Track 1 of 10</p>
              <div className="flex justify-center items-center gap-4">
                <button className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                  <SkipForward className="h-6 w-6 text-blue-600 rotate-180" />
                </button>
                <button className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition">
                  <Pause className="h-8 w-8 text-white" />
                </button>
                <button className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition">
                  <SkipForward className="h-6 w-6 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}