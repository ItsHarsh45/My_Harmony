import React from 'react';
import { ArrowRight, Heart, Users, MessageCircle, Moon, Sun, Sparkles, Star, Music, Gamepad, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
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
            <Link to="/about" 
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:shadow-xl hover:scale-105">
              What's This All About?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-violet-200">
              <Heart className="h-12 w-12 text-violet-600 mb-4 hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Self-Care Station</h3>
              <p className="text-gray-600">Cool tricks to handle stress and keep your mind happy. No boring stuff, promise! 🌟</p>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-fuchsia-200">
              <Users className="h-12 w-12 text-fuchsia-600 mb-4 hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Therapeutic Activities ✨</h3>
              <p className="text-gray-600">Discover various ways to express yourself and find inner peace</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-pink-200">
              <Star className="h-12 w-12 text-pink-600 mb-4 hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2">Pro Help (When You Need It)</h3>
              <p className="text-gray-600">Talk to friendly counselors who specialize in teen life. They're actually pretty cool! 💫</p>
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
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-violet-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                <BookOpen className="h-5 w-5 text-violet-600" />
                <span className="text-violet-600">Daily Journal</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-fuchsia-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Music className="h-5 w-5 text-fuchsia-600" />
                  <span className="text-fuchsia-600">Mood Mix</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-pink-100 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Gamepad className="h-5 w-5 text-pink-600" />
                  <span className="text-pink-600">Mind Games</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
              <img 
                src="https://s3.envato.com/files/369147749/DSC_569_30.06.2021.jpg"
                alt="Teens enjoying activities"
                className="relative rounded-2xl shadow-xl transition duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-white/10" />
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <h2 className="text-4xl font-bold mb-6">Ready to Level Up? 🚀</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of teens who are already part of our awesome community!</p>
          <Link to="/signup" 
            className="bg-white text-fuchsia-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 inline-block hover:scale-105 hover:shadow-xl">
            Let's Do This! 
          </Link>
        </div>
      </section>
    </div>
  );
}