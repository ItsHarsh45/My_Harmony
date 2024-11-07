import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './useAuthStore';

interface MoodEntry {
  id?: string;
  userId: string;
  date: string;
  mood: string;
  notes: string;
  timeOfDay: string;
  activities: string[];
}

interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (entry: Omit<MoodEntry, 'id' | 'userId'>) => Promise<void>;
  loadEntries: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  addEntry: async (entry) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'moods'), {
        ...entry,
        userId: user.uid,
        date: new Date().toISOString()
      });
      set((state) => ({
        entries: [...state.entries, { ...entry, id: docRef.id, userId: user.uid }],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  loadEntries: async () => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      set({ loading: true, error: null });
      const q = query(collection(db, 'moods'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MoodEntry[];
      set({ entries, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  deleteEntry: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'moods', id));
      set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));