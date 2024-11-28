import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { ArrowRight, Heart, Users, Sun, Music, Gamepad, BookOpen, Moon, Coffee, Star, User, Sparkles, Calendar, ExternalLink, Palette, Lightbulb, ChevronRight } from 'lucide-react';
import { useAppointmentStore } from '../stores/useAppointmentStore';

const therapists = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Child & Adolescent Psychiatrist',
    specialty: 'Anxiety & Depression in Teens'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    title: 'Adolescent Psychologist',
    specialty: 'Teen Identity & Social Issues'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    title: 'Teen Trauma Specialist',
    specialty: 'Trauma & Resilience Building'
  },
  {
    id: 4,
    name: 'Dr. Aisha Patel',
    title: 'Youth Mental Health Specialist',
    specialty: 'Digital Age Mental Health'
  },
  {
    id: 5,
    name: 'Dr. James Wilson',
    title: 'Adolescent Behavioral Specialist',
    specialty: 'ADHD & Executive Functioning'
  }
];

const activities = [
  "🧘 Take a 10-minute mindfulness break",
  "📓 Write in your journal",
  "🚶 Go for a short walk",
  "😮‍💨 Practice deep breathing",
  "🎧 Listen to your favorite song",
  "🤸 Stretch your body",
  "📞 Call a friend",
  "📖 Read a chapter of a book",
  "🎨 Try a new hobby",
  "✏️ Draw or doodle"
];

const affirmations = [
  "🌟 I am capable of amazing things",
  "🌅 Every day is a fresh start",
  "💪 I choose to be confident", 
  "❤️ I am worthy of love and respect",
  "🚀 My potential is limitless",
  "🌈 I trust my journey",
  "✨ I radiate positive energy",
  "🌱 I am growing stronger each day",
  "🗣️ My voice matters",
  "🦄 I embrace my uniqueness"
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { appointments } = useAppointmentStore();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [randomActivity] = useState(() => 
    activities[Math.floor(Math.random() * activities.length)]
  );
  const [randomAffirmation] = useState(() => 
    affirmations[Math.floor(Math.random() * affirmations.length)]
  );

  // Function to get therapist name (moved outside of the component to be consistent)
  const getTherapistName = (therapistId) => {
    const therapist = therapists.find(t => t.id === Number(therapistId));
    return therapist ? therapist.name : 'Unknown Therapist';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good evening');
    } else {
      setGreeting('Good night');
    }
  }, [currentTime]);

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (hour >= 12 && hour < 17) return <Coffee className="h-6 w-6 text-orange-500" />;
    if (hour >= 17 && hour < 22) return <Star className="h-6 w-6 text-purple-500" />;
    return <Moon className="h-6 w-6 text-blue-500" />;
  };

  const nextAppointment = appointments
    .filter(apt => new Date(`${apt.date} ${apt.time}`) > new Date() && apt.status === 'scheduled')
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())[0];

  // Redirect to Home if no user is logged in
  if (!user) {
    return <Home />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-pink-50 pt-8 pb-20 px-4 overflow-hidden">
      {/* Background Animation Divs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="animate-pulse absolute top-20 left-20 w-12 h-12 rounded-full bg-yellow-200 opacity-40" />
        <div className="animate-bounce absolute top-40 right-32 w-8 h-8 rounded-full bg-pink-200 opacity-40" />
        <div className="animate-pulse absolute bottom-20 left-40 w-10 h-10 rounded-full bg-purple-200 opacity-40" />
      </div>

      {/* Content with relative positioning */}
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-violet-200 group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {getTimeIcon()}
              <h1 className="text-3xl font-bold text-violet-900">
                {greeting}, {user?.displayName?.split(' ')[0]}!
              </h1>
            </div>
            <Link 
              to="/profile" 
              className="flex items-center gap-2 text-violet-700 hover:text-violet-800 transition-colors border-2 border-violet-300 hover:border-violet-400 rounded-full px-3 py-1 group"
            >
              <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>About Me</span>
            </Link>
          </div>
          <div className="space-y-4">
            <p className="text-violet-600">
              It's {currentTime.toLocaleTimeString()} on {currentTime.toLocaleDateString()}
            </p>
            <p className="text-xl text-violet-800 italic">"{randomAffirmation}"</p>
          </div>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-gradient-to-br from-fuchsia-100 to-pink-100 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-fuchsia-200 group">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-fuchsia-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-fuchsia-700 group-hover:scale-110 transition-transform duration-300" />
              Next Appointment
            </h2>
          </div>
          {nextAppointment ? (
            <div className="space-y-3">
              <div className="text-lg font-medium text-fuchsia-900">
                {new Date(nextAppointment.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-fuchsia-700">{nextAppointment.time}</div>
              <div className="text-fuchsia-600">
                {getTherapistName(nextAppointment.therapistId)}
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 mt-4 text-fuchsia-700 hover:text-fuchsia-800 transition-colors border-2 border-fuchsia-300 hover:border-fuchsia-400 rounded-full px-3 py-1 group"
              >
                View Appointments <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-fuchsia-400 mx-auto mb-3" />
              <p className="text-fuchsia-600">No upcoming appointments</p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 mt-4 text-fuchsia-700 hover:text-fuchsia-800 transition-colors border-2 border-fuchsia-300 hover:border-fuchsia-400 rounded-full px-3 py-1 group"
              >
                View Appointments <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Try This Today Card - Full Width */}
        <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2 border-violet-200 group">
          <h2 className="text-2xl font-bold text-violet-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-violet-700 group-hover:scale-110 transition-transform duration-300" />
            Try This Today
          </h2>
          <p className="text-2xl text-violet-800">{randomActivity}</p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="bg-gradient-to-b from-violet-50 via-fuchsia-50 to-pink-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="animate-pulse absolute top-20 left-20 w-12 h-12 rounded-full bg-yellow-200 opacity-40" />
          <div className="animate-bounce absolute top-40 right-32 w-8 h-8 rounded-full bg-pink-200 opacity-40" />
          <div className="animate-pulse absolute bottom-20 left-40 w-10 h-10 rounded-full bg-purple-200 opacity-40" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Hey There! 👋 Your Vibe Matters
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Welcome to your cool corner of the internet! A judgment-free zone where you can be yourself, find support, and connect with others who get it. 
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" 
              className="group bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105">
              Join the Squad <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/signin" 
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:shadow-xl hover:scale-105">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-violet-200 relative">
              <Heart className="h-12 w-12 text-violet-600 mb-4 hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Self-Care Station</h3>
              <p className="text-gray-600">Cool tricks to handle stress and keep your mind happy. No boring stuff, promise! 🌟</p>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-fuchsia-200 relative group">
              <Users className="h-12 w-12 text-fuchsia-600 mb-4 hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Therapeutic Activities ✨</h3>
              <p className="text-gray-600">Discover various ways to express yourself and find inner peace</p>
              <Link to="/therapy" className="absolute inset-0 z-10">
                <span className="sr-only">Explore Therapeutic Activities</span>
              </Link>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-800 transition-colors">
                  <ChevronRight className="h-5 w-5 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-pink-200 relative group">
              <Star className="h-12 w-12 text-pink-600 mb-4 hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Pro Help (When You Need It)</h3>
              <p className="text-gray-600">Talk to friendly counselors who specialize in teen life. They're actually pretty cool! 💫</p>
              <Link to="/support" className="absolute inset-0 z-10">
                <span className="sr-only">Explore Professional Help</span>
              </Link>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 text-pink-600 hover:text-pink-800 transition-colors">
                  <ChevronRight className="h-5 w-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
                Daily Vibe Check ✨
              </h2>
              <p className="text-gray-600 mb-8">
                Track your mood, level up your habits, and unlock achievements! It's like a game, but for your wellbeing.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-violet-100">
                  <BookOpen className="h-5 w-5 text-violet-600" />
                  <span className="text-violet-600">Daily Journal</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-fuchsia-100">
                  <Music className="h-5 w-5 text-fuchsia-600" />
                  <span className="text-fuchsia-600">Mood Mix</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-pink-100">
                  <Gamepad className="h-5 w-5 text-pink-600" />
                  <span className="text-pink-600">Mind Games</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-violet-100">
                  <Palette className="h-5 w-5 text-violet-600" />
                  <span className="text-violet-600">Art Therapy</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-fuchsia-100">
                  <Lightbulb className="h-5 w-5 text-fuchsia-600" />
                  <span className="text-fuchsia-600">Personal Suggestions</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-2xl blur opacity-25" />
              <img 
                src="https://lafayettefamilyymca.org/wp-content/uploads/2022/01/143021920_m-1.jpg"
                alt="Self_Care/Self_Love"
                className="relative rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}