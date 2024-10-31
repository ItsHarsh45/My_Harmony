import React from 'react';
import { Book, Brain, Heart, Shield } from 'lucide-react';

export default function Resources() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Mental Health Resources
          </h1>
          <p className="text-xl text-gray-600">Comprehensive guides and tools for your mental wellness journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Book className="h-12 w-12 text-fuchsia-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Educational Materials</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-fuchsia-600" />
                <span>Understanding anxiety and depression</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-fuchsia-600" />
                <span>Stress management techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-fuchsia-600" />
                <span>Building healthy relationships</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Brain className="h-12 w-12 text-pink-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Self-Help Tools</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-pink-600" />
                <span>Guided meditation exercises</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-pink-600" />
                <span>Mood tracking journal</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-pink-600" />
                <span>Breathing techniques</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-12 w-12 text-purple-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Crisis Support</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">24/7 Helplines</h3>
                <p className="text-gray-600">National Suicide Prevention Lifeline:</p>
                <p className="text-2xl font-bold text-purple-600">1-800-273-8255</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Text Support</h3>
                <p className="text-gray-600">Crisis Text Line:</p>
                <p className="text-2xl font-bold text-purple-600">Text HOME to 741741</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 p-8 rounded-2xl shadow-lg text-white mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-12 w-12" />
            <h2 className="text-2xl font-semibold">Safety Notice</h2>
          </div>
          <p className="text-lg opacity-90">
            If you or someone you know is in immediate danger, please call emergency services (911) immediately. 
            Your safety is our top priority.
          </p>
        </div>
      </div>
    </div>
  );
}