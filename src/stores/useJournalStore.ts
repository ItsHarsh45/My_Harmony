import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  deleteDoc, 
  doc, 
  startAfter,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { db, getJournalEntries, getFallbackJournalEntries, ENTRIES_PER_PAGE } from '../lib/firebase';
import { useAuthStore } from './useAuthStore';

export enum JournalMood {
  HAPPY = '😊 Happy',
  CALM = '😌 Calm',
  SAD = '😔 Sad',
  ANGRY = '😤 Angry',
  PRODUCTIVE = '✨ Productive',
  TIRED = '😴 Tired'
}

interface JournalEntry {
  id?: string;
  userId: string;
  content: string;
  mood: JournalMood;
  date: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

interface PaginationState {
  lastVisible: any;
  hasMore: boolean;
  pageSize: number;
  currentPage: number;
}

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  loadEntries: (loadMore?: boolean) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntries: () => void;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

const handleFirebaseError = (error: FirebaseError): string => {
  console.error('Firebase Error:', {
    code: error.code,
    message: error.message,
    stack: error.stack,
    details: error
  });

  const errorMessages: Record<string, string> = {
    'permission-denied': 'Access denied. Please sign in again.',
    'not-found': 'No entries found.',
    'unauthenticated': 'Please sign in to continue.',
    'network-request-failed': 'Network error. Please check your connection.',
    'deadline-exceeded': 'Request timeout. Please try again.',
    'resource-exhausted': 'Service temporarily unavailable. Please try again later.',
    'cancelled': 'Operation cancelled.',
    'invalid-argument': 'Invalid data provided.'
  };

  return errorMessages[error.code] || `Error: ${error.message}`;
};

async function retryOperation<T>(
  operation: () => Promise<T>, 
  retries: number = RETRY_ATTEMPTS
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof FirebaseError) {
      const shouldRetry = ['network-request-failed', 'deadline-exceeded'].includes(error.code);
      if (shouldRetry) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return retryOperation(operation, retries - 1);
      }
    }
    throw error;
  }
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  pagination: {
    lastVisible: null,
    hasMore: true,
    pageSize: ENTRIES_PER_PAGE,
    currentPage: 0
  },

  loadEntries: async (loadMore = false) => {
    const user = useAuthStore.getState().user;
    
    if (!user?.uid) {
      set({ error: 'Please sign in to view entries' });
      return;
    }

    try {
      set(state => ({ loading: true, error: null }));
      
      // Try the indexed query first
      try {
        let baseQuery = getJournalEntries(user.uid);
        if (loadMore && get().pagination.lastVisible) {
          baseQuery = query(baseQuery, startAfter(get().pagination.lastVisible));
        }

        const querySnapshot = await getDocs(baseQuery);
        const newEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as JournalEntry[];

        set(state => ({
          entries: loadMore ? [...state.entries, ...newEntries] : newEntries,
          loading: false,
          pagination: {
            lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
            hasMore: querySnapshot.size === ENTRIES_PER_PAGE,
            pageSize: ENTRIES_PER_PAGE,
            currentPage: loadMore ? state.pagination.currentPage + 1 : 0
          }
        }));

      } catch (error) {
        if (error instanceof FirebaseError && error.code === 'failed-precondition') {
          // If index is not ready, use fallback query
          console.log('Index not ready, using fallback query');
          const fallbackQuery = getFallbackJournalEntries(user.uid);
          const querySnapshot = await getDocs(fallbackQuery);
          const newEntries = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as JournalEntry[];

          // Sort entries manually for fallback query
          newEntries.sort((a, b) => {
            const dateA = a.createdAt?.toMillis() || 0;
            const dateB = b.createdAt?.toMillis() || 0;
            return dateB - dateA;
          });

          set({
            entries: newEntries,
            loading: false,
            error: 'Entries are being indexed. Some features may be limited temporarily.',
            pagination: {
              lastVisible: null,
              hasMore: false,
              pageSize: ENTRIES_PER_PAGE,
              currentPage: 0
            }
          });
        } else {
          throw error;
        }
      }

    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? handleFirebaseError(error)
        : 'Failed to load entries. Please try again.';
      
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  addEntry: async (entry) => {
    const user = useAuthStore.getState().user;
    
    if (!user?.uid) {
      set({ error: 'Please sign in to add entries' });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const newEntry = {
        content: entry.content.trim(),
        mood: entry.mood,
        date: entry.date,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await retryOperation(() => 
        addDoc(collection(db, 'journal'), newEntry)
      );
      
      // Optimistically add the new entry to the state
      const optimisticEntry = {
        ...newEntry,
        id: docRef.id,
        createdAt: Timestamp.fromDate(new Date()) // Convert current date to Timestamp
      } as JournalEntry;

      set(state => ({
        entries: [optimisticEntry, ...state.entries],
        loading: false
      }));

    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? handleFirebaseError(error)
        : 'Failed to save entry. Please try again.';
      
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  deleteEntry: async (id) => {
    const user = useAuthStore.getState().user;
    
    if (!user?.uid) {
      set({ error: 'Please sign in to delete entries' });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      await retryOperation(() => 
        deleteDoc(doc(db, 'journal', id))
      );
      
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id),
        loading: false
      }));

    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? handleFirebaseError(error)
        : 'Failed to delete entry. Please try again.';
      
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearEntries: () => set({ 
    entries: [], 
    pagination: {
      lastVisible: null,
      hasMore: true,
      pageSize: ENTRIES_PER_PAGE,
      currentPage: 0
    }
  })
}));