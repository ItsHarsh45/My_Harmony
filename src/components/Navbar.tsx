import React, { useState, useEffect, useRef } from 'react';
import { Brain, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      
      // The issue is here - we need to exclude the button from the check
      if (
        isMobileMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        mobileButtonRef.current && 
        !mobileButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isProfileOpen, isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-fuchsia-600 flex-shrink-0" />
            <span className="font-semibold text-lg sm:text-xl text-gray-900">My Harmony</span>
          </Link>
          
          {/* Desktop navigation */}
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

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            {!user ? (
              <Link 
                to="/signin"
                className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-3 py-1.5 text-sm rounded-full hover:from-fuchsia-700 hover:to-pink-700 transition"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-fuchsia-100 hover:bg-fuchsia-200 ring-2 ring-fuchsia-500 ring-offset-1 transition-all duration-200"
                >
                  <User className="h-5 w-5 text-fuchsia-600" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 z-50">
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
            )}
            
            <button
              ref={mobileButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-fuchsia-600 hover:bg-fuchsia-50 focus:outline-none transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle classes based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/support"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
            >
              Support
            </Link>
            <Link
              to="/therapy"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
            >
              Therapy
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
