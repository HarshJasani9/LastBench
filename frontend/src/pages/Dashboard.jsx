import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const initializeUser = async () => {
      try {
        let sid = localStorage.getItem('lastbench_student_id');
        
        if (!sid) {
          // Frictionless onboarding: create a default user if none exists locally
          const res = await api.post('/students', {
            name: 'Guest Student',
            email: `guest_${Date.now()}@lastbench.com`,
            password: 'password123'
          });
          sid = res.data._id;
          localStorage.setItem('lastbench_student_id', sid);
        }
        
        setStudentId(sid);
        fetchSubjects(sid);
      } catch (error) {
        toast.error('Failed to initialize session');
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

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

  if (isLoading) {
    return <div className="app-container"><div style={{textAlign:'center', marginTop:'20vh'}}>Loading...</div></div>;
  }

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <header className="header">
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
