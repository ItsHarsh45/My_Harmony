import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signup: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));