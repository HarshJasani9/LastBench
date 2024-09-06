import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Calendar as CalendarIcon } from 'lucide-react';
import './Dashboard.css';

const History = () => {
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
          <h1 className="title">Attendance History</h1>
        </header>

        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
          <CalendarIcon size={64} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1.5rem' }} />
          <h2>Unified History View</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            A complete timeline of all your attended and missed classes across all subjects will appear here soon. For now, you can view the history of individual subjects by clicking on their cards in the Dashboard!
          </p>
        </div>
      </main>
    </div>
  );
};

export default History;
