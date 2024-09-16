import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SubjectCard from './SubjectCard';
import SubjectHistoryModal from './SubjectHistoryModal';
import api from '../../api/axios';
import { gsap } from 'gsap';
import toast, { Toaster } from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import '../dashboard/Dashboard.css';

const Subjects = () => {
  const containerRef = useRef(null);
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setStudent(res.data);
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

  const handleSubjectUpdate = (updatedStudentData) => {
    setStudent(updatedStudentData);
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

  const activeSemester = student?.semesters?.find(s => s.isActive);
  const displayedSubjects = subjects.filter(sub => {
    if (!activeSemester) return true;
    return sub.semesterId === activeSemester._id; 
  });

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      
      <main className="main-content">
        <Toaster position="top-right" />
        
        <header className="page-header">
          <h1 className="title">My Subjects {activeSemester ? `(${activeSemester.name})` : ''}</h1>
        </header>

        {displayedSubjects.length > 0 ? (
          <div className="dashboard-grid" ref={containerRef}>
            {displayedSubjects.map((subject) => (
              <SubjectCard 
                key={subject._id} 
                subject={subject} 
                studentId={studentId}
                onUpdate={handleSubjectUpdate}
                onClick={() => setSelectedSubject(subject)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <BookOpen size={64} className="empty-icon" />
            <h2>No subjects found</h2>
            <p>Go to your Dashboard to add some subjects first!</p>
          </div>
        )}

        <SubjectHistoryModal
          isOpen={!!selectedSubject}
          onClose={() => setSelectedSubject(null)}
          subject={selectedSubject}
        />
      </main>
    </div>
  );
};

export default Subjects;
