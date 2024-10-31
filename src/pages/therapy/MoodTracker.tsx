import React from 'react';
import { Brain, Calendar, BarChart, TrendingUp } from 'lucide-react';

export default function MoodTracker() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <Brain className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Mood Tracker</h1>
          <p className="text-xl text-gray-600">Monitor and understand your emotional patterns</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Today's Check-in</h2>
            <div className="grid grid-cols-5 gap-4 mb-8">
              {['😄', '🙂', '😐', '😕', '😢'].map((emoji) => (
                <button
                  key={emoji}
                  className="aspect-square text-4xl bg-green-50 rounded-xl hover:bg-green-100 transition flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-green-200 focus:border-green-300 outline-none resize-none"
              placeholder="Add notes about your day..."
            />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Weekly Overview</h2>
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex-1">
                  <div 
                    className="bg-green-200 rounded-t-lg hover:bg-green-300 transition cursor-pointer"
                    style={{ height: `${Math.random() * 100}%` }}
                  />
                  <div className="text-center mt-2 text-sm text-gray-600">{day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold">Monthly Stats</h2>
            </div>
            <div className="space-y-4">
              {['Overall Mood', 'Sleep Quality', 'Energy Level', 'Stress Level'].map((stat) => (
                <div key={stat} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{stat}</span>
                    <span className="text-green-600">75%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold">Insights</h2>
            </div>
            <div className="space-y-4">
              {[
                'Your mood tends to be better in the morning',
                'Exercise days show improved emotional well-being',
                'Social interactions boost your mood',
                'Regular sleep schedule correlates with better mood'
              ].map((insight) => (
                <div key={insight} className="p-4 bg-green-50 rounded-xl">
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}