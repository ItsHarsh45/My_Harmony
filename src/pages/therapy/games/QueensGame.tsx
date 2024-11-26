import React, { useState, useEffect } from 'react';
import { Crown, Shield, Heart, Target, Star } from 'lucide-react';

const QueensGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [mood, setMood] = useState(50);
  const [resources, setResources] = useState({
    wisdom: 0,
    courage: 0,
    compassion: 0
  });
  const [gameOver, setGameOver] = useState(false);

  const gameLevels = [
    {
      title: "The Royal Ascension",
      description: "You are a young queen preparing to take the throne. Your first challenge awaits.",
      choices: [
        {
          text: "Listen to Your Advisors",
          effect: { wisdom: 1, mood: 5 },
          consequence: "You gain valuable insights into governing."
        },
        {
          text: "Trust Your Instincts",
          effect: { courage: 1, mood: -5 },
          consequence: "Your bold decision creates tension, but shows leadership."
        }
      ]
    },
    {
      title: "Kingdom in Conflict",
      description: "A neighboring kingdom threatens war. How will you respond?",
      choices: [
        {
          text: "Diplomatic Negotiation",
          effect: { wisdom: 2, compassion: 1 },
          consequence: "Peace is maintained through careful dialogue."
        },
        {
          text: "Prepare for Battle",
          effect: { courage: 2, mood: -10 },
          consequence: "Military preparations create anxiety, but show strength."
        }
      ]
    },
    {
      title: "Royal Dilemma",
      description: "A famine strikes your kingdom. Resources are limited.",
      choices: [
        {
          text: "Distribute Equally",
          effect: { compassion: 2, wisdom: 1 },
          consequence: "Your people feel supported and united."
        },
        {
          text: "Prioritize Key Regions",
          effect: { wisdom: 1, mood: -5 },
          consequence: "Practical but controversial decision."
        }
      ]
    },
    {
      title: "Unrest in the Realm",
      description: "Peasant uprisings threaten the stability of your kingdom.",
      choices: [
        {
          text: "Hear Their Grievances",
          effect: { wisdom: 2, compassion: 2 },
          consequence: "You gain insight into their struggles and find a peaceful solution."
        },
        {
          text: "Crush the Rebellion",
          effect: { courage: 2, mood: -15 },
          consequence: "Your decisive action quells the unrest, but at a heavy cost."
        }
      ]
    },
    {
      title: "Foreign Alliances",
      description: "A powerful kingdom offers an alliance, but at a price.",
      choices: [
        {
          text: "Accept Their Terms",
          effect: { wisdom: 1, courage: 1 },
          consequence: "The alliance brings stability, but comes with compromises."
        },
        {
          text: "Reject the Offer",
          effect: { compassion: 2, mood: -10 },
          consequence: "Your people applaud your refusal to submit, but the kingdom's future remains uncertain."
        }
      ]
    },
    {
      title: "Plague in the Kingdom",
      description: "A deadly plague sweeps through your lands. Lives are at stake.",
      choices: [
        {
          text: "Prioritize the Vulnerable",
          effect: { compassion: 3, mood: 5 },
          consequence: "Your compassionate response earns the love of your people."
        },
        {
          text: "Quarantine the Infected",
          effect: { wisdom: 2, mood: -10 },
          consequence: "Your pragmatic decision saves many, but is met with criticism."
        }
      ]
    },
    {
      title: "Royal Wedding",
      description: "A neighboring kingdom seeks to strengthen ties through a marriage alliance.",
      choices: [
        {
          text: "Accept the Proposal",
          effect: { wisdom: 2, courage: 1 },
          consequence: "The alliance brings stability, but the marriage may be a reluctant one."
        },
        {
          text: "Decline the Offer",
          effect: { compassion: 2, mood: -15 },
          consequence: "Your people admire your refusal to be bound by tradition, but the kingdom's future remains uncertain."
        }
      ]
    },
    {
      title: "Succession Crisis",
      description: "Your heir is not yet ready to rule. Factions within the court vie for power.",
      choices: [
        {
          text: "Appoint a Regent",
          effect: { wisdom: 3, mood: -5 },
          consequence: "Your decisive action maintains stability, but not without some dissent."
        },
        {
          text: "Delay the Transition",
          effect: { courage: 3, mood: 10 },
          consequence: "Your people appreciate your caution, but the kingdom's future remains in limbo."
        }
      ]
    },
    {
      title: "Natural Disaster",
      description: "A devastating storm ravages your kingdom, leaving destruction in its wake.",
      choices: [
        {
          text: "Mobilize Relief Efforts",
          effect: { compassion: 3, wisdom: 2 },
          consequence: "Your quick response and compassion for your people earns their loyalty."
        },
        {
          text: "Redirect Resources",
          effect: { courage: 3, mood: -15 },
          consequence: "Your pragmatic decision saves lives, but is met with criticism from those affected."
        }
      ]
    },
    {
      title: "Invasion of the North",
      description: "A powerful northern kingdom launches an invasion, threatening to conquer your lands.",
      choices: [
        {
          text: "Form Strategic Alliances",
          effect: { wisdom: 3, courage: 2 },
          consequence: "Your diplomatic skills forge powerful allies, strengthening your defense."
        },
        {
          text: "Rally the Army",
          effect: { courage: 4, mood: -20 },
          consequence: "Your bold leadership inspires your troops, but the cost of war weighs heavily on the kingdom."
        }
      ]
    },
    {
      title: "The Final Challenge",
      description: "The fate of your kingdom rests on your final decision. Will you rise to the occasion?",
      choices: [
        {
          text: "Embrace Your Destiny",
          effect: { wisdom: 4, courage: 4, compassion: 4 },
          consequence: "Your wise, courageous, and compassionate rule ushers in a new era of prosperity for your kingdom."
        },
        {
          text: "Abdicate the Throne",
          effect: { mood: -30 },
          consequence: "Your decision to step down leaves your people uncertain about the kingdom's future."
        }
      ]
    }
  ];

  useEffect(() => {
    if (mood <= 0 || mood >= 100 || currentLevel === gameLevels.length - 1) {
      setGameOver(true);
    }
  }, [mood, currentLevel]);

  const handleChoice = (choiceIndex) => {
    const currentLevelChoices = gameLevels[currentLevel].choices[choiceIndex];

    setResources(prev => ({
      wisdom: prev.wisdom + (currentLevelChoices.effect.wisdom || 0),
      courage: prev.courage + (currentLevelChoices.effect.courage || 0),
      compassion: prev.compassion + (currentLevelChoices.effect.compassion || 0)
    }));

    setMood(prev => {
      const newMood = prev + (currentLevelChoices.effect.mood || 0);
      return Math.max(0, Math.min(100, newMood));
    });

    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className="bg-purple-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-xl">
          <Crown className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Royal Journey Complete</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded-xl">
              <Star className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <p className="font-bold">Wisdom: {resources.wisdom}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <Shield className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <p className="font-bold">Courage: {resources.courage}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <Heart className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <p className="font-bold">Compassion: {resources.compassion}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setCurrentLevel(0);
              setMood(50);
              setResources({ wisdom: 0, courage: 0, compassion: 0 });
              setGameOver(false);
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
          >
            Begin New Royal Journey
          </button>
        </div>
      </div>
    );
  }

  const currentGameLevel = gameLevels[currentLevel];

  return (
    <div className="bg-purple-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-purple-800">Royal Mood</span>
            <span className={`font-bold ${mood < 30 ? 'text-red-500' : mood < 70 ? 'text-yellow-500' : 'text-green-500'}`}>
              {mood}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 rounded-full transition-all duration-300" 
              style={{
                width: `${mood}%`,
                backgroundColor: mood < 30 ? '#EF4444' : mood < 70 ? '#FBBF24' : '#10B981'
              }}
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <Crown className="mx-auto h-16 w-16 text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-purple-800 mb-4">{currentGameLevel.title}</h2>
          <p className="text-gray-600 mb-6">{currentGameLevel.description}</p>
        </div>

        <div className="space-y-4">
          {currentGameLevel.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(index)}
              className="w-full bg-purple-100 text-purple-800 p-4 rounded-xl hover:bg-purple-200 transition text-left flex items-center justify-between"
            >
              <span>{choice.text}</span>
              <Target className="h-6 w-6 text-purple-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueensGame;