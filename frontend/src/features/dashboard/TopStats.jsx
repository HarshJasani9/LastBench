import React from 'react';
import { Activity, Book, CheckCircle, AlertTriangle } from 'lucide-react';
import './TopStats.css';

const TopStats = ({ subjects }) => {
  let totalAttended = 0;
  let totalClasses = 0;
  let subjectsInDanger = 0;
  let safeToBunkTotal = 0;

  subjects.forEach(sub => {
    totalAttended += sub.attendedClasses;
    totalClasses += sub.totalClasses;
    
    const percentage = sub.totalClasses === 0 ? 0 : (sub.attendedClasses / sub.totalClasses) * 100;
    if (sub.totalClasses > 0 && percentage < sub.attendanceCriteria) {
      subjectsInDanger++;
    }

    // Calculate safe to bunk
    if (sub.totalClasses > 0) {
      const c = sub.attendanceCriteria / 100;
      const safe = Math.floor((sub.attendedClasses - c * sub.totalClasses) / c);
      if (safe > 0) {
        safeToBunkTotal += safe;
      }
    }
  });

  const overallPercentage = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);

  return (
    <div className="top-stats-grid">
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent)' }}>
          <Activity size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Overall Attendance</p>
          <h3 className="stat-value">{overallPercentage}%</h3>
        </div>
      </div>
      
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
          <Book size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Total Subjects</p>
          <h3 className="stat-value">{subjects.length}</h3>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
          <CheckCircle size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Safe to Bunk (Total)</p>
          <h3 className="stat-value">{safeToBunkTotal}</h3>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          <AlertTriangle size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Subjects in Danger</p>
          <h3 className="stat-value">{subjectsInDanger}</h3>
        </div>
      </div>
    </div>
  );
};

export default TopStats;
