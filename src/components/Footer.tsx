import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-fuchsia-400" />
              <span className="font-semibold text-white">MindSpace</span>
            </Link>
            <p className="text-sm">Empowering teens to prioritize and understand their mental health journey.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources/basics" className="hover:text-fuchsia-400 transition">Mental Health 101</Link></li>
              <li><Link to="/resources/crisis" className="hover:text-fuchsia-400 transition">Crisis Support</Link></li>
              <li><Link to="/resources/self-help" className="hover:text-fuchsia-400 transition">Self-Help Tools</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/community/forum" className="hover:text-fuchsia-400 transition">Forum</Link></li>
              <li><Link to="/community/groups" className="hover:text-fuchsia-400 transition">Support Groups</Link></li>
              <li><Link to="/community/events" className="hover:text-fuchsia-400 transition">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Emergency</h4>
            <p className="text-sm mb-2">24/7 Crisis Hotline:</p>
            <p className="text-xl font-bold text-fuchsia-400">1-800-273-8255</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; 2024 MindSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}