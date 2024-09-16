import React, { useRef, useEffect } from 'react';
import './SubjectCard.css';
import { gsap } from 'gsap';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SubjectCard = ({ subject, studentId, onUpdate, onClick }) => {
  const cardRef = useRef(null);

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

  // Calculate bunk stats
  let bunkText = '';
  if (totalClasses > 0) {
    const c = attendanceCriteria / 100;
    const safe = Math.floor((attendedClasses - c * totalClasses) / c);
    
    if (safe > 0) {
      bunkText = `Safe to bunk ${safe} classes`;
    } else if (safe === 0 && percentage >= attendanceCriteria) {
      bunkText = `On track (0 to bunk)`;
    } else {
      const needed = Math.ceil((c * totalClasses - attendedClasses) / (1 - c));
      bunkText = `Need ${needed} more classes`;
    }
  } else {
    bunkText = 'No classes yet';
  }

  const handleUpdate = async (isAttended, e) => {
    e.stopPropagation(); // prevent modal open
    try {
      const newAttended = isAttended ? attendedClasses + 1 : attendedClasses;
      const newTotal = totalClasses + 1;
      const status = isAttended ? 'present' : 'absent';

      const res = await api.put(`/students/${studentId}/subjects/${_id}`, {
        attendedClasses: newAttended,
        totalClasses: newTotal,
        status,
        date: new Date()
      });
      
      onUpdate(res.data);
      toast.success(isAttended ? 'Class attended!' : 'Class missed.', {
        style: {
          background: 'var(--panel-bg)',
          color: 'var(--text-main)',
          border: '1px solid var(--panel-border)'
        }
      });
    } catch (error) {
      toast.error('Failed to update attendance');
      console.error(error);
    }
  };

  return (
    <div className="glass-panel subject-card" ref={cardRef}>
      <div className="clickable-area" onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className="card-header">
          <h3>{name}</h3>
          <span className="criteria">Target: {attendanceCriteria}%</span>
        </div>
        
        <div className="card-body">
          <div className="progress-ring-container">
            <CircularProgressbar
              value={percentage}
              text={`${percentage}%`}
              styles={buildStyles({
                pathColor: statusColor,
                textColor: 'var(--text-main)',
                trailColor: 'var(--panel-border)',
                pathTransitionDuration: 1.5,
                textSize: '24px'
              })}
            />
          </div>
          
          <div className="stats-col">
            <div className="stat-box">
              <span className="stat-value">{attendedClasses}</span>
              <span className="stat-label">Attended</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{totalClasses}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        <div className="bunk-status" style={{ color: statusColor, fontWeight: '600', textAlign: 'center', margin: '0.5rem 0' }}>
          {bunkText}
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-action btn-add" onClick={(e) => handleUpdate(true, e)}>
          <Plus size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> 
          Attended
        </button>
        <button className="btn-action btn-miss" onClick={(e) => handleUpdate(false, e)}>
          <Minus size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> 
          Missed
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
