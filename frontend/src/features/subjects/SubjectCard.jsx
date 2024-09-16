import React, { useRef } from 'react';
import './SubjectCard.css';
import { gsap } from 'gsap';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Minus } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SubjectCard = ({ bunkStatus, onUpdate, onClick }) => {
  const cardRef = useRef(null);
  const { subject, present, total, safeToMiss } = bunkStatus;
  
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
  const criteria = subject.threshold || 75;

  let ringColor = 'var(--success)';
  if (total > 0 && percentage < criteria) {
    ringColor = 'var(--danger)';
  } else if (safeToMiss <= 0) {
    ringColor = 'var(--warning)';
  }

  const handleAttendance = async (e, status) => {
    e.stopPropagation();
    try {
      await api.post('/attendance/mark', {
        subjectId: subject._id,
        status,
        date: new Date()
      });
      onUpdate();
      
      const el = e.currentTarget;
      gsap.fromTo(el, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
      toast.success(`Marked ${status}!`);
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  return (
    <div className="glass-panel subject-card" ref={cardRef} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-header">
        <h3 className="subject-title">{subject.name}</h3>
        {subject.code && <span className="subject-code">{subject.code}</span>}
      </div>

      <div className="card-body">
        <div className="progress-container">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              pathColor: ringColor,
              textColor: 'var(--text-main)',
              trailColor: 'var(--glass-border)',
              textSize: '24px',
            })}
          />
        </div>
        
        <div className="stats-container">
          <p>Target: <strong>{criteria}%</strong></p>
          <p>Attended: <strong>{present}/{total}</strong></p>
          <div className={`bunk-status ${safeToMiss > 0 ? 'safe' : 'danger'}`}>
            {safeToMiss > 0 ? `${safeToMiss} bunks available` : 'Cannot bunk next'}
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-attendance present" onClick={(e) => handleAttendance(e, 'present')}>
          <Plus size={18} /> Present
        </button>
        <button className="btn-attendance absent" onClick={(e) => handleAttendance(e, 'absent')}>
          <Minus size={18} /> Absent
        </button>
      </div>
    </div>
  );
};

export default SubjectCard;
