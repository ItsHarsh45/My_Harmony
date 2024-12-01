import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Trophy } from 'lucide-react';

// Simplified emotions list with fewer pairs
const emotions = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Calm', emoji: '😌' },
  { name: 'Loved', emoji: '🥰' },
  { name: 'Proud', emoji: '😎' }
];

export default function MemoryMatch() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFirstGame, setIsFirstGame] = useState(true);

  useEffect(() => {
    initializeGame(true);
  }, []);

  const initializeGame = (isInitialStart: boolean = false) => {
    const duplicatedEmotions = [...emotions, ...emotions]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ ...item, id: index }));
    
    setCards(duplicatedEmotions);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    
    // Automatically show hint for first game or when explicitly starting a new game
    if (isInitialStart || !isFirstGame) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
    }
    
    // Mark that it's no longer the first game
    setIsFirstGame(false);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].name === cards[second].name) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setGameComplete(true);
        }
      } else {
        // Increased time to see the cards
        setTimeout(() => setFlipped([]), 1500);
      }
    }
  };

  const showAllCards = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-10 w-10 text-pink-600" />
          <h1 className="text-3xl font-bold">Emotion Memory Match</h1>
        </div>
        <p className="text-gray-600">Match the emotions to improve your emotional awareness!</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">Moves: {moves}</div>
          <div className="flex gap-2">
            <button
              onClick={showAllCards}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              Peek Cards
            </button>
            <button
              onClick={() => initializeGame()}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition"
            >
              New Game
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square flex items-center justify-center text-4xl rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                flipped.includes(index) || matched.includes(index) || showHint
                  ? 'bg-pink-100'
                  : 'bg-gray-100'
              }`}
            >
              {flipped.includes(index) || matched.includes(index) || showHint ? (
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-1">{card.emoji}</span>
                  <span className="text-sm font-medium text-pink-700">
                    {card.name}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">?</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {gameComplete && (
        <div className="text-center bg-green-100 p-6 rounded-xl mb-8">
          <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
          <p className="text-gray-700">
            You completed the game in {moves} moves!
          </p>
          <button
            onClick={() => initializeGame()}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            Play Again
          </button>
        </div>
      )}

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