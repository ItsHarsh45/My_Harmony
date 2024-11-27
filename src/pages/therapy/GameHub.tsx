import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad, Brain, Heart, Sparkles, Apple } from 'lucide-react';

const games = [
  {
    id: 'memory-match',
    title: 'Emotion Memory Match',
    description: 'Match emotions and learn to recognize different feelings',
    icon: Heart,
    color: 'pink',
    benefits: ['Emotional awareness', 'Memory improvement', 'Pattern recognition']
  },
  {
    id: 'snack-attack',
    title: 'Snack Attack',
    description: 'Guide your snake to collect healthy snacks and positive vibes',
    icon: Apple,
    color: 'green',
    benefits: ['Focus', 'Quick thinking', 'Stress relief']
  }
];

export default function GameHub() {
  const navigate = useNavigate();

  const handleGameClick = (gameId) => {
    navigate(`/therapy/games/${gameId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Gamepad className="h-12 w-12 text-red-600" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
            Mental Wellness Games
          </h1>
        </div>
        <p className="text-xl text-gray-600">Have fun while boosting your mental well-being! 🎮✨</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.id)}
              className={`bg-${game.color}-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-${game.color}-100`}>
                  <Icon className={`h-8 w-8 text-${game.color}-600`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {game.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className={`text-sm px-3 py-1 rounded-full bg-${game.color}-100 text-${game.color}-700`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}