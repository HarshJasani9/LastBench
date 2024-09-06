import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopStats from '../components/TopStats';
import SubjectCard from '../components/SubjectCard';
import AddSubjectModal from '../components/AddSubjectModal';
import SubjectHistoryModal from '../components/SubjectHistoryModal';
import api from '../api/axios';
import { gsap } from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle, AlertOctagon, BookX } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const containerRef = useRef(null);
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

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
    if (!isLoading && containerRef.current && subjects.length > 0) {
      const cards = containerRef.current.querySelectorAll('.subject-card');
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [isLoading, subjects.length]);

  const handleAddSubject = async (subjectData) => {
    try {
      const res = await api.post(`/students/${studentId}/subjects`, subjectData);
      setSubjects(res.data.subjects);
      toast.success('Subject added successfully!', {
        style: { background: 'var(--success)', color: '#fff' }
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
    return <div className="app-layout"><div style={{textAlign:'center', marginTop:'20vh', width:'100%'}}>Loading...</div></div>;
  }

  // Calculate danger state
  const subjectsInDanger = subjects.filter(sub => {
    const p = sub.totalClasses === 0 ? 0 : (sub.attendedClasses / sub.totalClasses) * 100;
    return sub.totalClasses > 0 && p < sub.attendanceCriteria;
  });

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <Toaster position="top-right" />
        
        <header className="page-header">
          <h1 className="title">Dashboard</h1>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Add Subject
          </button>
        </header>

        {subjectsInDanger.length > 0 && (
          <div className="danger-banner">
            <AlertOctagon size={24} />
            <span>
              You're in danger in {subjectsInDanger.length} {subjectsInDanger.length === 1 ? 'subject' : 'subjects'} — attend your next class!
            </span>
          </div>
        )}

        {subjects.length > 0 ? (
          <>
            <TopStats subjects={subjects} />
            <h2 className="section-title">Your Subjects</h2>
            <div className="dashboard-grid" ref={containerRef}>
              {subjects.map((subject) => (
                <SubjectCard 
                  key={subject._id} 
                  subject={subject} 
                  studentId={studentId}
                  onUpdate={handleSubjectUpdate}
                  onClick={() => setSelectedSubject(subject)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state glass-panel">
            <BookX size={64} className="empty-icon" />
            <h2>No subjects yet</h2>
            <p>Start tracking your attendance by adding your first subject.</p>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              Add First Subject
            </button>
          </div>
        )}

        <AddSubjectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddSubject}
        />

        <SubjectHistoryModal
          isOpen={!!selectedSubject}
          onClose={() => setSelectedSubject(null)}
          subject={selectedSubject}
        />
      </main>
    </div>
  );
};

export default Dashboard;
