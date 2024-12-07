import React from 'react';
import { Music2, Palette, BookOpen, Brain, Sparkles, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const therapyOptions = [
  {
    icon: Music2,
    title: 'Music Therapy',
    description: 'Express yourself through music and sound healing',
    link: '/therapy/music',
    gradient: 'from-blue-50 to-purple-50',
    iconColor: 'text-blue-600',
    borderColor: 'hover:border-blue-200'
  },
  {
    icon: Palette,
    title: 'Art Therapy',
    description: 'Heal and grow through creative expression',
    link: '/therapy/art',
    gradient: 'from-pink-50 to-rose-50',
    iconColor: 'text-pink-600',
    borderColor: 'hover:border-pink-200'
  },
  {
    icon: BookOpen,
    title: 'Journaling',
    description: 'Document your journey and reflect on your growth',
    link: '/therapy/journal',
    gradient: 'from-amber-50 to-yellow-50',
    iconColor: 'text-amber-600',
    borderColor: 'hover:border-amber-200'
  },
  {
    icon: Brain,
    title: 'Mood Tracker',
    description: 'Track and understand your emotional patterns',
    link: '/therapy/mood',
    gradient: 'from-green-50 to-emerald-50',
    iconColor: 'text-green-600',
    borderColor: 'hover:border-green-200'
  },
  {
    icon: Sparkles,
    title: 'Diagnosis & Suggestions',
    description: 'Take up diagnosis test or get quick suggestion',
    link: '/therapy/DiagnosisHub',
    gradient: 'from-purple-50 to-fuchsia-50',
    iconColor: 'text-purple-600',
    borderColor: 'hover:border-purple-200'
  },
  {
    icon: Gamepad2,
    title: 'Fun Games',
    description: 'Playful mini-games to boost mood and reduce stress',
    link: '/therapy/GameHub',
    gradient: 'from-red-50 to-orange-50',
    iconColor: 'text-red-600',
    borderColor: 'hover:border-red-200'
  }
];

export default function Therapy() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Therapeutic Activities ✨
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
                className={`bg-gradient-to-br ${option.gradient} p-8 rounded-2xl
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-2
                  border-2 border-transparent ${option.borderColor}
                  group`}
              >
                <Icon className={`h-12 w-12 ${option.iconColor} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}