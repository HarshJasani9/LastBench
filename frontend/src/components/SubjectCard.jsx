import React, { useRef, useEffect } from 'react';
import './SubjectCard.css';
import { gsap } from 'gsap';

const SubjectCard = ({ subject }) => {
  const cardRef = useRef(null);
  const progressRef = useRef(null);

  const { name, attendedClasses, totalClasses, attendanceCriteria } = subject;
  
  // Calculate percentage safely
  const percentage = totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);
  
  // Determine status color
  let statusColor = 'var(--success)';
  if (percentage < attendanceCriteria) {
    statusColor = 'var(--danger)';
  } else if (percentage === attendanceCriteria || percentage < attendanceCriteria + 5) {
    statusColor = 'var(--warning)';
  }

  // Animation on mount
  useEffect(() => {
    // Animate progress bar width
    gsap.fromTo(progressRef.current, 
      { width: '0%' }, 
      { width: `${percentage}%`, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );
  }, [percentage]);

  return (
    <div className="glass-panel subject-card" ref={cardRef}>
      <div className="card-header">
        <h3>{name}</h3>
        <span className="criteria">Target: {attendanceCriteria}%</span>
      </div>
      
      <div className="stats-row">
        <div className="stat-box">
          <span className="stat-value">{attendedClasses}</span>
          <span className="stat-label">Attended</span>
        </div>
        <div className="stat-divider">/</div>
        <div className="stat-box">
          <span className="stat-value">{totalClasses}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-header">
          <span>Current Attendance</span>
          <span style={{ color: statusColor, fontWeight: 'bold' }}>{percentage}%</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            ref={progressRef}
            style={{ backgroundColor: statusColor }}
          ></div>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-action btn-add">+ Add Class</button>
        <button className="btn-action btn-miss">- Miss Class</button>
      </div>
    </div>
  );
};

export default SubjectCard;
