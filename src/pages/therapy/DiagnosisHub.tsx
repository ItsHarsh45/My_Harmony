import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, ArrowLeft } from 'lucide-react';

export default function DiagnosisHub() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'diagnosis' | 'suggestions' | null>(null);

  const options = [
    {
      id: 'diagnosis',
      icon: Brain,
      title: 'Take Diagnosis Test',
      description: 'Complete a comprehensive mental health assessment',
      gradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
      path: '/therapy/diagnosis/diagnosis'
    },
    {
      id: 'suggestions',
      icon: Sparkles,
      title: 'Quick Suggestions',
      description: 'Get instant activities and coping strategies',
      gradient: 'from-purple-50 to-fuchsia-50',
      iconColor: 'text-purple-600',
      path: '/therapy/diagnosis/suggestions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/therapy')}
          className="mb-8 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Therapeutic Activities
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Diagnosis & Suggestions
            </h1>
            <p className="text-gray-600 mb-8">
              Choose between taking a comprehensive assessment or getting quick suggestions for emotional well-being
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => navigate(option.path)}
                    className={`p-6 text-left rounded-xl bg-gradient-to-br ${option.gradient}
                      border-2 border-transparent hover:border-current transition-all duration-300
                      hover:shadow-lg transform hover:-translate-y-1 group`}
                  >
                    <Icon className={`h-10 w-10 ${option.iconColor} mb-4 group-hover:scale-110 transition-transform`} />
                    <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}