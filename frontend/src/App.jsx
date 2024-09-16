import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './features/landing/Landing';
import Dashboard from './features/dashboard/Dashboard';
import Subjects from './features/subjects/Subjects';
import History from './features/history/History';
import Settings from './features/settings/Settings';
import Auth from './features/auth/Auth';
import ThemeToggle from './components/ThemeToggle';
import './App.css';  

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
