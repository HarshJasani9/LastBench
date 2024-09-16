import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay } from 'date-fns';
import { X } from 'lucide-react';
import './SubjectHistoryModal.css';

const SubjectHistoryModal = ({ isOpen, onClose, subject }) => {
  if (!isOpen || !subject) return null;

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const historyRecord = subject.history.find(record => isSameDay(new Date(record.date), date));
      if (historyRecord) {
        return historyRecord.status === 'present' ? 'react-calendar__tile--present' : 'react-calendar__tile--absent';
      }
    }
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content history-modal">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{subject.name} History</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Target: {subject.attendanceCriteria}% | Current: {subject.totalClasses === 0 ? 0 : Math.round((subject.attendedClasses / subject.totalClasses) * 100)}%
        </p>

        <div className="calendar-container">
          <Calendar
            tileClassName={getTileClassName}
            defaultValue={new Date()}
            minDetail="month"
            next2Label={null}
            prev2Label={null}
          />
        </div>
        
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'var(--success)' }}></div>
            <span>Present</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'var(--danger)' }}></div>
            <span>Absent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectHistoryModal;
