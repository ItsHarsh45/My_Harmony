import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, User, Heart, Sparkles, BookOpen, Plus, X, ArrowRight, CheckCircle2, AlertTriangle, Shield, RefreshCcw, Clock } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useAssessmentStore } from '../stores/useAssessmentStore';
import { saveAssessment } from '../services/assessmentService';
import { generatePersonalityInsights } from '../services/personalityService';

// Assessment Questions
const questions = [
  {
    id: 1,
    question: "How would you rate your overall mood in the past week?",
    options: [
      { value: 1, label: "Very low" },
      { value: 2, label: "Low" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Good" },
      { value: 5, label: "Excellent" }
    ]
  },
  {
    id: 2,
    question: "How often do you feel overwhelmed by your thoughts or emotions?",
    options: [
      { value: 5, label: "Rarely or never" },
      { value: 4, label: "Once in a while" },
      { value: 3, label: "Sometimes" },
      { value: 2, label: "Often" },
      { value: 1, label: "Almost always" }
    ]
  },
  {
    id: 3,
    question: "How well have you been sleeping lately?",
    options: [
      { value: 1, label: "Very poorly" },
      { value: 2, label: "Poorly" },
      { value: 3, label: "Moderately" },
      { value: 4, label: "Well" },
      { value: 5, label: "Very well" }
    ]
  },
  {
    id: 4,
    question: "How would you describe your social connections and support system?",
    options: [
      { value: 1, label: "Very isolated" },
      { value: 2, label: "Limited connections" },
      { value: 3, label: "Some connections" },
      { value: 4, label: "Good support system" },
      { value: 5, label: "Strong support network" }
    ]
  },
  {
    id: 5,
    question: "How often do you engage in activities you enjoy?",
    options: [
      { value: 1, label: "Rarely or never" },
      { value: 2, label: "Once in a while" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
      { value: 5, label: "Very often" }
    ]
  },
  {
    id: 6,
    question: "How do you feel about your ability to handle stress?",
    options: [
      { value: 1, label: "Very poor" },
      { value: 2, label: "Poor" },
      { value: 3, label: "Moderate" },
      { value: 4, label: "Good" },
      { value: 5, label: "Excellent" }
    ]
  },
  {
    id: 7,
    question: "How often do you have thoughts that worry or trouble you?",
    options: [
      { value: 5, label: "Rarely or never" },
      { value: 4, label: "Once in a while" },
      { value: 3, label: "Sometimes" },
      { value: 2, label: "Often" },
      { value: 1, label: "Almost always" }
    ]
  },
  {
    id: 8,
    question: "What are your favorite hobbies and interests?",
    type: "hobbies",
    description: "Share up to 5 activities that bring you joy and help you relax."
  }
];

const getAssessmentLevel = (score: number) => {
  const maxScore = (questions.length - 1) * 5; // Exclude hobby question
  const percentage = (score / maxScore) * 100;

  if (percentage >= 70) {
    return {
      level: 'mild' as const,
      description: "Your responses suggest you're managing well overall. You appear to have good coping mechanisms and emotional resilience.",
      recommendations: [
        "Maintain your current healthy habits and self-care practices",
        "Keep engaging in hobbies and activities that bring you joy",
        "Continue checking in with your support network, including family and friends",
        "Stay proactive in managing stress with regular mindfulness or relaxation techniques",
        "Set personal growth goals and focus on areas that contribute to long-term well-being"
      ]
    };
  } else if (percentage >= 40) {
    return {
      level: 'moderate' as const,
      description: "Your responses indicate some challenges that might benefit from additional support and coping strategies.",
      recommendations: [
        "Consider regular sessions with a counselor or therapist to discuss your challenges",
        "Incorporate mindfulness, yoga, or journaling into your daily routine for stress relief",
        "Focus on improving your sleep habits for better mental clarity and emotional stability",
        "Explore new stress-management techniques like deep breathing or progressive muscle relaxation",
        "Seek guidance from a mental health professional to build a personalized coping strategy"
      ]
    };
  } else {
    return {
      level: 'significant' as const,
      description: "Your responses suggest you're experiencing significant challenges. It's important to know that help is available.",
      recommendations: [
        "Schedule an appointment with a licensed mental health professional to get personalized support",
        "Explore therapy options such as cognitive-behavioral therapy (CBT) or dialectical behavior therapy (DBT)",
        "Develop a comprehensive support plan with professionals that includes emergency contacts",
        "Practice daily self-care routines like regular physical activity and balanced nutrition to improve mental health",
        "Reach out to trusted family or friends regularly for emotional support"
      ]
    };
  }
};

// HobbiesInput Component
const HobbiesInput = ({ onHobbiesSubmit }) => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [currentHobby, setCurrentHobby] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleAddHobby = () => {
    if (currentHobby.trim() && hobbies.length < 5) {
      const newHobbies = [...hobbies, currentHobby.trim()];
      setHobbies(newHobbies);
      setCurrentHobby('');
      onHobbiesSubmit(newHobbies);
      inputRef.current?.focus();
    }
  };

  const handleRemoveHobby = (index: number) => {
    const newHobbies = hobbies.filter((_, i) => i !== index);
    setHobbies(newHobbies);
    onHobbiesSubmit(newHobbies);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="hobby" className="text-sm font-medium text-gray-700">
          Add Your Hobbies (up to 5)
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="hobby"
            type="text"
            value={currentHobby}
            onChange={(e) => setCurrentHobby(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
            placeholder="Enter a hobby"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            disabled={hobbies.length >= 5}
          />
          <button
            onClick={handleAddHobby}
            disabled={!currentHobby.trim() || hobbies.length >= 5}
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {hobbies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-fuchsia-50 text-fuchsia-700 rounded-full"
            >
              <span>{hobby}</span>
              <button
                onClick={() => handleRemoveHobby(index)}
                className="hover:text-fuchsia-900 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PersonalityInsights Component
const PersonalityInsights = ({ name, hobbies, traits, summary }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6 bg-white rounded-xl p-6 border border-fuchsia-100"
  >
    <div className="flex items-center gap-3">
      <User className="h-6 w-6 text-fuchsia-600" />
      <h3 className="text-xl font-semibold text-gray-900">Personality Profile</h3>
    </div>

    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium text-gray-700">Name:</span>
        <span className="text-lg text-gray-900">{name}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-600" />
          <span className="font-medium text-gray-700">Hobbies:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-fuchsia-600" />
          <span className="font-medium text-gray-700">Summary:</span>
        </div>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>
    </div>
  </motion.div>
);

// AssessmentForm Component
const AssessmentForm = ({ currentQuestion, onAnswer, saving, isHobbyQuestion }) => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const question = questions[currentQuestion];

  const handleHobbiesSubmit = (newHobbies: string[]) => {
    setHobbies(newHobbies);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <div className="flex-1 h-1 bg-gray-100 rounded-full">
          <motion.div 
            className="h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        {question.question}
      </h2>

      {isHobbyQuestion ? (
        <div className="space-y-6">
          <HobbiesInput onHobbiesSubmit={handleHobbiesSubmit} />
          <button
            onClick={() => onAnswer(hobbies, true)}
            disabled={hobbies.length === 0 || saving}
            className="w-full p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Complete Assessment
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {question.options?.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              disabled={saving}
              className="w-full p-4 text-left rounded-xl border-2 border-gray-100 hover:border-fuchsia-200 hover:bg-fuchsia-50 transition-all duration-300 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-gray-700 group-hover:text-fuchsia-700">
                {option.label}
              </span>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-fuchsia-600 group-hover:translate-x-1 transition-all duration-300" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

// AssessmentResults Component
const AssessmentResults = ({ score, onReset, lastAssessmentDate, personalityInsights, userName }) => {
  const results = getAssessmentLevel(score);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAttentionLevel = () => {
    if (results.level === 'mild') return 'Low';
    if (results.level === 'moderate') return 'Moderate';
    return 'High';
  };

  const getAttentionColor = () => {
    if (results.level === 'mild') return 'text-green-600 bg-green-50';
    if (results.level === 'moderate') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {lastAssessmentDate && (
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Last taken: {formatDate(lastAssessmentDate)}</span>
        </div>
      )}

      {personalityInsights && (
        <div className="mb-8">
          <PersonalityInsights {...personalityInsights} />
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {results.level === 'mild' && <CheckCircle2 className="h-8 w-8 text-green-600" />}
            {results.level === 'moderate' && <AlertTriangle className="h-8 w-8 text-yellow-600" />}
            {results.level === 'significant' && <Shield className="h-8 w-8 text-red-600" />}
            <h2 className="text-2xl font-bold text-gray-900">Assessment Results</h2>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getAttentionColor()}`}>
            {getAttentionLevel()} Attention Required
          </span>
        </div>

        <p className="text-lg text-gray-700">{results.description}</p>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations:</h3>
          <ul className="space-y-2">
            {results.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-gray-700"
              >
                <div className="h-2 w-2 rounded-full bg-fuchsia-600" />
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 transition-colors"
        >
          <RefreshCcw className="h-5 w-5" />
          Take Assessment Again
        </button>
      </div>
    </motion.div>
  );
};

// Main AboutMe Component
export default function AboutMe() {
  const { user } = useAuthStore();
  const { lastAssessment, setAssessment, clearAssessment } = useAssessmentStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(!!lastAssessment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = async (value: number | string[], isHobbies = false) => {
    if (isHobbies) {
      setHobbies(value as string[]);
      finishAssessment(answers, value as string[]);
    } else {
      const newAnswers = [...answers, value as number];
      if (currentQuestion < questions.length - 2) {
        setAnswers(newAnswers);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setAnswers(newAnswers);
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const finishAssessment = async (finalAnswers: number[], userHobbies: string[]) => {
    setSaving(true);
    setError(null);
    try {
      const totalScore = finalAnswers.reduce((sum, score) => sum + score, 0);
      const results = getAssessmentLevel(totalScore);
      
      const insights = await generatePersonalityInsights(
        finalAnswers, 
        user?.displayName || '',
        userHobbies
      );
      
      await saveAssessment(finalAnswers, userHobbies, totalScore, results.level, insights);
      setAssessment(totalScore, results.level, insights);
      setShowResults(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setHobbies([]);
    setShowResults(false);
    setError(null);
    clearAssessment();
  };

  const currentQuestionData = questions[currentQuestion];
  const isHobbyQuestion = currentQuestionData?.type === 'hobbies';

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-pink-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="bg-white rounded-3xl border-2 border-violet-100 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Brain className="h-8 w-8 text-fuchsia-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mental Health Assessment</h1>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 rounded-lg text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!showResults ? (
            <AssessmentForm
              currentQuestion={currentQuestion}
              onAnswer={handleAnswer}
              saving={saving}
              isHobbyQuestion={isHobbyQuestion}
            />
          ) : (
            <AssessmentResults
              score={lastAssessment?.score || answers.reduce((sum, score) => sum + score, 0)}
              onReset={resetAssessment}
              lastAssessmentDate={lastAssessment?.timestamp ? new Date(lastAssessment.timestamp) : undefined}
              personalityInsights={lastAssessment?.personalityInsights}
              userName={user?.displayName || ''}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}