import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './useAuthStore';

interface Appointment {
  id?: string;
  userId: string;
  therapistId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  type: string;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'userId' | 'status'>) => Promise<void>;
  loadAppointments: () => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  error: null,
  bookAppointment: async (appointment) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointment,
        userId: user.uid,
        status: 'scheduled',
        createdAt: new Date().toISOString() // Add timestamp for sorting
      });
      set((state) => ({
        appointments: [...state.appointments, { ...appointment, id: docRef.id, userId: user.uid, status: 'scheduled' }],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  loadAppointments: async () => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      set({ loading: true, error: null });
      const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      set({ appointments: appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  cancelAppointment: async (id) => {
    try {
      set({ loading: true, error: null });
      const appointmentRef = doc(db, 'appointments', id);
      await deleteDoc(appointmentRef);
      set((state) => ({
        appointments: state.appointments.map(apt => 
          apt.id === id ? { ...apt, status: 'cancelled' } : apt
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));