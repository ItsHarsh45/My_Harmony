import React from 'react';
import { BookOpen, Calendar, Clock, Tag } from 'lucide-react';

export default function Journaling() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <BookOpen className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Journaling</h1>
          <p className="text-xl text-gray-600">Document your thoughts and feelings</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-600">March 14, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-gray-600">3:30 PM</span>
                </div>
              </div>
              <textarea
                className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-300 outline-none resize-none"
                placeholder="How are you feeling today?"
              />
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition">
                  😊 Happy
                </button>
                <button className="px-4 py-2 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition">
                  😔 Sad
                </button>
                <button className="px-4 py-2 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition">
                  😤 Angry
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Previous Entries</h2>
              <div className="space-y-4">
                {['Yesterday', '2 days ago', 'Last week'].map((entry) => (
                  <div key={entry} className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-amber-600" />
                      <span>{entry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {['School', 'Family', 'Friends', 'Self-care', 'Goals'].map((tag) => (
                  <div key={tag} className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full">
                    <Tag className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}