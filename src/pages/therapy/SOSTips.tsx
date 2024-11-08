import React, { useState, useEffect } from 'react';
import { Shield, Heart, Brain, Wind, Sparkles, MessageCircle, Timer, Music, Smile, Users, BookOpen, Sun, Moon, Coffee, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const breathingExercise = {
  inhale: 4,
  hold: 4,
  exhale: 4,
  pause: 2,
};

const moodBoosterActivities = [
  "Listen to your favorite upbeat song 🎵",
  "Text a friend you trust 💬",
  "Watch funny yt shorts or memes 😄",
  "Step outside for fresh air 🌳",
  "Hug a pet or soft pillow 🐱",
  "Draw or doodle your feelings 🎨",
  "Dance it out in your room 💃",
  "Write in your journal 📝",
  "Play your favorite game 🎮",
  "Do 10 jumping jacks 🏃‍♀️",
  "Make a gratitude list ✨",
  "Take a quick shower 🚿",
  "Organize your desk 📚",
  "Look at old happy photos 📸",
  "Do a quick stretch 🧘‍♀️"
];

const positiveAffirmations = [
  "I am capable of handling whatever comes my way",
  "Every day is a fresh start",
  "I choose to be confident",
  "I am worthy of love and respect",
  "My potential is limitless",
  "I trust in my journey",
  "I embrace the present moment",
  "I radiate positive energy",
  "I am becoming my best self",
  "My happiness matters"
];

export default function SOSTips() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showRandomActivity, setShowRandomActivity] = useState('');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    updateTimeOfDay();
    const timer = setInterval(updateTimeOfDay, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const updateTimeOfDay = () => {
    const hour = new Date().getHours();
    setTimeOfDay(hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening');
  };

  const getRandomActivity = () => {
    const activity = moodBoosterActivities[Math.floor(Math.random() * moodBoosterActivities.length)];
    setShowRandomActivity(activity);
  };

  const markActivityComplete = (activity: string) => {
    if (!completedActivities.includes(activity)) {
      setCompletedActivities([...completedActivities, activity]);
      setStreakCount(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getNewAffirmation = () => {
    const affirmation = positiveAffirmations[Math.floor(Math.random() * positiveAffirmations.length)];
    setCurrentAffirmation(affirmation);
  };

  useEffect(() => {
    getNewAffirmation();
  }, []);

  const startBreathingExercise = () => {
    setIsBreathing(true);
    let totalTime = breathingExercise.inhale + breathingExercise.hold + 
                    breathingExercise.exhale + breathingExercise.pause;
    
    const runBreathingCycle = () => {
      setCountdown(breathingExercise.inhale);
      setBreathingPhase('Inhale');
      
      setTimeout(() => {
        setCountdown(breathingExercise.hold);
        setBreathingPhase('Hold');
        
        setTimeout(() => {
          setCountdown(breathingExercise.exhale);
          setBreathingPhase('Exhale');
          
          setTimeout(() => {
            setCountdown(breathingExercise.pause);
            setBreathingPhase('Pause');
            
            setTimeout(() => {
              if (isBreathing) runBreathingCycle();
            }, breathingExercise.pause * 1000);
          }, breathingExercise.exhale * 1000);
        }, breathingExercise.hold * 1000);
      }, breathingExercise.inhale * 1000);
    };

    runBreathingCycle();
  };

  const stopBreathingExercise = () => {
    setIsBreathing(false);
    setBreathingPhase('');
    setCountdown(0);
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-red-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Animation */}
        <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-300">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
            Instant Vibe
          </h1>
          <p className="text-xl text-gray-600">Quick ways to feel better when things get tough 💪</p>
          {streakCount > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Activity Streak: {streakCount}</span>
            </div>
          )}
        </div>

        {/* Time-based Greeting with Enhanced Styling */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            {timeOfDay === 'morning' ? (
              <Sun className="h-8 w-8 text-amber-500 animate-spin-slow" />
            ) : timeOfDay === 'afternoon' ? (
              <Sun className="h-8 w-8 text-orange-500 animate-spin-slow" />
            ) : (
              <Moon className="h-8 w-8 text-indigo-500 animate-pulse" />
            )}
            <div>
              <h2 className="text-2xl font-bold">Good {timeOfDay}!</h2>
              <p className="text-gray-600">Remember: every moment is a fresh start ✨</p>
            </div>
          </div>
          {/* Daily Affirmation */}
          <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl">
            <p className="text-lg font-medium text-gray-800">{currentAffirmation}</p>
            <button 
              onClick={getNewAffirmation}
              className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              New affirmation <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Random Mood Booster with Animation */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl shadow-lg text-white mb-8 transform hover:scale-102 transition-all duration-300">
          <div className="text-center">
            <Smile className="h-12 w-12 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-4">Quick Mood Booster</h2>
            <div className="min-h-[60px] mb-6">
              <p className="text-xl">{showRandomActivity || "Click for a random activity!"}</p>
              {showRandomActivity && (
                <button
                  onClick={() => markActivityComplete(showRandomActivity)}
                  className="mt-4 px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition"
                >
                  Mark as Done ✓
                </button>
              )}
            </div>
            <button
              onClick={getRandomActivity}
              className="px-6 py-3 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition font-semibold transform hover:scale-105"
            >
              ✨ Get Random Activity ✨
            </button>
          </div>
        </div>

        {/* Enhanced Breathing Exercise */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-6">
            <Wind className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Chill Breathing</h2>
            <p className="text-gray-600">Take a moment to breathe with this simple exercise</p>
          </div>

          {isBreathing ? (
            <div className="text-center">
              <div className={`w-32 h-32 rounded-full bg-red-100 mx-auto mb-6 flex items-center justify-center transition-all duration-1000 ${
                breathingPhase === 'Inhale' ? 'scale-125 bg-blue-100' : 
                breathingPhase === 'Hold' ? 'scale-110 bg-green-100' : 
                breathingPhase === 'Exhale' ? 'scale-90 bg-red-100' : 'scale-100'
              }`}>
                <div className="text-3xl font-bold text-red-600">{countdown}</div>
              </div>
              <p className="text-xl font-semibold mb-6">{breathingPhase}</p>
              <button
                onClick={stopBreathingExercise}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition transform hover:scale-105"
              >
                Take a Break
              </button>
            </div>
          ) : (
            <button
              onClick={startBreathingExercise}
              className="w-full py-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition font-semibold transform hover:scale-102"
            >
              Start Breathing Exercise
            </button>
          )}
        </div>

        {/* Enhanced Quick Help Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Brain,
              title: '5-4-3-2-1 Game',
              description: 'Find: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
              color: 'blue'
            },
            {
              icon: Music,
              title: 'Music Break',
              description: 'Put on your favorite song and focus only on the beat and lyrics',
              color: 'indigo'
            },
            {
              icon: Users,
              title: 'Reach Out',
              description: 'Text or call someone you trust - a friend, family member, or counselor',
              color: 'pink'
            },
            {
              icon: Coffee,
              title: 'Mindful Moment',
              description: 'Take a sip of water or tea, focus on the temperature and taste',
              color: 'amber'
            },
            {
              icon: Heart,
              title: 'Self-Care Check',
              description: 'When did you last eat? Need water? Quick bathroom break?',
              color: 'rose'
            },
            {
              icon: Sparkles,
              title: 'Change of Scene',
              description: 'Move to a different room or spot - small changes can help!',
              color: 'violet'
            }
          ].map((technique) => {
            const Icon = technique.icon;
            return (
              <div 
                key={technique.title} 
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => markActivityComplete(technique.title)}
              >
                <Icon className={`h-10 w-10 text-${technique.color}-600 mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{technique.title}</h3>
                <p className="text-gray-600">{technique.description}</p>
                {completedActivities.includes(technique.title) && (
                  <div className="mt-4 text-green-500 flex items-center gap-2">
                    <span className="text-sm">Completed</span>
                    <Star className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enhanced Support Options */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 rounded-2xl shadow-lg text-white mb-8 transform hover:scale-102 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4">Want to Talk?</h2>
          <p className="mb-6">You don't have to deal with this alone. We're here to listen 💜</p>
          <Link
            to="../support/book-appointment"
            className="px-6 py-3 bg-white text-red-600 rounded-full hover:bg-gray-100 transition font-semibold inline-block transform hover:scale-105"
          >
            Talk to Someone Now
          </Link>
        </div>

        {/* Enhanced Positive Reminders */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 transform hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="h-8 w-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold">Remember This</h2>
              <p className="text-gray-600">Some quick reminders that might help ❤️</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "This feeling won't last forever",
              "You're stronger than you think",
              "It's okay to not be okay",
              "Small steps are still progress",
              "You matter, always ❤️",
              "Tomorrow is a new day"
            ].map((reminder, index) => (
              <div 
                key={index} 
                className="p-4 bg-red-50 rounded-xl transform hover:scale-105 transition-all duration-300 hover:bg-red-100 cursor-pointer"
                onClick={() => {
                  setCurrentAffirmation(reminder);
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 2000);
                }}
              >
                <p className="font-medium">{reminder}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Your Progress</h2>
              <p className="text-gray-600">Keep track of your wellness journey</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold">{completedActivities.length}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((completedActivities.length / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {completedActivities.length >= 10 
                ? "Amazing work! You've reached today's goal! 🎉" 
                : `${10 - completedActivities.length} more activities to reach today's goal`}
            </p>
          </div>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {/* Add simple CSS-based confetti animation */}
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-500 to-pink-500 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animation: `fall ${1 + Math.random() * 2}s linear forwards`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .scale-102 {
          --tw-scale-x: 1.02;
          --tw-scale-y: 1.02;
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(-1%);
          }
          50% {
            transform: translateY(1%);
          }
        }

        .hover\:scale-102:hover {
          --tw-scale-x: 1.02;
          --tw-scale-y: 1.02;
          transform: scale(var(--tw-scale-x)) scale(var(--tw-scale-y));
        }
      `}</style>
    </div>
  );
}