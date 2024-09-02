import React, { useEffect, useRef, useState } from 'react';
import SubjectCard from '../components/SubjectCard';
import { gsap } from 'gsap';
import './Dashboard.css';

const Dashboard = () => {
  const containerRef = useRef(null);
  const [subjects, setSubjects] = useState([
    // Mock data for UI testing before backend integration
    { id: 1, name: 'Data Structures', attendedClasses: 30, totalClasses: 40, attendanceCriteria: 75 },
    { id: 2, name: 'Operating Systems', attendedClasses: 25, totalClasses: 40, attendanceCriteria: 75 },
    { id: 3, name: 'Computer Networks', attendedClasses: 35, totalClasses: 40, attendanceCriteria: 80 },
    { id: 4, name: 'Database Systems', attendedClasses: 10, totalClasses: 40, attendanceCriteria: 75 },
  ]);

  useEffect(() => {
    // Stagger animation for cards on initial load
    const cards = containerRef.current.children;
    gsap.fromTo(cards, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">LastBench</h1>
        <p className="subtitle">Manage your attendance like a pro.</p>
      </header>

      <div className="dashboard-grid" ref={containerRef}>
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
        
        {/* Add New Subject Card placeholder */}
        <div className="glass-panel add-card">
          <div className="add-icon">+</div>
          <h3>Add Subject</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
