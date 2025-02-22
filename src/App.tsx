import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './stores/useAuthStore';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Therapy from './pages/Therapy';
import AboutMe from './pages/AboutMe';
import MusicTherapy from './pages/therapy/MusicTherapy';
import { ArtTherapy } from './pages/therapy/ArtTherapy';
import Journaling from './pages/therapy/Journaling';
import MoodTracker from './pages/therapy/MoodTracker';
import BookAppointment from './pages/support/BookAppointments';
import GameHub from './pages/therapy/GameHub';
import MemoryMatch from './pages/therapy/games/MemoryMatch';
import SnackAttack from './pages/therapy/games/SnackAttack';
import QuickSuggestions from './pages/therapy/diagnosis/QuickSuggestions';
import DiagnosisTest from './pages/therapy/diagnosis/DiagnosisTest';
import DiagnosisHub from './pages/therapy/DiagnosisHub';
function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/support" element={<Support />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/therapy/GameHub" element={<PrivateRoute><GameHub /></PrivateRoute>} />
        <Route path="/therapy/games/memory-match" element={<MemoryMatch />} />
        <Route path="/therapy/games/snack-attack" element={<SnackAttack />} />
        <Route path="/therapy/music" element={<PrivateRoute><MusicTherapy /></PrivateRoute>} />
        <Route path="/therapy/art" element={<PrivateRoute><ArtTherapy /></PrivateRoute>} />
        <Route path="/therapy/journal" element={<PrivateRoute><Journaling /></PrivateRoute>} />
        <Route path="/therapy/mood" element={<PrivateRoute><MoodTracker /></PrivateRoute>} />
        <Route path="/support/book-appointment" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
        <Route path="/therapy/DiagnosisHub" element={<PrivateRoute><DiagnosisHub /></PrivateRoute>} />
        <Route path="/therapy/diagnosis/diagnosis" element={<DiagnosisTest />} />
        <Route path="/therapy/diagnosis/suggestions" element={<QuickSuggestions />} />
      </Routes>
    </Router>
  );
}

export default App;