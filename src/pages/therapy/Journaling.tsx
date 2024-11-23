import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Save, Search, ArrowLeft, Trash2, AlertCircle, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useJournalStore } from '../../stores/useJournalStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Custom Alert Component
const CustomAlert = ({ children, variant = 'default' }) => {
  const baseClasses = "p-4 rounded-lg flex items-center gap-2 text-sm";
  const variantClasses = {
    default: "bg-amber-50 text-amber-600",
    destructive: "bg-red-50 text-red-600"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <AlertCircle className="h-4 w-4" />
      <p>{children}</p>
    </div>
  );
};

// Entry Card Component
const EntryCard = ({ entry, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-amber-50 rounded-xl hover:bg-amber-100 transition duration-200 shadow-sm cursor-pointer"
      onClick={() => onClick(entry)}
    >
      <div className="p-4 border-l-4 border-amber-400">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <span className="font-medium text-gray-800">{formatDate(entry.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-sm bg-amber-200 text-amber-700 rounded-full">
              {entry.mood}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600 line-clamp-3">{entry.content}</p>
        </div>
      </div>
    </div>
  );
};

export default function Journaling() {
  const { user } = useAuthStore();
  const { entries, addEntry, loadEntries, deleteEntry, loading, error } = useJournalStore();
  const navigate = useNavigate();
  
  const [currentEntry, setCurrentEntry] = useState('');
  const [mood, setMood] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterMood, setFilterMood] = useState('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const moodOptions = ['😊 Happy', '😌 Calm', '😔 Sad', '😤 Angry', '✨ Productive', '😴 Tired'];

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
    if (!mood) {
      setValidationError('Please select a mood before saving');
      return;
    }
    
    if (currentEntry.trim()) {
      try {
        setValidationError('');
        await addEntry({
          content: currentEntry,
          mood: mood,
          date: new Date().toISOString()
        });
        setCurrentEntry('');
        setMood('');
      } catch (err) {
        setValidationError(err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        setDeleteLoading(true);
        await deleteEntry(id);
        if (selectedEntry?.id === id) {
          setSelectedEntry(null);
        }
      } catch (err) {
        setValidationError(err.message);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const filteredAndSortedEntries = entries
    .filter(entry =>
      (entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
       entry.mood.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterMood || entry.mood === filterMood)
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

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
        {/* Header section */}
        <div className="text-center mb-16 pt-16">
          <BookOpen className="h-16 w-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Daily Journal</h1>
          <p className="text-xl text-gray-600">Reflect, Record, Remember</p>
          
          {error && (
            <div className="mt-4">
              <CustomAlert variant="destructive">{error}</CustomAlert>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Left column (writing section) */}
          <div className="col-span-2">
            {selectedEntry ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Writing
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEntry.id)}
                    disabled={deleteLoading}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                  >
                    {deleteLoading ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                    Delete
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
                  {moodOptions.map((moodOption) => (
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

                {validationError && (
                  <div className="mb-4">
                    <CustomAlert variant="destructive">{validationError}</CustomAlert>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={!currentEntry.trim() || loading || !mood}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition
                    ${currentEntry.trim() && !loading && mood
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

          {/* Enhanced Previous Entries Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Previous Entries</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className="p-2 hover:bg-amber-50 rounded-lg transition"
                  title={sortDirection === 'desc' ? 'Newest first' : 'Oldest first'}
                >
                  {sortDirection === 'desc' ? (
                    <SortDesc className="h-5 w-5 text-gray-600" />
                  ) : (
                    <SortAsc className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="p-2 hover:bg-amber-50 rounded-lg transition"
                  >
                    <Filter className="h-5 w-5 text-gray-600" />
                  </button>
                  {isFilterMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b">Filter by mood</div>
                      <button
                        onClick={() => {
                          setFilterMood('');
                          setIsFilterMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 transition"
                      >
                        All moods
                      </button>
                      {moodOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setFilterMood(option);
                            setIsFilterMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 transition"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

            {filterMood && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-sm bg-amber-100 text-amber-600 rounded-full">
                    {filterMood}
                  </span>
                  <button
                    onClick={() => setFilterMood('')}
                    className="p-1 hover:bg-amber-50 rounded-full transition"
                  >
                    <Trash2 className="h-4 w-4 text-amber-600" />
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredAndSortedEntries.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {searchTerm || filterMood
                      ? "No entries match your search criteria"
                      : "No journal entries yet. Start writing!"}
                  </p>
                </div>
              ) : (
                filteredAndSortedEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onClick={() => setSelectedEntry(entry)}
                  />
                ))
              )}
            </div>

            {filteredAndSortedEntries.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 text-center">
                  Showing {filteredAndSortedEntries.length} entries
                  {filterMood && ` filtered by ${filterMood}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}