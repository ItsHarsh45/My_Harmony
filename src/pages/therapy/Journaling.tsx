import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Save, Search, ArrowLeft } from 'lucide-react';
import { useJournalStore } from '../../stores/useJournalStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Journaling() {
  const { user } = useAuthStore();
  const { entries, addEntry, loadEntries, loading, error } = useJournalStore();
  const navigate = useNavigate();
  
  const [currentEntry, setCurrentEntry] = useState('');
  const [mood, setMood] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadEntries().catch(console.error);
  }, [user, navigate, loadEntries]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleSave = async () => {
    if (currentEntry.trim()) {
      try {
        await addEntry({
          content: currentEntry,
          mood: mood,
          date: new Date().toISOString()
        });
        setCurrentEntry('');
        setMood('');
        alert('Entry saved successfully!');
      } catch (err) {
        alert('Failed to save entry: ' + err.message);
      }
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-16 pt-16">
          <BookOpen className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Daily Journal</h1>
          <p className="text-xl text-gray-600">Reflect, Record, Remember</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="col-span-2">
            {selectedEntry ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Writing
                  </button>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <span className="text-gray-600">{formatDate(selectedEntry.date)}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-amber-100 text-amber-600 rounded-full">
                    {selectedEntry.mood}
                  </span>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEntry.content}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <span className="text-gray-600">{currentDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-gray-600">{currentTime}</span>
                  </div>
                </div>

                <textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-300 outline-none resize-none text-gray-700"
                  placeholder="How are you feeling today?"
                />

                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {['😊 Happy', '😌 Calm', '😔 Sad', '😤 Angry', '✨ Productive', '😴 Tired'].map((moodOption) => (
                    <button
                      key={moodOption}
                      onClick={() => setMood(moodOption)}
                      className={`px-4 py-2 rounded-full transition ${
                        mood === moodOption
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      }`}
                    >
                      {moodOption}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  disabled={!currentEntry.trim() || loading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition
                    ${currentEntry.trim() && !loading
                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Entry
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Previous Entries</h2>
            </div>
            <div className="relative mb-6">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-300 outline-none"
              />
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-amber-600" />
                      <span className="font-medium">{formatDate(entry.date)}</span>
                    </div>
                    <span className="text-sm text-gray-600">{entry.mood}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}