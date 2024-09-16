import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './SubjectHistoryModal.css';
import { X } from 'lucide-react';
import { isSameDay, format } from 'date-fns';

const SubjectHistoryModal = ({ bunkStatus, onClose }) => {
  const { subject, records } = bunkStatus;

  // Function to determine class style based on attendance
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayRecord = records.find(r => isSameDay(new Date(r.date), date));
      if (dayRecord) {
        return dayRecord.status === 'present' ? 'attended-day' : 'missed-day';
      }
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayRecords = records.filter(r => isSameDay(new Date(r.date), date));
      if (dayRecords.length > 1) {
        return <div className="multi-dot" title={`${dayRecords.length} classes recorded`}></div>;
      }
    }
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel slide-up history-modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2>{subject.name} <span style={{color:'var(--text-muted)', fontSize:'0.9rem', marginLeft:'10px', fontWeight:'400'}}>{subject.code}</span></h2>
        <p className="subtitle">Attendance History Calendar</p>

        <div className="calendar-wrapper">
          <Calendar 
            tileClassName={tileClassName}
            tileContent={tileContent}
          />
        </div>

        <div className="calendar-legend">
          <div className="legend-item"><span className="legend-dot attended"></span> Present</div>
          <div className="legend-item"><span className="legend-dot missed"></span> Absent</div>
        </div>

        {records.length > 0 && (
          <div className="recent-logs">
            <h3 style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>Recent Logs</h3>
            <ul className="log-list">
              {[...records].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3).map((r, i) => (
                <li key={i} className={`log-item ${r.status}`}>
                  <span>{format(new Date(r.date), 'MMM do, yyyy - h:mm a')}</span>
                  <strong style={{textTransform:'capitalize'}}>{r.status}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectHistoryModal;
