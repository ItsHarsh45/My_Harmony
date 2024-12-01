import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, ensureAuth, handleFirebaseError } from '../lib/firebase';

export interface Assessment {
  userId: string;
  answers: number[];
  hobbies: string[];
  score: number;
  level: 'mild' | 'moderate' | 'significant';
  timestamp: any;
  personalityInsights?: {
    name: string;
    hobbies: string[];
    traits: string[];
    summary: string;
  };
}

export const saveAssessment = async (
  answers: number[],
  hobbies: string[],
  score: number,
  level: 'mild' | 'moderate' | 'significant',
  personalityInsights: Assessment['personalityInsights']
): Promise<void> => {
  try {
    const user = ensureAuth();
    
    // Delete previous assessments for this user
    const previousAssessments = await getUserAssessments();
    await Promise.all(
      previousAssessments.map(assessment => 
        assessment.id ? deleteDoc(doc(db, 'assessments', assessment.id)) : Promise.resolve()
      )
    );

    // Save new assessment
    const assessmentData: Omit<Assessment, 'timestamp'> = {
      userId: user.uid,
      answers,
      hobbies,
      score,
      level,
      personalityInsights
    };

    await addDoc(collection(db, 'assessments'), {
      ...assessmentData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const getUserAssessments = async (): Promise<(Assessment & { id?: string })[]> => {
  try {
    const user = ensureAuth();
    const assessmentsRef = collection(db, 'assessments');
    const q = query(assessmentsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Assessment
    }));
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw new Error(handleFirebaseError(error));
  }
};