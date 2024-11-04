import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Support from './pages/Support';
import Therapy from './pages/Therapy';
import BookAppointment from './pages/support/BookAppointment';
import MusicTherapy from './pages/therapy/MusicTherapy';
import ArtTherapy from './pages/therapy/ArtTherapy';
import Journaling from './pages/therapy/Journaling';
import MoodTracker from './pages/therapy/MoodTracker';
import QuickSuggestions from './pages/therapy/QuickSuggestions';
import SOSTips from './pages/therapy/SOSTips';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/therapy" element={<Therapy />} />
          <Route path="/therapy/sos" element={<SOSTips />} />
          <Route path="/therapy/music" element={<MusicTherapy />} />
          <Route path="/therapy/art" element={<ArtTherapy />} />
          <Route path="/therapy/journal" element={<Journaling />} />
          <Route path="/therapy/mood" element={<MoodTracker />} />
          <Route path="/support/book-appointment" element={<BookAppointment />} />
          <Route path="/therapy/suggestions" element={<QuickSuggestions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
