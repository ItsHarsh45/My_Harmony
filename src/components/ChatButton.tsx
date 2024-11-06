import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatButton() {
  return (
    <button 
      className="fixed bottom-8 right-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      onClick={() => {/* Add chat functionality */}}
    >
      <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
    </button>
  );
}