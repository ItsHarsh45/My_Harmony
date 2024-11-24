import React, { useState } from 'react';
import { Shield, Heart, Calendar, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatbotWindow from '../pages/support/ChatbotWindow';

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

function TherapistBooking() {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/support/book-appointment');
  };

  return (
    <div className="bg-white p-8 rounded-2xl mb-16">
      <div className="max-w-3xl mx-auto text-center">
        <Calendar className="h-16 w-16 text-fuchsia-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Book a Session with a Therapist</h2>
        <p className="text-gray-600 mb-8">
          Connect with licensed professionals who specialize in teen mental health and well-being.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white">
            <h3 className="font-semibold mb-2">Individual Session</h3>
            <p className="text-white/90 mb-4">One-on-one therapy</p>
            <p className="font-semibold">40 minutes</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-xl text-white">
            <h3 className="font-semibold mb-2">Family Session</h3>
            <p className="text-white/90 mb-4">Family therapy</p>
            <p className="font-semibold">60 minutes</p>
          </div>
        </div>
        <button 
          onClick={handleBooking}
          className="group bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Schedule Appointment
            <Calendar className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
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
            <TherapistBooking />
            <ChatbotSupport onOpenChat={() => setIsChatOpen(true)} />
            <ChatbotWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}