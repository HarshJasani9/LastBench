import React, { useState } from 'react';
import './AddSubjectModal.css';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const AddSubjectModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacher: '',
    threshold: 75
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/subjects', formData);
      toast.success('Subject created!');
      onAdd();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel slide-up">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Add New Subject</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject Name</label>
            <input 
              type="text" 
              name="name"
              required 
              placeholder="e.g. Data Structures"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Subject Code (Optional)</label>
            <input 
              type="text" 
              name="code"
              placeholder="e.g. CS301"
              value={formData.code}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Teacher Name (Optional)</label>
            <input 
              type="text" 
              name="teacher"
              placeholder="e.g. Dr. Smith"
              value={formData.teacher}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Target Attendance (%)</label>
            <div className="slider-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <input 
                type="range" 
                name="threshold"
                min="50" 
                max="100" 
                step="5"
                value={formData.threshold}
                onChange={handleChange}
                style={{ flex: 1, accentColor: 'var(--accent)' }}
              />
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent)' }}>
                {formData.threshold}%
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Subject'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
