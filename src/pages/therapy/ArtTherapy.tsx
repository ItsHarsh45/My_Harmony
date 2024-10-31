import React from 'react';
import { Palette, Image, PenTool, Eraser } from 'lucide-react';

export default function ArtTherapy() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Palette className="h-16 w-16 text-pink-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Art Therapy</h1>
          <p className="text-xl text-gray-600">Express yourself through creative visualization</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="col-span-2 bg-white p-8 rounded-2xl shadow-lg">
            <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
              <PenTool className="h-12 w-12 text-gray-400" />
            </div>
            <div className="flex gap-4">
              {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full shadow-md hover:scale-110 transition"
                  style={{ backgroundColor: color }}
                />
              ))}
              <button className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                <Eraser className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Today's Prompts</h2>
            <div className="space-y-4">
              {[
                'Draw your safe space',
                'Visualize your emotions',
                'Create a healing garden',
                'Express your dreams'
              ].map((prompt) => (
                <div key={prompt} className="p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-pink-600" />
                    <span>{prompt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}