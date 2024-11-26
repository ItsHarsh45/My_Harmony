import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Target } from 'lucide-react';

const positiveThoughts = [
  "I am capable",
  "I can handle this",
  "I'm getting stronger",
  "Progress takes time",
  "I choose joy",
  "I am enough",
  "I've got this",
  "Small steps count"
];

const negativeThoughts = [
  "I can't do this",
  "Everything's wrong",
  "I'm not good enough",
  "This is too hard",
  "I'll never improve",
  "Nobody likes me",
  "I always fail",
  "Things won't change"
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  speed: number;
  text: string;
  type: 'positive' | 'negative';
}

export default function ThoughtBubbles() {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
  };

  const createBubble = () => {
    if (!gameAreaRef.current) return;
    
    const isPositive = Math.random() > 0.5;
    const thoughts = isPositive ? positiveThoughts : negativeThoughts;
    const text = thoughts[Math.floor(Math.random() * thoughts.length)];
    
    const bubble: Bubble = {
      id: Date.now(),
      x: Math.random() * (gameAreaRef.current.clientWidth - 100),
      y: gameAreaRef.current.clientHeight,
      speed: 1 + Math.random() * 2,
      text,
      type: isPositive ? 'positive' : 'negative'
    };
    
    setBubbles(prev => [...prev, bubble]);
  };

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      setBubbles(prev => 
        prev.map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed
        })).filter(bubble => bubble.y > -100)
      );
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (gameActive) {
      requestRef.current = requestAnimationFrame(animate);
      const bubbleInterval = setInterval(createBubble, 2000);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            clearInterval(bubbleInterval);
            clearInterval(timer);
            if (requestRef.current) {
              cancelAnimationFrame(requestRef.current);
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(bubbleInterval);
        clearInterval(timer);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [gameActive]);

  const handleBubbleClick = (bubble: Bubble) => {
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    if (bubble.type === 'positive') {
      setScore(prev => prev + 10);
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-10 w-10 text-blue-600" />
          <h1 className="text-3xl font-bold">Thought Bubbles</h1>
        </div>
        <p className="text-gray-600">Pop negative thoughts, collect positive ones!</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="text-lg font-semibold">Time: {timeLeft}s</div>
        </div>

        {!gameActive ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              {timeLeft === 60 ? "Ready to Play?" : "Game Over!"}
            </h2>
            {timeLeft !== 60 && (
              <p className="text-xl mb-6">Final Score: {score}</p>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              {timeLeft === 60 ? "Start Game" : "Play Again"}
            </button>
          </div>
        ) : (
          <div
            ref={gameAreaRef}
            className="relative h-[400px] bg-gradient-to-b from-blue-50 to-white rounded-xl overflow-hidden"
          >
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className={`absolute cursor-pointer transition-transform hover:scale-110 ${
                  bubble.type === 'positive' ? 'bg-green-100' : 'bg-red-100'
                } rounded-full p-4 shadow-lg`}
                style={{
                  left: `${bubble.x}px`,
                  top: `${bubble.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleBubbleClick(bubble)}
              >
                <p className={`text-sm font-medium ${
                  bubble.type === 'positive' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {bubble.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/therapy/GameHub')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Games
        </button>
      </div>
    </div>
  );
}