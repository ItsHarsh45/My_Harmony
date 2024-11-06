import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit2, Brain, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How would you describe your energy levels throughout the day?",
    options: ["Morning person", "Night owl", "Steady energy", "Variable energy"]
  },
  {
    id: 2,
    text: "What helps you feel most relaxed?",
    options: ["Nature walks", "Creative activities", "Social interactions", "Quiet solitude"]
  },
  {
    id: 3,
    text: "How do you prefer to learn new things?",
    options: ["Visual content", "Reading", "Hands-on practice", "Discussion"]
  },
  {
    id: 4,
    text: "What type of creative activities interest you most?",
    options: ["Art & Drawing", "Music & Dance", "Writing & Poetry", "DIY & Crafts"]
  },
  {
    id: 5,
    text: "How do you typically handle stress?",
    options: ["Physical exercise", "Meditation", "Talking with friends", "Creative expression"]
  },
  {
    id: 6,
    text: "What's your ideal weekend activity?",
    options: ["Outdoor adventures", "Cultural events", "Relaxing at home", "Social gatherings"]
  },
  {
    id: 7,
    text: "Which best describes your social preferences?",
    options: ["Large groups", "Small gatherings", "One-on-one", "Solo time"]
  }
];

export default function Profile() {
  const { user, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateSummary(newAnswers);
    }
  };

  const generateSummary = (finalAnswers: string[]) => {
    setIsGeneratingSummary(true);
    // Simulate AI processing
    setTimeout(() => {
      const summaryText = `Based on your responses, you're a ${finalAnswers[0].toLowerCase()} who finds peace through ${finalAnswers[1].toLowerCase()}. You excel at learning through ${finalAnswers[2].toLowerCase()} and express creativity through ${finalAnswers[3].toLowerCase()}. When stressed, you prefer ${finalAnswers[4].toLowerCase()}, and your ideal weekend involves ${finalAnswers[5].toLowerCase()}. In social settings, you thrive in ${finalAnswers[6].toLowerCase()}, making you a unique individual with a well-rounded approach to life and personal growth.`;
      setSummary(summaryText);
      setIsGeneratingSummary(false);
    }, 1500);
  };

  const resetQuestions = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSummary('');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-pink-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5 text-fuchsia-600" />
                  {user.email}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-fuchsia-600" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="mt-8 border-t pt-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white rounded-lg hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Profile Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Security */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-fuchsia-600" />
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            
            {!isChangingPassword ? (
              <div className="space-y-4">
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-fuchsia-50 transition-colors"
                >
                  <span className="text-gray-700">Change Password</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError('');
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white rounded-lg hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* AI Personality Insights */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-6 w-6 text-fuchsia-600" />
              <h2 className="text-xl font-semibold">AI Personality Insights</h2>
            </div>
            
            {!summary && answers.length < questions.length && (
              <div className="space-y-6">
                <div className="p-6 bg-fuchsia-50 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {questions[currentQuestion].text}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentQuestion].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-fuchsia-100 transition-colors border border-fuchsia-200"
                      >
                        <span>{option}</span>
                        <ArrowRight className="h-4 w-4 text-fuchsia-600" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>
            )}

            {isGeneratingSummary && (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-12 h-12 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Generating your personality insights...</p>
              </div>
            )}

            {summary && (
              <div className="space-y-6">
                <div className="p-6 bg-fuchsia-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </div>
                <button
                  onClick={resetQuestions}
                  className="w-full px-4 py-2 bg-white border border-fuchsia-200 rounded-lg text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
                >
                  Retake Questions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}