import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SubjectCard from './SubjectCard';
import SubjectHistoryModal from './SubjectHistoryModal';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { gsap } from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import '../dashboard/Dashboard.css';

const Subjects = () => {
  const containerRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const [bunkStatuses, setBunkStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      toast.error('Failed to load subjects');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && containerRef.current && bunkStatuses.length > 0) {
      const cards = containerRef.current.querySelectorAll('.subject-card');
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [isLoading, bunkStatuses.length]);

  const handleSubjectUpdate = () => {
    fetchBunkStatus();
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="app-layout"><div style={{textAlign:'center', marginTop:'20vh', width:'100%'}}>Loading...</div></div>;
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <Toaster position="top-right" />
        
        <header className="page-header">
          <h1 className="title">My Subjects</h1>
        </header>

        {bunkStatuses.length > 0 ? (
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
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <BookOpen size={48} className="empty-icon" />
            </div>
            <h2>No subjects found</h2>
            <p>Go to your dashboard to add subjects to your active semester.</p>
          </div>
        )}
      </main>

      {selectedSubject && (
        <SubjectHistoryModal 
          bunkStatus={selectedSubject} 
          onClose={() => setSelectedSubject(null)} 
        />
      )}
    </div>
  );
};

export default Subjects;
