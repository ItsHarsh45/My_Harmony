import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersonalityInsights {
  name: string;
  hobbies: string[];
  traits: string[];
  summary: string;
}

interface AssessmentState {
  lastAssessment: {
    score: number;
    timestamp: number;
    level: 'mild' | 'moderate' | 'significant';
    personalityInsights?: PersonalityInsights;
  } | null;
  setAssessment: (
    score: number, 
    level: 'mild' | 'moderate' | 'significant',
    personalityInsights?: PersonalityInsights
  ) => void;
  clearAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      lastAssessment: null,
      setAssessment: (score, level, personalityInsights) =>
        set({
          lastAssessment: {
            score,
            level,
            personalityInsights,
            timestamp: Date.now(),
          },
        }),
      clearAssessment: () => set({ lastAssessment: null }),
    }),
    {
      name: 'assessment-storage',
    }
  )
);