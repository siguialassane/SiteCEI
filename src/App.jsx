import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import NameEntryPage from './pages/NameEntryPage';
import GenderSelectionPage from './pages/GenderSelectionPage';
import AddressPage from './pages/AddressPage';
import HomePage from './pages/HomePage';
import PollPage from './pages/PollPage';
import GuidePage from './pages/GuidePage';
import FutureExplanationsPage from './pages/FutureExplanationsPage';
import AlreadyVotedPage from './pages/AlreadyVotedPage';
import PollResultsPage from './pages/PollResultsPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ResultsPage from './pages/admin/ResultsPage';
import ParticipantsPage from './pages/admin/ParticipantsPage';
import GeographyPage from './pages/admin/GeographyPage';
import DemographicsPage from './pages/admin/DemographicsPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/name" element={<NameEntryPage />} />
        <Route path="/gender" element={<GenderSelectionPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/poll" element={<PollPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/future-explanations" element={<FutureExplanationsPage />} />
        <Route path="/already-voted" element={<AlreadyVotedPage />} />
        <Route path="/poll-results" element={<PollResultsPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="geography" element={<GeographyPage />} />
          <Route path="demographics" element={<DemographicsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
