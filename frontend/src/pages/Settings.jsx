import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard layout styles

const Settings = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('lastbench_token');
    localStorage.removeItem('lastbench_student_id');
    navigate('/auth');
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <header className="page-header">
          <h1 className="title">Settings</h1>
        </header>

        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <SettingsIcon size={64} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1.5rem' }} />
          <h2>Preferences</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            User profile, notification settings, and theme preferences will be available here soon.
          </p>
          <button className="btn-primary" onClick={handleLogout}>Log Out of LastBench</button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
