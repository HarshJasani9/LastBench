import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { Check, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import './History.css';
import '../dashboard/Dashboard.css';

const History = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [historyItems, setHistoryItems] = useState([]);
  const [activeSemesterName, setActiveSemesterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // 1. Get active semester name
      const semRes = await api.get('/semesters');
      const activeSem = semRes.data.find(s => s.isActive);
      if (activeSem) {
        setActiveSemesterName(activeSem.name);
      }

      // 2. Get history
      const histRes = await api.get('/attendance/history');
      
      // 3. Filter history to only include subjects from the active semester
      const filteredHistory = histRes.data.filter(record => {
        if (!activeSem) return true;
        return record.subject && record.subject.semester === activeSem._id;
      });

      setHistoryItems(filteredHistory);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load history');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/attendance/${id}`);
        setHistoryItems(historyItems.filter(item => item._id !== id));
        toast.success('Record deleted');
      } catch (err) {
        toast.error('Failed to delete record');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (isLoading) return <div className="app-layout">Loading...</div>;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <Toaster position="top-right" />
        <header className="page-header">
          <h1 className="title">Attendance History {activeSemesterName ? `(${activeSemesterName})` : ''}</h1>
        </header>

        <div className="history-container">
          {historyItems.length > 0 ? (
            <div className="history-timeline">
              {historyItems.map((item) => (
                <div key={item._id} className="timeline-item">
                  <div className="timeline-left">
                    <div className={`timeline-icon ${item.status}`}>
                      {item.status === 'present' ? <Check size={24} /> : <X size={24} />}
                    </div>
                    <div className="timeline-details">
                      <h3>{item.subject ? item.subject.name : 'Deleted Subject'}</h3>
                      <p>{format(new Date(item.date), 'EEEE, MMMM do, yyyy')}</p>
                    </div>
                  </div>
                  <div className="timeline-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span className={`timeline-status ${item.status}`}>
                        {item.status === 'present' ? 'Attended' : 'Missed'}
                      </span>
                      <span className="timeline-time">
                        {format(new Date(item.date), 'h:mm a')}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }}
                    >
                      <Trash2 size={20} />
                    </button>
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
