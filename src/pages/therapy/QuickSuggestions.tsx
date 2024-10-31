import React from 'react';
import { Sparkles, Heart, Brain, Wind, Coffee } from 'lucide-react';

export default function QuickSuggestions() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Sparkles className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Quick Suggestions</h1>
          <p className="text-xl text-gray-600">Simple activities to boost your mood right now</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Heart,
              title: 'Take 5 Deep Breaths',
              description: 'Focus on your breathing for instant calm',
              time: '1 min'
            },
            {
              icon: Brain,
              title: 'Quick Meditation',
              description: 'A short guided meditation session',
              time: '5 mins'
            },
            {
              icon: Wind,
              title: 'Stretch Break',
              description: 'Simple stretches to release tension',
              time: '3 mins'
            },
            {
              icon: Coffee,
              title: 'Mindful Break',
              description: 'Take a moment to enjoy a drink mindfully',
              time: '5 mins'
            }
          ].map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <Icon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-600">{activity.time}</span>
                  <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition">
                    Start Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl shadow-lg text-white mb-16">
          <h2 className="text-2xl font-semibold mb-4">Need More Support?</h2>
          <p className="mb-6">Our counselors are available 24/7 to help you through difficult moments.</p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-full hover:bg-gray-100 transition">
            Talk to Someone Now
          </button>
        </div>
      </div>
    </div>
  );
}