import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { HfInference } from "@huggingface/inference";

const client = new HfInference("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");

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotWindow({ isOpen, onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: "You are a supportive mental health chatbot. Keep your responses brief, focused, and under 100 words. Provide clear, actionable support while maintaining empathy."
    },
    {
      role: 'assistant',
      content: "Hey! 👋 What's up? I'm here if you want to chat about anything!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add effect to focus input when loading state changes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const chatCompletion = await client.chatCompletion({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { 
            role: 'user', 
            content: userMessage + "\n\nRemember to keep your response short, supportive, and focused on mental health support. Use appropriate emojis and structure your response in brief points. Do not include crisis numbers, support hotlines, or use asterisks (*) in formatting."          }
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 0.9
      });

      const assistantMessage = chatCompletion.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-36 right-12 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up z-50">
      <div className="absolute -inset-[2px] bg-gradient-to-r from-fuchsia-600/30 via-pink-500/30 to-fuchsia-600/30 rounded-2xl blur-lg opacity-75 animate-glow-pulse"></div>
      
      <div className="relative flex flex-col h-full bg-white rounded-2xl overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <h3 className="font-semibold">Mental Health Support</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.filter(msg => msg.role !== 'system').map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white ml-4'
                    : 'bg-gray-100 text-gray-800 mr-4'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-fuchsia-600" />
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}