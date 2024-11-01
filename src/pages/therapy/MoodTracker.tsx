import React, { useState, useEffect } from 'react';
import { Brain, Calendar, BarChart, TrendingUp, Sun, Moon, Save, Trash2 } from 'lucide-react';

export default function MoodTracker() {
    const [moodHistory, setMoodHistory] = useState(() => {
        const saved = localStorage.getItem('moodHistory');
        return saved ? JSON.parse(saved) : [];
    });

    const [selectedMood, setSelectedMood] = useState(null);
    const [notes, setNotes] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('morning');
    const [activities, setActivities] = useState([]);
    const [savedMessage, setSavedMessage] = useState('');
    const [showCalendarView, setShowCalendarView] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }, [moodHistory]);

    const moodEmojis = { '😄': 5, '🙂': 4, '😐': 3, '😕': 2, '😢': 1 };
    const commonActivities = [
        'Exercise 🏃‍♂️', 'Reading 📚', 'Meditation 🧘‍♂️', 'Social Time 👥',
        'Work 💼', 'Hobbies 🎨', 'Nature 🌳', 'Music 🎵'
    ];

    const getWeeklyMoods = () => {
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const weekMoods = {};

        weekDays.forEach(day => {
            const dayMood = moodHistory.find(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getDay() === weekDays.indexOf(day) && 
                       entryDate >= new Date(today - 7 * 24 * 60 * 60 * 1000);
            });

            weekMoods[day] = dayMood ? moodEmojis[dayMood.mood] * 20 : 0;
        });

        return weekMoods;
    };

    const calculateAverageMood = () => {
        if (moodHistory.length === 0) return 0;
        const moodValues = moodHistory.map(entry => moodEmojis[entry.mood] * 20);
        return (moodValues.reduce((a, b) => a + b, 0) / moodValues.length).toFixed(0);
    };

    const handleSave = () => {
        if (!selectedMood) {
            setSavedMessage('Please select a mood first');
            return;
        }

        const newEntry = {
            date: new Date().toISOString(),
            mood: selectedMood,
            notes,
            timeOfDay,
            activities
        };

        setMoodHistory(prev => [newEntry, ...prev]);
        setSelectedMood(null);
        setNotes('');
        setActivities([]);
        setSavedMessage('Entry saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
    };

    const handleDeleteRecord = (dateToDelete) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            setMoodHistory(prev => prev.filter(entry => entry.date !== dateToDelete));
            setSavedMessage('Record deleted successfully!');
            setTimeout(() => setSavedMessage(''), 3000);
            setSelectedDate(null);
        }
    };

    const getMoodStreak = () => {
        if (moodHistory.length === 0) return 0;

        let streak = 1;
        const today = new Date().setHours(0, 0, 0, 0);

        for (let i = 0; i < moodHistory.length - 1; i++) {
            const currentDate = new Date(moodHistory[i].date).setHours(0, 0, 0, 0);
            const nextDate = new Date(moodHistory[i + 1].date).setHours(0, 0, 0, 0);

            if ((today - currentDate) / (1000 * 60 * 60 * 24) > streak) break;
            if ((currentDate - nextDate) / (1000 * 60 * 60 * 24) === 1) streak++;
            else break;
        }

        return streak;
    };

    const generateInsights = () => {
        if (moodHistory.length === 0) return ['Start tracking your mood to see insights!'];

        let insights = [];
        const streak = getMoodStreak();

        if (streak > 1) {
            insights.push(`🎯 ${streak} day streak! Keep it up!`);
        }

        const happyDaysActivities = moodHistory
            .filter(entry => moodEmojis[entry.mood] > 3)
            .flatMap(entry => entry.activities);

        const mostCommonActivityEntry = Object.entries(
            happyDaysActivities.reduce((acc, act) => ({ ...acc, [act]: (acc[act] || 0) + 1 }), {})
        ).sort((a, b) => b[1] - a[1])[0];

        if (mostCommonActivityEntry) {
            insights.push(`🌟 ${mostCommonActivityEntry[0]} often leads to better moods`);
        }

        const morningMoods = moodHistory.filter(entry => entry.timeOfDay === 'morning');
        const eveningMoods = moodHistory.filter(entry => entry.timeOfDay === 'evening');
        const avgMorningMood = morningMoods.reduce((acc, entry) => acc + moodEmojis[entry.mood], 0) / morningMoods.length || 0;
        const avgEveningMood = eveningMoods.reduce((acc, entry) => acc + moodEmojis[entry.mood], 0) / eveningMoods.length || 0;

        if (avgMorningMood > avgEveningMood) {
            insights.push('🌅 You tend to feel better in the mornings');
        } else if (avgEveningMood > avgMorningMood) {
            insights.push('🌙 Your mood typically improves in the evenings');
        }

        return insights;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
        
        // Add empty slots for days before the first of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }
        
        // Add all days in the month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        
        return days;
    };

    const getEntryForDate = (date) => {
        return moodHistory.find(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getDate() === date.getDate() &&
                   entryDate.getMonth() === date.getMonth() &&
                   entryDate.getFullYear() === date.getFullYear();
        });
    };

    const CalendarView = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Mood Calendar</h2>
                    <button onClick={() => setShowCalendarView(false)} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        ←
                    </button>
                    <h3 className="text-xl font-semibold">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        →
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold">
                            {day}
                        </div>
                    ))}
                    {getDaysInMonth(currentMonth).map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
                        
                        const entry = getEntryForDate(date);
                        const isSelected = selectedDate && 
                            date.toDateString() === new Date(selectedDate.date).toDateString();

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(entry)}
                                className={`aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                                    ${entry ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-50 hover:bg-gray-100'}
                                    ${isSelected ? 'ring-2 ring-green-500' : ''}`}
                            >
                                <span className="text-sm">{date.getDate()}</span>
                                {entry && <span className="text-lg">{entry.mood}</span>}
                            </button>
                        );
                    })}
                </div>

                {selectedDate && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-semibold">
                                    {new Date(selectedDate.date).toLocaleDateString()}
                                </h4>
                                <p>Mood: {selectedDate.mood}</p>
                                <p>Time: {selectedDate.timeOfDay}</p>
                                {selectedDate.notes && <p>Notes: {selectedDate.notes}</p>}
                                <p>Activities: {selectedDate.activities.join(', ')}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteRecord(selectedDate.date)}
                                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition"
                            >
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-green-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <Brain className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-4">Mood Tracker</h1>
                    <p className="text-xl text-gray-600">Monitor and understand your emotional patterns</p>
                    {savedMessage && (
                        <div className="mt-4 p-3 rounded-lg bg-green-100 text-green-700 inline-block">
                            {savedMessage}
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Today's Check-in</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition"
                                    title="Save entry"
                                >
                                    <Save className="h-5 w-5 text-green-600" />
                                </button>
                                <button
                                    onClick={() => setShowCalendarView(true)}
                                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition"
                                    title="View records"
                                >
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setTimeOfDay('morning')}
                                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition
                                    ${timeOfDay === 'morning' ? 'bg-green-100' : 'bg-gray-50'}`}
                            >
                                <Sun className="h-5 w-5" /> Morning
                            </button>
                            <button
                                onClick={() => setTimeOfDay('evening')}
                                className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition
                                    ${timeOfDay === 'evening' ? 'bg-green-100' : 'bg-gray-50'}`}
                            >
                                <Moon className="h-5 w-5" /> Evening
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-4 mb-8">
                            {Object.keys(moodEmojis).map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setSelectedMood(emoji)}
                                    className={`aspect-square text-4xl rounded-xl transition flex items-center justify-center
                                        ${selectedMood === emoji ? 'bg-green-100' : 'bg-gray-50'}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        <div className="mb-6">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Notes (Optional)"
                                className="w-full p-3 rounded-xl bg-gray-50 outline-none resize-none"
                                rows={3}
                            ></textarea>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">Activities</h3>
                        <div className="flex flex-wrap gap-2">
                            {commonActivities.map((activity) => (
                                <button
                                    key={activity}
                                    onClick={() => setActivities((prev) =>
                                        prev.includes(activity)
                                            ? prev.filter(a => a !== activity)
                                            : [...prev, activity]
                                    )}
                                    className={`px-4 py-2 rounded-full transition
                                        ${activities.includes(activity) ? 'bg-green-200' : 'bg-gray-50'}`}
                                >
                                    {activity}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6">Insights</h2>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <BarChart className="h-6 w-6 text-green-600" />
                                <span className="text-lg">Weekly Mood Chart</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Object.entries(getWeeklyMoods()).map(([day, moodValue]) => (
                                    <div key={day} className="flex flex-col items-center">
                                        <div className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center text-white font-semibold">
                                            {day}
                                        </div>
                                        <div className="w-8 h-12 rounded-lg bg-green-200 mt-2 relative overflow-hidden">
                                            <div
                                                className="absolute bottom-0 bg-green-500 h-full transition"
                                                style={{ height: `${moodValue}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                                <span className="text-lg">Overall Mood</span>
                            </div>
                            <div className="text-4xl font-semibold text-green-600">
                                {calculateAverageMood()}%
                            </div>
                            <p className="text-gray-600">Based on {moodHistory.length} entries</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">Observations</h3>
                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                {generateInsights().map((insight, index) => (
                                    <li key={index}>{insight}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {showCalendarView && <CalendarView />}
        </div>
    );
}