interface PersonalityInsight {
  name: string;
  hobbies: string[];
  traits: string[];
  summary: string;
  score: number;
}

export const generatePersonalityInsights = (
  answers: number[], 
  userName: string, 
  userHobbies: string[]
): PersonalityInsight => {
  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
  
  if (totalScore < 15) {
    return {
      name: userName,
      hobbies: userHobbies,
      traits: [],
      summary: `${userName}, you're at a critical point in your personal development journey. Your current assessment suggests there are significant opportunities for growth and self-improvement. It's important to focus on building self-awareness, developing positive habits, and seeking support to enhance your personal and emotional well-being.`,
      score: totalScore
    };
  } else if (totalScore >= 15 && totalScore < 25) {
    return {
      name: userName,
      hobbies: userHobbies,
      traits: [],
      summary: `${userName}, you're making great progress on your personal growth path! Your current assessment shows you're on the right track. Continue to build on your strengths, remain open to learning, and keep pushing your boundaries. Small, consistent improvements will lead to significant personal development.`,
      score: totalScore
    };
  } else {
    return {
      name: userName,
      hobbies: userHobbies,
      traits: [],
      summary: `${userName}, congratulations! Your assessment reflects a strong, well-developed personal framework. You've demonstrated exceptional self-awareness, resilience, and personal growth. Continue to nurture your strengths, stay curious, and maintain the positive mindset that has brought you this far.`,
      score: totalScore
    };
  }
};