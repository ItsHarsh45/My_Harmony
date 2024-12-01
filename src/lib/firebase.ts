import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, limit, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCR1UV4jDO4-1HYFr1nVMmcVO8uO3L-Lls",
  authDomain: "fir-auth-c74da.firebaseapp.com",
  projectId: "fir-auth-c74da",
  storageBucket: "fir-auth-c74da.firebasestorage.app",
  messagingSenderId: "14287055275",
  appId: "1:14287055275:web:72c49aea6be619f04b4aee",
  measurementId: "G-ZXVWZM0ZGE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

// Helper function to ensure user is authenticated
export const ensureAuth = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be signed in to perform this action');
  return user;
};

// Helper function to handle Firebase errors
export const handleFirebaseError = (error: any): string => {
  if (error.code === 'permission-denied') {
    return 'You do not have permission to perform this action. Please sign in.';
  }
  return error.message || 'An unexpected error occurred';
};

// Constants
export const ENTRIES_PER_PAGE = 10;

// Journal collection reference
export const journalRef = collection(db, 'journal');

// Fallback query without ordering (for when index is building)
export const getFallbackJournalEntries = (userId: string, pageSize: number = ENTRIES_PER_PAGE) => {
  return query(
    journalRef,
    where('userId', '==', userId),
    limit(pageSize)
  );
};

// Main query with ordering (requires index)
export const getJournalEntries = (userId: string, pageSize: number = ENTRIES_PER_PAGE) => {
  return query(
    journalRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
};