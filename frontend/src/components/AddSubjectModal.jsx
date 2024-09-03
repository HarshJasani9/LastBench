import React, { useState } from 'react';
import './AddSubjectModal.css';

const AddSubjectModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [attendanceCriteria, setAttendanceCriteria] = useState(75);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, attendanceCriteria: Number(attendanceCriteria) });
    setName('');
    setAttendanceCriteria(75);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <h2>Add New Subject</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Data Structures"
              required 
            />
          </div>
          <div className="form-group">
            <label>Target Attendance (%)</label>
            <input 
              type="number" 
              value={attendanceCriteria} 
              onChange={(e) => setAttendanceCriteria(e.target.value)} 
              min="1" 
              max="100" 
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Add Subject</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
