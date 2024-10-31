import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-fuchsia-600" />
            <span className="font-semibold text-xl">iKya</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/resources" className="text-gray-600 hover:text-fuchsia-600 transition">Resources</Link>
            <Link to="/support" className="text-gray-600 hover:text-fuchsia-600 transition">Support</Link>
            <Link to="/therapy" className="text-gray-600 hover:text-fuchsia-600 transition">Therapy</Link>
            <Link to="/emergency" className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-fuchsia-700 hover:to-pink-700 transition">
              Get Help Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}