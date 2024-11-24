import React, { useState, useEffect, useRef } from 'react';
import { Brain, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Brain className="h-8 w-8 text-fuchsia-600 flex-shrink-0" />
            <span className="font-semibold text-xl text-gray-900">iKya</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-fuchsia-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/support" 
              className="text-gray-600 hover:text-fuchsia-600 transition-colors font-medium"
            >
              Support
            </Link>
            <Link 
              to="/therapy" 
              className="text-gray-600 hover:text-fuchsia-600 transition-colors font-medium"
            >
              Therapy
            </Link>

            {!user ? (
              <Link 
                to="/signin"
                className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-fuchsia-700 hover:to-pink-700 transition"
              >
                Sign In
              </Link>
            ) : null}
            
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => user && setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200
                  ${user 
                    ? 'bg-fuchsia-100 hover:bg-fuchsia-200 ring-2 ring-fuchsia-500 ring-offset-2' 
                    : 'bg-gray-100 cursor-not-allowed opacity-50'
                  }`}
              >
                <User className={`h-5 w-5 ${user ? 'text-fuchsia-600' : 'text-gray-400'}`} />
              </button>

              {user && isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
