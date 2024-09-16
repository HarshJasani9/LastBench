import React from 'react';
import { Target, Activity, Book, CheckCircle, AlertTriangle } from 'lucide-react';
import './TopStats.css';

const TopStats = ({ bunkStatuses }) => {
  const totalSubjects = bunkStatuses.length;
  
  let totalPresent = 0;
  let totalClasses = 0;
  let safeToBunk = 0;
  let dangerCount = 0;

  bunkStatuses.forEach(stat => {
    totalPresent += stat.present;
    totalClasses += stat.total;
    if (stat.safeToMiss > 0) safeToBunk += stat.safeToMiss;
    
    const p = stat.total === 0 ? 0 : (stat.present / stat.total) * 100;
    if (stat.total > 0 && p < (stat.subject.threshold || 75)) dangerCount++;
  });

  const overallPercentage = totalClasses === 0 ? 0 : Math.round((totalPresent / totalClasses) * 100);

  return (
    <div className="top-stats-grid">
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)' }}>
          <Activity size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Overall Attendance</p>
          <h3 className="stat-value">{overallPercentage}%</h3>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
          <Book size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Total Subjects</p>
          <h3 className="stat-value">{totalSubjects}</h3>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
          <CheckCircle size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Safe to Bunk (Total)</p>
          <h3 className="stat-value">{safeToBunk}</h3>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          <AlertTriangle size={24} />
        </div>
        <div className="stat-info">
          <p className="stat-title">Subjects in Danger</p>
          <h3 className="stat-value">{dangerCount}</h3>
        </div>
      </div>
    </div>
  );
};

export default TopStats;
