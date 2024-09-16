import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { PlusCircle, Save } from 'lucide-react';
import './Settings.css';
import '../dashboard/Dashboard.css';

const Settings = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [student, setStudent] = useState({
    name: '',
    email: '',
    rollNumber: '',
    college: '',
    department: '',
    currentSemester: 'SEM 1',
    academicYear: '',
    division: '',
    defaultThreshold: 75,
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    semesters: [],
    createdAt: new Date()
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const initializeUser = async () => {
      const sid = localStorage.getItem('lastbench_student_id');
      if (!sid) {
        navigate('/auth');
        return;
      }
      setStudentId(sid);
      try {
        const res = await api.get(`/students/${sid}`);
        setStudent({ ...student, ...res.data });
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load settings');
      }
    };
    initializeUser();
  }, [navigate]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    if (!isEditing) return;
    const days = [...student.workingDays];
    if (days.includes(day)) {
      setStudent({ ...student, workingDays: days.filter(d => d !== day) });
    } else {
      setStudent({ ...student, workingDays: [...days, day] });
    }
  };

  const saveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.put(`/students/${studentId}/settings`, student);
      toast.success('Settings saved successfully!');
      setIsEditingProfile(false);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await api.put(`/students/${studentId}/settings`, { password: passwordData.new });
      toast.success('Password updated!');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const addSemester = async () => {
    const newSem = {
      name: `SEM ${student.semesters.length + 1}`,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      defaultThreshold: student.defaultThreshold,
      isActive: student.semesters.length === 0
    };
    const updatedSems = [...student.semesters, newSem];
    setStudent({ ...student, semesters: updatedSems });
    
    // Save to DB
    try {
      const res = await api.put(`/students/${studentId}/settings`, { semesters: updatedSems });
      setStudent(res.data); // Update with DB response to get valid _id
      toast.success('Semester added!');
    } catch(err) {}
  };

  const toggleActiveSemester = async (index) => {
    const updatedSems = student.semesters.map((sem, i) => ({
      ...sem,
      isActive: i === index
    }));
    try {
      const res = await api.put(`/students/${studentId}/settings`, { semesters: updatedSems });
      setStudent(res.data);
      toast.success('Active semester updated!');
    } catch(err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('lastbench_token');
    localStorage.removeItem('lastbench_student_id');
    navigate('/auth');
  };

  if (isLoading) return <div className="app-layout">Loading...</div>;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">
        <Toaster position="top-right" />
        <header className="page-header">
          <h1 className="title">Settings</h1>
          {isEditing ? (
            <button className="btn-primary" onClick={saveSettings} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Save size={20} /> Save All Changes
            </button>
          ) : (
            <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--panel-border)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}>
              Edit Settings
            </button>
          )}
        </header>

        <div className="settings-container">
          
          {/* Profile Section */}
          <section className="glass-panel settings-section">
            <h2>Personal Profile</h2>
            <div className="profile-header">
              <div className="avatar-circle">
                {student.name ? student.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="profile-info">
                {isEditingProfile ? (
                  <div className="inline-edit-group">
                    <input type="text" name="name" value={student.name} onChange={handleChange} className="inline-input" placeholder="Name" />
                    <input type="email" name="email" value={student.email} onChange={handleChange} className="inline-input" placeholder="Email" />
                    <button className="btn-primary btn-small" onClick={saveSettings}>Save</button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                      {student.name} <span onClick={() => setIsEditingProfile(true)} style={{fontSize:'0.9rem', color:'var(--accent)', cursor:'pointer', fontWeight:'400', marginLeft:'1rem'}}>Edit</span>
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }}>{student.email}</p>
                  </>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Member since {format(new Date(student.createdAt), 'MMMM yyyy')}
                </p>
              </div>
            </div>

            <form className="settings-grid" onSubmit={handlePasswordChange}>
              <div className="form-group-settings">
                <label>Roll Number</label>
                <input type="text" name="rollNumber" value={student.rollNumber || ''} onChange={handleChange} placeholder="e.g. 21CE000" disabled={!isEditing} />
              </div>
              <div className="form-group-settings">
                <label>New Password</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="password" placeholder="New Password" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} style={{ flex: 1 }} disabled={!isEditing} />
                  <input type="password" placeholder="Confirm" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} style={{ flex: 1 }} disabled={!isEditing} />
                  {isEditing && <button type="submit" className="btn-primary btn-small">Update</button>}
                </div>
              </div>
            </form>
          </section>

          {/* Academic Info Section */}
          <section className="glass-panel settings-section">
            <h2>College & Academic Info</h2>
            <div className="settings-grid">
              <div className="form-group-settings">
                <label>College Name</label>
                <input type="text" name="college" value={student.college || ''} onChange={handleChange} placeholder="e.g. CVM University" disabled={!isEditing} />
              </div>
              <div className="form-group-settings">
                <label>Department / Branch</label>
                <input type="text" name="department" value={student.department || ''} onChange={handleChange} placeholder="e.g. Computer Engineering" disabled={!isEditing} />
              </div>
              <div className="form-group-settings">
                <label>Current Semester</label>
                <select name="currentSemester" value={student.currentSemester} onChange={handleChange} disabled={!isEditing}>
                  {[1,2,3,4,5,6,7,8].map(sem => <option key={sem} value={`SEM ${sem}`}>SEM {sem}</option>)}
                </select>
              </div>
              <div className="form-group-settings">
                <label>Academic Year</label>
                <input type="text" name="academicYear" value={student.academicYear || ''} onChange={handleChange} placeholder="e.g. 2024-25" disabled={!isEditing} />
              </div>
              <div className="form-group-settings">
                <label>Division</label>
                <input type="text" name="division" value={student.division || ''} onChange={handleChange} placeholder="e.g. A" disabled={!isEditing} />
              </div>
            </div>
          </section>

          {/* Semester Management */}
          <section className="glass-panel settings-section">
            <h2>Semester Management</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Only one semester can be active at a time. The dashboard will show subjects for the active semester.
            </p>
            
            <div className="semester-list">
              {student.semesters.map((sem, idx) => (
                <div key={sem._id || idx} className={`semester-card ${sem.isActive ? 'active' : ''}`}>
                  <div className="semester-info">
                    <h3>{sem.name} {sem.isActive && <span style={{ fontSize:'0.8rem', background:'var(--accent)', color:'#fff', padding:'2px 8px', borderRadius:'12px', marginLeft:'10px' }}>ACTIVE</span>}</h3>
                    <p>{format(new Date(sem.startDate), 'MMM yyyy')} — {format(new Date(sem.endDate), 'MMM yyyy')}</p>
                    <p style={{ marginTop: '0.5rem', fontWeight:'600' }}>Threshold: {sem.defaultThreshold}%</p>
                  </div>
                  <div className="semester-actions">
                    {!sem.isActive && (
                      <button className="btn-primary btn-small" onClick={() => toggleActiveSemester(idx)}>Set Active</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={addSemester} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <PlusCircle size={20} /> Add New Semester
            </button>
          </section>

          {/* Preferences */}
          <section className="glass-panel settings-section">
            <h2>Attendance Preferences</h2>
            
            <div className="pref-row">
              <div>
                <h3>Default Threshold</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Global default criteria for new subjects</p>
              </div>
              <div className="slider-container">
                <input 
                  type="range" 
                  name="defaultThreshold" 
                  min="50" max="90" step="5" 
                  value={student.defaultThreshold} 
                  onChange={handleChange} 
                  className="slider"
                  disabled={!isEditing}
                />
                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent)' }}>{student.defaultThreshold}%</span>
              </div>
            </div>

            <div className="pref-row" style={{ alignItems: 'flex-start' }}>
              <div>
                <h3>Working Days</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Days you attend college</p>
              </div>
              <div className="days-grid">
                {allDays.map(day => (
                  <label key={day}>
                    <input 
                      type="checkbox" 
                      className="day-checkbox" 
                      checked={student.workingDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                      disabled={!isEditing}
                    />
                    <div className={`day-label ${!isEditing ? 'disabled' : ''}`}>{day}</div>
                  </label>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Settings;
