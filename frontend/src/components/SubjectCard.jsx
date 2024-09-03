import React, { useRef, useEffect } from 'react';
import './SubjectCard.css';
import { gsap } from 'gsap';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';

const SubjectCard = ({ subject, studentId, onUpdate }) => {
  const cardRef = useRef(null);
  const progressRef = useRef(null);

  const { _id, name, attendedClasses, totalClasses, attendanceCriteria } = subject;
  
  // Calculate percentage safely
  const percentage = totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);
  
  // Determine status color
  let statusColor = 'var(--success)';
  if (percentage < attendanceCriteria) {
    statusColor = 'var(--danger)';
  } else if (percentage === attendanceCriteria || percentage < attendanceCriteria + 5) {
    statusColor = 'var(--warning)';
  }

  // Animation on mount and percentage change
  useEffect(() => {
    gsap.fromTo(progressRef.current, 
      { width: '0%' }, 
      { width: `${percentage}%`, duration: 1.5, ease: "power3.out", delay: 0.1 }
    );
  }, [percentage]);

  const handleUpdate = async (isAttended) => {
    try {
      const newAttended = isAttended ? attendedClasses + 1 : attendedClasses;
      const newTotal = totalClasses + 1;

      const res = await api.put(`/students/${studentId}/subjects/${_id}`, {
        attendedClasses: newAttended,
        totalClasses: newTotal
      });
      
      onUpdate(res.data);
      toast.success(isAttended ? 'Class attended!' : 'Class missed.', {
        style: {
          background: 'var(--glass-bg)',
          color: 'var(--text-main)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border)'
        }
      });
    } catch (error) {
      toast.error('Failed to update attendance');
      console.error(error);
    }
  };

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
        <button className="btn-action btn-add" onClick={() => handleUpdate(true)}>
          <Plus size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> 
          Attended
        </button>
        <button className="btn-action btn-miss" onClick={() => handleUpdate(false)}>
          <Minus size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> 
          Missed
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
