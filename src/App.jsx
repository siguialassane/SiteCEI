import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import NameEntryPage from './pages/NameEntryPage';
import HomePage from './pages/HomePage';
import PollPage from './pages/PollPage';
import GuidePage from './pages/GuidePage';
import FutureExplanationsPage from './pages/FutureExplanationsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/name" element={<NameEntryPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/poll" element={<PollPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/future-explanations" element={<FutureExplanationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
