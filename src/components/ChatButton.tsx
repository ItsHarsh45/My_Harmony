import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatButton() {
  return (
    <button 
      className="fixed bottom-6 right-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
      onClick={() => window.open('/chat', '_self')}
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}