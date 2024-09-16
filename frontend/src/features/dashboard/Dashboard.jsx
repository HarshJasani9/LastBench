import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopStats from './TopStats';
import SubjectCard from '../subjects/SubjectCard';
import AddSubjectModal from '../subjects/AddSubjectModal';
import SubjectHistoryModal from '../subjects/SubjectHistoryModal';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { gsap } from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle, AlertOctagon, BookX } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const containerRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const [bunkStatuses, setBunkStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBunkStatus();
  }, [user, navigate]);

  const fetchBunkStatus = async () => {
    try {
      const res = await api.get('/attendance/bunk-status');
      setBunkStatuses(res.data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && containerRef.current && bunkStatuses.length > 0) {
      const cards = containerRef.current.querySelectorAll('.subject-card');
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [isLoading, bunkStatuses.length]);

  const handleSubjectUpdate = () => {
    fetchBunkStatus(); // Re-fetch bunk status whenever attendance is marked
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="app-layout"><div style={{textAlign:'center', marginTop:'20vh', width:'100%'}}>Loading Dashboard...</div></div>;
  }

  // Calculate danger state
  const subjectsInDanger = bunkStatuses.filter(stat => {
    const p = stat.total === 0 ? 0 : (stat.present / stat.total) * 100;
    return stat.total > 0 && p < (stat.subject.threshold || 75);
  });

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <Toaster position="top-right" />
        
        <header className="page-header">
          <div className="greeting-section">
            <h1 className="title">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
            <p className="subtitle">Here's your attendance overview</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <PlusCircle size={20} /> Add Subject
          </button>
        </header>

        {subjectsInDanger.length > 0 && (
          <div className="danger-banner">
            <AlertOctagon size={24} />
            <div>
              <strong>Warning:</strong> You are falling behind in {subjectsInDanger.length} subject(s). Check your stats!
            </div>
          </div>
        )}

        {bunkStatuses.length > 0 ? (
          <>
            <TopStats bunkStatuses={bunkStatuses} />
            <h2 className="section-title">Your Subjects</h2>
            <div className="dashboard-grid" ref={containerRef}>
              {bunkStatuses.map((stat) => (
                <SubjectCard 
                  key={stat.subject._id} 
                  bunkStatus={stat} 
                  onUpdate={handleSubjectUpdate}
                  onClick={() => setSelectedSubject(stat)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <BookX size={48} className="empty-icon" />
            </div>
            <h2>No subjects tracked yet</h2>
            <p>You haven't added any subjects to your active semester. Start tracking to see your bunk stats!</p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <PlusCircle size={20} /> Create Your First Subject
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <AddSubjectModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleSubjectUpdate}
        />
      )}

      {selectedSubject && (
        <SubjectHistoryModal 
          bunkStatus={selectedSubject} 
          onClose={() => setSelectedSubject(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
