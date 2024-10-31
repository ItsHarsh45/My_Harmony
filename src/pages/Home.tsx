import React from 'react';
import { ArrowRight, Heart, Users, MessageCircle, Moon, Sun, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatButton from '../components/ChatButton';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-white to-fuchsia-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Your Mental Health Matters
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A safe space designed for teens, providing support, resources, and community to navigate mental wellness together.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/get-started" 
              className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-fuchsia-700 hover:to-pink-700 transition flex items-center gap-2">
              Start Your Journey <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/about" 
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition border border-gray-200">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 p-8 rounded-2xl hover:shadow-xl transition">
              <Heart className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Self-Care Tools</h3>
              <p className="text-gray-600">Discover practical techniques for managing stress and anxiety in your daily life.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-8 rounded-2xl hover:shadow-xl transition">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Peer Support</h3>
              <p className="text-gray-600">Connect with others who understand what you're going through in a safe environment.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl hover:shadow-xl transition">
              <MessageCircle className="h-12 w-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Help</h3>
              <p className="text-gray-600">Access to licensed therapists and counselors specialized in teen mental health.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Section */}
      <section className="py-20 bg-gradient-to-b from-white to-fuchsia-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
                Daily Wellness Check-In
              </h2>
              <p className="text-gray-600 mb-8">
                Track your mood, set goals, and develop healthy habits with our interactive tools designed specifically for teens.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-fuchsia-100">
                  <Moon className="h-5 w-5 text-fuchsia-600" />
                  <span className="text-fuchsia-600">Sleep Tracking</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100">
                  <Sun className="h-5 w-5 text-pink-600" />
                  <span className="text-pink-600">Mood Journal</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-600">Mindfulness</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                alt="Peaceful meditation scene"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-fuchsia-600 to-pink-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take the First Step?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of teens who are prioritizing their mental health today.</p>
          <Link to="/get-started" 
            className="bg-white text-fuchsia-600 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition inline-block">
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}