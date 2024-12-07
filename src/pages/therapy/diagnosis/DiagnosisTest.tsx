import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Download, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Types
interface Question {
  id: string;
  text: string;
  weight: number;
}

interface Option {
  value: number;
  label: string;
  description: string;
  color: string;
  hoverColor: string;
}

type CategoryQuestions = Record<string, Question[]>;
type Answers = Record<string, number>;
type Scores = Record<string, number>;

// Constants
const diagnosisOptions: Option[] = [
  {
    value: 0,
    label: 'Not at all',
    description: 'I never or very rarely experience this',
    color: 'bg-green-50 text-green-700',
    hoverColor: 'hover:border-green-200'
  },
  {
    value: 1,
    label: 'Several days',
    description: 'I experience this occasionally (1-6 days)',
    color: 'bg-blue-50 text-blue-700',
    hoverColor: 'hover:border-blue-200'
  },
  {
    value: 2,
    label: 'More than half the days',
    description: 'I experience this frequently (7-11 days)',
    color: 'bg-yellow-50 text-yellow-700',
    hoverColor: 'hover:border-yellow-200'
  },
  {
    value: 3,
    label: 'Nearly every day',
    description: 'I experience this almost constantly (12-14 days)',
    color: 'bg-red-50 text-red-700',
    hoverColor: 'hover:border-red-200'
  }
];

const diagnosisQuestions: CategoryQuestions = {
  depression: [
    { id: 'd1', text: 'Over the past 2 weeks, how often have you felt sad, down, or hopeless?', weight: 2 },
    { id: 'd2', text: 'Have you lost interest or pleasure in activities you used to enjoy?', weight: 2 },
    { id: 'd3', text: 'Have you had trouble sleeping or sleeping too much?', weight: 1.5 },
    { id: 'd4', text: 'Do you feel worthless or excessively guilty?', weight: 2 },
    { id: 'd5', text: 'Have you had thoughts that you would be better off not alive?', weight: 2.5 }
  ],
  anxiety: [
    { id: 'a1', text: 'Do you worry excessively about different things (school, health, family)?', weight: 2 },
    { id: 'a2', text: 'Do you find it difficult to control your worrying?', weight: 2 },
    { id: 'a3', text: 'Do you feel restless, keyed up, or on edge?', weight: 1.5 },
    { id: 'a4', text: 'Do you get tired easily or have trouble concentrating?', weight: 1.5 },
    { id: 'a5', text: 'Do you experience panic attacks or sudden episodes of intense fear?', weight: 2 }
  ],
  ocd: [
    { id: 'o1', text: 'Do you have thoughts that keep bothering you that you can\'t get rid of?', weight: 2 },
    { id: 'o2', text: 'Do you feel you have to do certain things over and over again (like checking or counting)?', weight: 2 },
    { id: 'o3', text: 'Do these thoughts/actions interfere with your daily life?', weight: 2 },
    { id: 'o4', text: 'Do you spend more than 1 hour per day on these thoughts/actions?', weight: 1.5 },
    { id: 'o5', text: 'Do you try to resist these thoughts/actions but find it difficult?', weight: 1.5 }
  ],
  adhd: [
    { id: 'h1', text: 'Do you have trouble paying attention to details or make careless mistakes?', weight: 2 },
    { id: 'h2', text: 'Do you have difficulty staying focused during tasks or activities?', weight: 2 },
    { id: 'h3', text: 'Do you often fidget or have trouble sitting still?', weight: 1.5 },
    { id: 'h4', text: 'Do you frequently lose things necessary for tasks/activities?', weight: 1.5 },
    { id: 'h5', text: 'Are you easily distracted by things around you?', weight: 2 }
  ],
  socialAnxiety: [
    { id: 's1', text: 'Do you feel very anxious in social situations?', weight: 2 },
    { id: 's2', text: 'Do you avoid social situations because of fear or anxiety?', weight: 2 },
    { id: 's3', text: 'Do you worry about being embarrassed or humiliated in social situations?', weight: 1.5 },
    { id: 's4', text: 'Does your social anxiety interfere with your daily routine?', weight: 2 },
    { id: 's5', text: 'Do you feel extremely self-conscious around others?', weight: 1.5 }
  ]
};

// PDF Generator Function
const generatePDF = (scores: Scores, userNotes: string, answers: Answers) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Title and Header
  doc.setFontSize(20);
  doc.setTextColor(33, 97, 140);
  doc.text('Mental Health Assessment Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
  
  // Scores Section with more space
  doc.setFontSize(14);
  doc.setTextColor(33, 97, 140);
  doc.text('Assessment Scores', 20, 50);
  
  const scoresData = Object.entries(scores).map(([category, score]) => [
    category.replace(/([A-Z])/g, ' $1').trim(),
    `${Math.round(score)}%`
  ]);
  
  (doc as any).autoTable({
    startY: 60,
    head: [['Category', 'Score']],
    body: scoresData,
    theme: 'striped',
    headStyles: { fillColor: [33, 97, 140], textColor: 255 },
    columnStyles: { 
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'wrap', halign: 'right' }
    },
    margin: { top: 50, bottom: 20, left: 20, right: 20 }
  });

  // Detailed Answers Section
  let currentY = (doc as any).previousAutoTable.finalY + 20; // Start after the scores table

  Object.entries(diagnosisQuestions).forEach(([category, questions]) => {
    // Add page if needed
    if (currentY > pageHeight - 50) {
      doc.addPage();
      currentY = 50;
    }

    // Category Header
    doc.setFontSize(14);
    doc.setTextColor(33, 97, 140);
    doc.text(category.replace(/([A-Z])/g, ' $1').trim().toUpperCase(), 20, currentY);
    currentY += 10;

    // Questions and Answers
    questions.forEach((question) => {
      // Add page if needed
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 50;
      }

      // Question text
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      // Find the selected answer
      const selectedValue = answers[question.id];
      const selectedOption = diagnosisOptions.find(opt => opt.value === selectedValue);

      // Prepare full text for the PDF
      const questionText = `Q: ${question.text}`;
      const answerText = selectedOption 
        ? `A: ${selectedOption.label} - ${selectedOption.description}`
        : 'No answer selected';

      // Wrap text if it's too long
      const splitQuestion = doc.splitTextToSize(questionText, pageWidth - 40);
      const splitAnswer = doc.splitTextToSize(answerText, pageWidth - 40);

      doc.text(splitQuestion, 20, currentY);
      currentY += (splitQuestion.length * 5);
      
      doc.setTextColor(100);
      doc.text(splitAnswer, 20, currentY);
      currentY += (splitAnswer.length * 5) + 5;
    });

    // Add some space between categories
    currentY += 10;
  });

  // Recommendations
  const recommendedCategories = Object.entries(scores)
    .filter(([_, score]) => score > 50)
    .map(([category]) => category);

  if (recommendedCategories.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(33, 97, 140);
    doc.text('Recommendations', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    recommendedCategories.forEach((category, index) => {
      const text = `• Consider discussing ${category.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} symptoms with a mental health professional`;
      doc.text(text, 20, 40 + (index * 10));
    });
  }

  // User Notes
  if (userNotes.trim()) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(33, 97, 140);
    doc.text('Additional Notes', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(userNotes, 20, 30, { maxWidth: pageWidth - 40 });
  }

  // Disclaimer
  doc.addPage();
  doc.setFontSize(10);
  doc.setTextColor(150);
  const disclaimer = [
    'IMPORTANT DISCLAIMER:',
    'This assessment is for screening purposes only and does not constitute a professional diagnosis.',
    'Always consult with a qualified mental health professional for proper evaluation and diagnosis.',
    '',
    'For privacy concerns, we are not saving any personal data or responses provided during this assessment.'
  ];
  
  disclaimer.forEach((line, index) => {
    doc.text(line, pageWidth / 2, 100 + (index * 10), { align: 'center' });
  });

  doc.save('mental-health-assessment.pdf');
};

// Question Component
function QuestionCard({ question, selectedAnswer, onAnswer }: {
  question: Question;
  selectedAnswer?: number;
  onAnswer: (questionId: string, value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-gray-700 text-lg">{question.text}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {diagnosisOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className={`p-4 text-left rounded-lg border transition-all duration-300
              ${selectedAnswer === option.value 
                ? option.color + ' border-current shadow-sm' 
                : 'border-gray-200 ' + option.hoverColor}
              hover:shadow-md transform hover:-translate-y-0.5`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm opacity-90">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function DiagnosisTest() {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('depression');
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState<Scores>({});
  const [userNotes, setUserNotes] = useState('');

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = () => {
    const categoryScores: Scores = {};
    Object.entries(diagnosisQuestions).forEach(([category, categoryQuestions]) => {
      const totalPossible = categoryQuestions.reduce((sum, q) => sum + (q.weight * 3), 0);
      const score = categoryQuestions.reduce((sum, q) => {
        return sum + ((answers[q.id] || 0) * q.weight);
      }, 0);
      categoryScores[category] = (score / totalPossible) * 100;
    });
    setScores(categoryScores);
    setShowResults(true);
  };

  const handleNextCategory = () => {
    const categories = Object.keys(diagnosisQuestions);
    const currentIndex = categories.indexOf(currentCategory);
    if (currentIndex < categories.length - 1) {
      setCurrentCategory(categories[currentIndex + 1]);
    } else {
      calculateScores();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-red-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {!showResults ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold capitalize text-blue-700">
                {currentCategory.replace(/([A-Z])/g, ' $1').trim()} Assessment
              </h2>
              <p className="text-gray-600 mt-2">
                Please answer these questions based on your experiences over the past two weeks.
              </p>
            </div>
            
            <div className="space-y-8">
              {diagnosisQuestions[currentCategory].map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  selectedAnswer={answers[q.id]}
                  onAnswer={handleAnswer}
                />
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => navigate('/therapy')}
                className="flex items-center gap-2 px-6 py-2.5 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleNextCategory}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={diagnosisQuestions[currentCategory].some(q => answers[q.id] === undefined)}
              >
                {currentCategory === Object.keys(diagnosisQuestions).slice(-1)[0] ? 'View Results' : 'Next Section'}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Important Notice</p>
                <p>This assessment is for screening purposes only and does not constitute a professional diagnosis. 
                   Please consult a mental health professional for proper evaluation and diagnosis.</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Assessment Results</h2>
              <div className="space-y-4">
                {Object.entries(scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="capitalize text-gray-700">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium text-sm">{Math.round(score)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getScoreColor(score)} transition-all duration-1000 ease-out`}
                          style={{width: `${score}%`}}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes, symptoms, or concerns here..."
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {Object.entries(scores)
                  .filter(([, score]) => score > 50)
                  .map(([category]) => (
                    <li key={category} className="flex items-start gap-2">
                      <span className="block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                      <span>Consider discussing {category.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} symptoms with a mental health professional</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => navigate('/therapy')}
                className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Therapy
              </button>
              <button
                onClick={() => generatePDF(scores, userNotes, answers)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Report (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}