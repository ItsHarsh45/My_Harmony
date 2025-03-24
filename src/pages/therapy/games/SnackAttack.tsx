import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Apple, ArrowLeft, Heart, ArrowUp, ArrowDown, ArrowRight, ArrowLeftIcon, Pause, Play } from 'lucide-react';

// Game constants
const GRID_SIZE = 20;
const MIN_SPEED = 80; // Minimum speed limit

// Dynamic sizing based on screen width
const getCellSize = () => {
  // Responsive cell size calculation
  if (typeof window !== 'undefined') {
    const screenWidth = window.innerWidth;
    if (screenWidth < 400) return 14; // Small phones
    if (screenWidth < 640) return 16; // Medium phones
    if (screenWidth < 768) return 20; // Large phones
    return 25; // Desktop and tablets
  }
  return 25; // Default fallback
};

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
  const [speed, setSpeed] = useState(200); // Initial speed
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState('');
  const [messagePosition, setMessagePosition] = useState<'left' | 'right'>('left');
  const [cellSize, setCellSize] = useState(getCellSize());
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  // Update cell size on window resize
  useEffect(() => {
    const handleResize = () => {
      setCellSize(getCellSize());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
            setSpeed(200); // Initial speed
          } else if (newScore <= 100) {
            setSpeed(Math.max(175, MIN_SPEED));
          } else if (newScore <= 150) {
            setSpeed(Math.max(160, MIN_SPEED));
          } else if (newScore <= 200) {
            setSpeed(Math.max(140, MIN_SPEED));
          } else if (newScore <= 250) {
            setSpeed(Math.max(120, MIN_SPEED));
          } else if (newScore <= 300) {
            setSpeed(Math.max(100, MIN_SPEED));
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

  // Handle touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 0) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Determine swipe direction based on which axis had the larger movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 30) {
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
      } else if (deltaX < -30) {
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
      }
    } else {
      // Vertical swipe
      if (deltaY > 30) {
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
      } else if (deltaY < -30) {
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
      }
    }
  };

  // Handle keyboard controls
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

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
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
    setSpeed(200);
    setPaused(false);
    generateFood();
    if (gameRef.current) {
      gameRef.current.focus();
    }
  };

  // Handle direction change via on-screen controls
  const handleDirectionChange = (newDirection: Direction) => {
    switch (newDirection) {
      case 'UP':
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
        break;
      case 'DOWN':
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
        break;
      case 'LEFT':
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
        break;
      case 'RIGHT':
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 relative">
      <div className="text-center mb-4 md:mb-8">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
          <Apple className="h-6 w-6 md:h-10 md:w-10 text-green-600" />
          <h1 className="text-2xl md:text-3xl font-bold">Snack Attack</h1>
        </div>
        <p className="text-sm md:text-base text-gray-600">Collect healthy snacks and positive vibes! 🍎✨</p>
      </div>

      <div 
        ref={gameRef}
        tabIndex={0}
        className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-8 outline-none relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
            <span className="text-lg md:text-xl font-bold">{score}</span>
          </div>
          <button
            onClick={() => setPaused(p => !p)}
            className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
            aria-label={paused ? "Resume game" : "Pause game"}
          >
            {paused ? (
              <>
                <Play className="h-4 w-4" /> 
                <span className="hidden sm:inline">Resume</span>
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" /> 
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div 
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              messagePosition === 'left' 
                ? '-left-16 md:-left-20 text-right' 
                : '-right-16 md:-right-20 text-left'
            } text-base md:text-lg font-bold text-green-600 animate-bounce`}
          >
            {message}
          </div>
        )}

        <div 
          className="relative mx-auto border-2 border-gray-200 rounded-lg overflow-hidden"
          style={{ 
            width: GRID_SIZE * cellSize,
            height: GRID_SIZE * cellSize,
            backgroundColor: '#f8fafc'
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute bg-green-500 rounded-sm"
              style={{
                width: cellSize - 2,
                height: cellSize - 2,
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                transition: 'all 0.1s'
              }}
            />
          ))}
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: cellSize,
              height: cellSize,
              left: food.x * cellSize,
              top: food.y * cellSize,
              fontSize: cellSize > 20 ? '1.125rem' : '0.875rem'
            }}
          >
            {food.type}
          </div>
        </div>

        {gameOver && (
          <div className="text-center mt-6 md:mt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Game Over! 🎮</h2>
            <p className="text-gray-700 mb-4 md:mb-6">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-5 py-2 md:px-6 md:py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Mobile touch controls */}
        <div className="mt-6 md:hidden grid grid-cols-3 gap-2 max-w-xs mx-auto">
          <div className="col-start-2">
            <button 
              onClick={() => handleDirectionChange('UP')}
              className="w-full h-14 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
              aria-label="Move up"
            >
              <ArrowUp className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button 
              onClick={() => handleDirectionChange('LEFT')}
              className="w-full h-14 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
              aria-label="Move left"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <div className="col-start-2 row-start-2">
            <button 
              onClick={() => setPaused(p => !p)}
              className={`w-full h-14 flex items-center justify-center rounded-lg active:bg-gray-200 ${paused ? 'bg-green-100' : 'bg-gray-100'}`}
              aria-label={paused ? "Resume game" : "Pause game"}
            >
              {paused ? (
                <Play className="h-6 w-6 text-green-700" />
              ) : (
                <Pause className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
          <div className="col-start-3 row-start-2">
            <button 
              onClick={() => handleDirectionChange('RIGHT')}
              className="w-full h-14 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
              aria-label="Move right"
            >
              <ArrowRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button 
              onClick={() => handleDirectionChange('DOWN')}
              className="w-full h-14 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
              aria-label="Move down"
            >
              <ArrowDown className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
          <span className="hidden md:inline">Use arrow keys to move • Space to pause</span>
          <span className="md:hidden">Swipe or use controls to move</span> • Collect healthy snacks and positive words!
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/therapy/GameHub')}
          className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          Back to Games
        </button>
      </div>
    </div>
  );
}
