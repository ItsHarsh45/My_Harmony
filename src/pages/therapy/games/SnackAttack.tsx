import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, ArrowLeft, Heart } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SPEED = 200;
const MIN_SPEED = 80; // Minimum speed limit

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const healthySnacks = ['🥑', '🥝', '🍎', '🥦', '🥕', '🫐'];
const positiveWords = ['Joy', 'Peace', 'Calm', 'Focus', 'Happy', 'Strong'];

export default function SnackAttack() {
  const navigate = useNavigate();
  const gameRef = useRef<HTMLDivElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position & { type: string }>({ x: 5, y: 5, type: '🥑' });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState('');
  const [messagePosition, setMessagePosition] = useState<'left' | 'right'>('left');

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      type: Math.random() > 0.3 
        ? healthySnacks[Math.floor(Math.random() * healthySnacks.length)]
        : positiveWords[Math.floor(Math.random() * positiveWords.length)]
    };
    setFood(newFood);
  }, []);

  const checkCollision = (head: Position) => {
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE
    ) {
      return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = useCallback(() => {
    if (gameOver || paused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      
      if (head.x === food.x && head.y === food.y) {
        const pointValue = typeof food.type === 'string' && food.type.length > 2 ? 15 : 10;
        setScore(prevScore => {
          const newScore = prevScore + pointValue;
          
          // Adjust speed based on score, but with a minimum limit
          if (newScore <= 50) {
            setSpeed(INITIAL_SPEED);
          } else if (newScore <= 100) {
            setSpeed(Math.max(INITIAL_SPEED - 25, MIN_SPEED));
          } else if (newScore <= 150) {
            setSpeed(Math.max(INITIAL_SPEED - 40, MIN_SPEED));
          } else if (newScore <= 200) {
            setSpeed(Math.max(INITIAL_SPEED - 60, MIN_SPEED));
          } else if (newScore <= 250) {
            setSpeed(Math.max(INITIAL_SPEED - 70, MIN_SPEED));
          } else if (newScore <= 250) {
            setSpeed(Math.max(INITIAL_SPEED - 90, MIN_SPEED));
          } else {
            setSpeed(MIN_SPEED); // Maximum speed reached
          }
          
          return newScore;
        });

        setMessage(typeof food.type === 'string' && food.type.length > 2 ? food.type : 'Yummy!');
        setMessagePosition(prev => prev === 'left' ? 'right' : 'left');
        setTimeout(() => setMessage(''), 1000);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, paused, generateFood]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault(); // Prevent scrolling
      switch (e.key) {
        case 'ArrowUp':
          setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
          setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
          setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
          setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
          break;
        case ' ':
          setPaused(p => !p);
          break;
      }
    };

    if (gameRef.current) {
      gameRef.current.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, []);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setPaused(false);
    generateFood();
    if (gameRef.current) {
      gameRef.current.focus();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 relative">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Apple className="h-10 w-10 text-green-600" />
          <h1 className="text-3xl font-bold">Snack Attack</h1>
        </div>
        <p className="text-gray-600">Collect healthy snacks and positive vibes! 🍎✨</p>
      </div>

      <div 
        ref={gameRef}
        tabIndex={0}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 outline-none relative"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">{score}</span>
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>

        {message && (
          <div 
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              messagePosition === 'left' 
                ? '-left-20 text-right' 
                : '-right-20 text-left'
            } text-lg font-bold text-green-600 animate-bounce`}
          >
            {message}
          </div>
        )}

        <div 
          className="relative mx-auto border-2 border-gray-200 rounded-lg overflow-hidden"
          style={{ 
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            backgroundColor: '#f8fafc'
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-green-500 rounded-sm"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                transition: 'all 0.1s'
              }}
            />
          ))}
          <div
            className="absolute flex items-center justify-center text-lg"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE
            }}
          >
            {food.type}
          </div>
        </div>

        {gameOver && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold mb-4">Game Over! 🎮</h2>
            <p className="text-gray-700 mb-6">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Use arrow keys to move • Space to pause • Collect healthy snacks and positive words!
        </div>
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