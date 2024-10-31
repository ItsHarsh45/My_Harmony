import React from 'react';
import { Music2, Palette, BookOpen, Brain, Sparkles, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const therapyOptions = [
  {
    icon: Music2,
    title: 'Music Therapy',
    description: 'Express yourself through music and sound healing',
    link: '/therapy/music',
    gradient: 'from-blue-50 to-purple-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: Palette,
    title: 'Art Therapy',
    description: 'Heal and grow through creative expression',
    link: '/therapy/art',
    gradient: 'from-pink-50 to-rose-50',
    iconColor: 'text-pink-600'
  },
  {
    icon: BookOpen,
    title: 'Journaling',
    description: 'Document your journey and reflect on your growth',
    link: '/therapy/journal',
    gradient: 'from-amber-50 to-yellow-50',
    iconColor: 'text-amber-600'
  },
  {
    icon: Brain,
    title: 'Mood Tracker',
    description: 'Track and understand your emotional patterns',
    link: '/therapy/mood',
    gradient: 'from-green-50 to-emerald-50',
    iconColor: 'text-green-600'
  },
  {
    icon: Sparkles,
    title: 'Quick Suggestions',
    description: 'Instant activities for emotional well-being',
    link: '/therapy/suggestions',
    gradient: 'from-purple-50 to-fuchsia-50',
    iconColor: 'text-purple-600'
  }
];

export default function Therapy() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Therapeutic Activities
          </h1>
          <p className="text-xl text-gray-600">Discover various ways to express yourself and find inner peace</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {therapyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link 
                key={option.title}
                to={option.link}
                className={`bg-gradient-to-br ${option.gradient} p-8 rounded-2xl hover:shadow-xl transition group`}
              >
                <Icon className={`h-12 w-12 ${option.iconColor} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </Link>
            );
          })}
        </div>

        {/* Book Appointment Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="h-16 w-16 text-fuchsia-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Book a Session with a Therapist</h2>
            <p className="text-gray-600 mb-8">
              Connect with licensed professionals who specialize in teen mental health and well-being.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-fuchsia-50 rounded-xl">
                <h3 className="font-semibold mb-2">Individual Session</h3>
                <p className="text-gray-600 mb-4">One-on-one therapy</p>
                <p className="text-fuchsia-600 font-semibold">45 minutes</p>
              </div>
              <div className="p-6 bg-fuchsia-50 rounded-xl">
                <h3 className="font-semibold mb-2">Group Session</h3>
                <p className="text-gray-600 mb-4">Peer support group</p>
                <p className="text-fuchsia-600 font-semibold">60 minutes</p>
              </div>
              <div className="p-6 bg-fuchsia-50 rounded-xl">
                <h3 className="font-semibold mb-2">Family Session</h3>
                <p className="text-gray-600 mb-4">Family therapy</p>
                <p className="text-fuchsia-600 font-semibold">60 minutes</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-fuchsia-700 hover:to-pink-700 transition">
              Schedule Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}