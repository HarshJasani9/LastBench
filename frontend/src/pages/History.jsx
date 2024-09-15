import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { Check, X, Calendar as CalendarIcon } from 'lucide-react';
import './History.css';
import './Dashboard.css';

const History = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const sid = localStorage.getItem('lastbench_student_id');
      if (!sid) {
        navigate('/auth');
        return;
      }

      try {
        const res = await api.get(`/students/${sid}`);
        const subjects = res.data.subjects || [];
        
        let allHistory = [];
        subjects.forEach(subject => {
          if (subject.history && subject.history.length > 0) {
            subject.history.forEach(record => {
              allHistory.push({
                ...record,
                subjectName: subject.name,
                subjectId: subject._id
              });
            });
          }
        });

        // Sort by date descending (newest first)
        allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistoryItems(allHistory);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load history');
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('lastbench_token');
    localStorage.removeItem('lastbench_student_id');
    navigate('/auth');
  };

  if (isLoading) return <div className="app-layout">Loading...</div>;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <Toaster position="top-right" />
        <header className="page-header">
          <h1 className="title">Attendance History</h1>
        </header>

        <div className="history-container">
          {historyItems.length > 0 ? (
            <div className="history-timeline">
              {historyItems.map((item, index) => (
                <div key={`${item._id}-${index}`} className="timeline-item">
                  <div className="timeline-left">
                    <div className={`timeline-icon ${item.status}`}>
                      {item.status === 'present' ? <Check size={24} /> : <X size={24} />}
                    </div>
                    <div className="timeline-details">
                      <h3>{item.subjectName}</h3>
                      <p>{format(new Date(item.date), 'EEEE, MMMM do, yyyy')}</p>
                    </div>
                  </div>
                  <div className="timeline-right">
                    <span className={`timeline-status ${item.status}`}>
                      {item.status === 'present' ? 'Attended' : 'Missed'}
                    </span>
                    <span className="timeline-time">
                      {format(new Date(item.date), 'h:mm a')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginTop: '2rem' }}>
              <CalendarIcon size={64} style={{ color: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 1.5rem' }} />
              <h2>No history yet</h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Your complete timeline of all attended and missed classes will appear here. Start logging your classes on the dashboard!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
