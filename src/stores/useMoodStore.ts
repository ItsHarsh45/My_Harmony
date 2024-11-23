import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './useAuthStore';

interface MoodEntry {
  id?: string;
  userId: string;
  date: string;
  timestamp: Timestamp;
  mood: string;
  notes: string;
  timeOfDay: string;
  activities: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type NewMoodEntry = Omit<MoodEntry, 'id' | 'userId' | 'timestamp' | 'createdAt' | 'updatedAt'>;

interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (entry: NewMoodEntry) => Promise<string>;
  loadEntries: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  addEntry: async (entry: NewMoodEntry) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      const error = new Error('User not authenticated');
      set({ error: error.message });
      throw error;
    }

    try {
      set({ loading: true, error: null });
      
      const now = new Date();
      const newEntry = {
        ...entry,
        userId: user.uid,
        date: now.toISOString(),
        timestamp: Timestamp.fromDate(now),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'moods'), newEntry);
      
      set((state) => ({
        entries: [
          ...state.entries,
          { ...newEntry, id: docRef.id } as MoodEntry
        ],
        loading: false
      }));

      return docRef.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add mood entry';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  loadEntries: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      const error = new Error('User not authenticated');
      set({ error: error.message });
      throw error;
    }

    try {
      set({ loading: true, error: null });
      
      const q = query(
        collection(db, 'moods'), 
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MoodEntry[];

      // Sort entries by timestamp in descending order
      entries.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      
      set({ entries, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load mood entries';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteEntry: async (id: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      const error = new Error('User not authenticated');
      set({ error: error.message });
      throw error;
    }

    try {
      set({ loading: true, error: null });
      
      // Verify the entry exists and belongs to the user before deleting
      const entry = get().entries.find(e => e.id === id);
      if (!entry) {
        throw new Error('Entry not found');
      }
      if (entry.userId !== user.uid) {
        throw new Error('Unauthorized to delete this entry');
      }

      await deleteDoc(doc(db, 'moods', id));
      
      set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete mood entry';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error })
}));