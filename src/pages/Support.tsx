import React from 'react';
import { Shield, Heart, Calendar } from 'lucide-react';

function SafetyNotice() {
  return (
    <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 p-8 rounded-2xl shadow-lg text-white mb-16">
      <div className="flex items-center gap-4 mb-6">
        <Shield className="h-12 w-12" />
        <h2 className="text-2xl font-semibold">Safety Notice</h2>
      </div>
      <p className="text-lg opacity-90">
        If you or someone you know is in immediate danger, please call emergency services (911) immediately. 
        Your safety is our top priority.
      </p>
    </div>
  );
}

function CrisisSupport() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
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

function TherapistBooking() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-16">
      <div className="max-w-3xl mx-auto text-center">
        <Calendar className="h-16 w-16 text-fuchsia-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Book a Session with a Therapist</h2>
        <p className="text-gray-600 mb-8">
          Connect with licensed professionals who specialize in teen mental health and well-being.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-fuchsia-50 rounded-xl">
            <h3 className="font-semibold mb-2">Individual Session</h3>
            <p className="text-gray-600 mb-4">One-on-one therapy</p>
            <p className="text-fuchsia-600 font-semibold">45 minutes</p>
          </div>
          <div className="p-6 bg-fuchsia-50 rounded-xl">
            <h3 className="font-semibold mb-2">Group Session</h3>
            <p className="text-gray-600 mb-4">Peer support group</p>
            <p className="text-fuchsia-600 font-semibold">60 minutes</p>
          </div>
          <div className="p-6 bg-fuchsia-50 rounded-xl">
            <h3 className="font-semibold mb-2">Family Session</h3>
            <p className="text-gray-600 mb-4">Family therapy</p>
            <p className="text-fuchsia-600 font-semibold">60 minutes</p>
          </div>
        </div>
        <button className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-fuchsia-700 hover:to-pink-700 transition">
          Schedule Appointment
        </button>
      </div>
    </div>
  );
}

export default function Support() {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-white to-fuchsia-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-transparent bg-clip-text">
            Support Resources
          </h1>
          <p className="text-xl text-gray-600">Comprehensive support and resources for your mental wellness journey</p>
        </div>

        <SafetyNotice />
        <CrisisSupport />
        <TherapistBooking />
      </div>
    </div>
  );
}