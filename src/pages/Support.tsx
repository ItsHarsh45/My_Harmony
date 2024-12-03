import React, { useState } from 'react';
import { Shield, Heart, Calendar, MessageSquare, Sparkles, Clock, Users, Brain, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SafetyNotice() {
  return (
    <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 p-8 rounded-2xl text-white mb-16">
      <div className="flex items-center gap-4 mb-6">
        <Shield className="h-12 w-12" />
        <h2 className="text-2xl font-semibold">Safety Notice</h2>
      </div>
      <p className="text-lg opacity-90">
        If you or someone you know is in immediate danger, please call emergency services (112) immediately. 
        Your safety is our top priority.
      </p>
    </div>
  );
}

function CrisisSupport() {
  return (
    <div className="bg-white p-8 rounded-2xl mb-16">
      <div className="max-w-3xl mx-auto">
        <Heart className="h-12 w-12 text-purple-600 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Crisis Support</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">24/7 Helplines</h3>
            <p className="text-gray-600">National Suicide Prevention Lifeline:</p>
            <p className="text-2xl font-bold text-purple-600">1-800-273-8255</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Text Support</h3>
            <p className="text-gray-600">Crisis Text Line:</p>
            <p className="text-2xl font-bold text-purple-600">Text HOME to 741741</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotSupport({ onOpenChat }) {
  return (
    <div className="fixed bottom-8 right-12 z-40">
      <div className="relative group">
        <div className="absolute -inset-[2px] bg-gradient-to-r from-fuchsia-600/50 via-pink-500/50 to-fuchsia-600/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-all duration-300 hover:animate-pulse"></div>
        <div 
          onClick={onOpenChat}
          className="relative bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <div className="relative">
            <MessageSquare className="h-10 w-10 text-gray-700" />
            <Sparkles className="h-4 w-4 text-fuchsia-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-sm text-gray-500">Get instant support 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ icon: Icon, title, description, duration, color }) {
  return (
    <div className={`p-6 bg-gradient-to-br ${color} rounded-xl text-white hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-6 w-6" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-white/90 mb-4">{description}</p>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <p className="font-semibold">{duration}</p>
      </div>
    </div>
  );
}

function SessionBooking() {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/support/book-appointment');
  };

  const sessionTypes = [
    {
      icon: Brain,
      title: "Individual Therapy",
      description: "One-on-one counseling tailored to your needs",
      duration: "45 minutes",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Family Therapy",
      description: "Sessions involving family members",
      duration: "60 minutes",
      color: "from-fuchsia-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Group Therapy",
      description: "Supportive group sessions with peers",
      duration: "90 minutes",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: BookOpen,
      title: "Skills Training",
      description: "Learn practical coping strategies",
      duration: "50 minutes",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  return (
    <div className="bg-white p-8 rounded-2xl mb-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Calendar className="h-16 w-16 text-fuchsia-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Book a Support Session</h2>
          <p className="text-gray-600 mb-8">
            Choose from our range of support sessions designed to help you on your mental wellness journey
          </p>
        </div>

        <div className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionTypes.map((session, index) => (
              <SessionCard key={index} {...session} />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={handleBooking}
            className="group bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Schedule Session
              <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-fuchsia-100">
      <div className="w-full">
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 pb-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
                Support Resources
              </h1>
              <p className="text-xl text-gray-600">Comprehensive support and resources for your mental wellness journey</p>
            </div>
            <SafetyNotice />
            <CrisisSupport />
            <SessionBooking />
            <ChatbotSupport onOpenChat={() => setIsChatOpen(true)} />
            {isChatOpen && <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
          </div>
        </div>
      </div>
    </div>
  );
}