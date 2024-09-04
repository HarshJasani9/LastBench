import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectCard from '../components/SubjectCard';
import AddSubjectModal from '../components/AddSubjectModal';
import api from '../api/axios';
import { gsap } from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const containerRef = useRef(null);
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = () => {
      const token = localStorage.getItem('lastbench_token');
      const sid = localStorage.getItem('lastbench_student_id');
      
      if (!token || !sid) {
        navigate('/auth');
        return;
      }
      
      setStudentId(sid);
      fetchSubjects(sid);
    };

    initializeUser();
  }, [navigate]);

  const fetchSubjects = async (sid) => {
    try {
      const res = await api.get(`/students/${sid}`);
      setSubjects(res.data.subjects);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load subjects');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Stagger animation for cards when data is loaded
    if (!isLoading && containerRef.current && subjects.length >= 0) {
      const cards = containerRef.current.children;
      gsap.fromTo(cards, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [isLoading, subjects.length]); // trigger animation when subjects count changes

  const handleAddSubject = async (subjectData) => {
    try {
      const res = await api.post(`/students/${studentId}/subjects`, subjectData);
      setSubjects(res.data.subjects);
      toast.success('Subject added successfully!', {
        style: {
          background: 'var(--success)',
          color: '#fff',
        }
      });
    } catch (error) {
      toast.error('Failed to add subject');
    }
  };

  const handleSubjectUpdate = (updatedStudentData) => {
    setSubjects(updatedStudentData.subjects);
  };

  const handleLogout = () => {
    localStorage.removeItem('lastbench_token');
    localStorage.removeItem('lastbench_student_id');
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="app-container"><div style={{textAlign:'center', marginTop:'20vh'}}>Loading...</div></div>;
  }

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <header className="header" style={{ position: 'relative' }}>
        <button 
          onClick={handleLogout} 
          style={{ position: 'absolute', right: 0, top: 0, padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit' }}
        >
          Logout
        </button>
        <h1 className="title">LastBench</h1>
        <p className="subtitle">Manage your attendance like a pro.</p>
      </header>

      <div className="dashboard-grid" ref={containerRef}>
        {subjects.map((subject) => (
          <SubjectCard 
            key={subject._id} 
            subject={subject} 
            studentId={studentId}
            onUpdate={handleSubjectUpdate}
          />
        ))}
        
        {/* Add New Subject Card */}
        <div className="glass-panel add-card" onClick={() => setIsModalOpen(true)}>
          <Plus className="add-icon" />
          <h3>Add Subject</h3>
        </div>
      </div>

      <AddSubjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddSubject}
      />
    </div>
  );
};

export default Dashboard;
