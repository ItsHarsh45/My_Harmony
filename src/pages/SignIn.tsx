import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const { login, resetPassword, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (isForgetPassword) {
      try {
        await resetPassword(email);
        setResetSuccess('Password reset email sent. Check your inbox.');
        setIsForgetPassword(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send reset email');
      }
    } else {
      try {
        await login(email, password);
        navigate('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sign in');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-pink-50 pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 text-fuchsia-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isForgetPassword ? 'Reset Password' : 'Welcome Back!'}
          </h2>
          <p className="text-gray-600">
            {isForgetPassword 
              ? 'Enter your email to reset your password' 
              : 'Sign in to continue your journey'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {resetSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {resetSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="you@example.com"
            />
          </div>

          {!isForgetPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isForgetPassword ? 'Reset Password' : 'Sign In'}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isForgetPassword ? (
            <p className="text-gray-600">
              Remembered your password?{' '}
              <button 
                onClick={() => setIsForgetPassword(false)} 
                className="text-fuchsia-600 hover:text-fuchsia-700 font-medium"
              >
                Sign In
              </button>
            </p>
          ) : (
            <>
              <button 
                onClick={() => setIsForgetPassword(true)} 
                className="text-fuchsia-600 hover:text-fuchsia-700 font-medium mb-4 block text-center w-full"
              >
                Forget Password?
              </button>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-fuchsia-600 hover:text-fuchsia-700 font-medium">
                  Sign up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}