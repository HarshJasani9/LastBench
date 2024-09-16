import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { CheckCircle, BarChart2, Bell } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  useEffect(() => {
    // Simple hero animation
    gsap.fromTo('.hero-content', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo('.feature-card', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.5 }
    );
  }, []);

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">LastBench</div>
        <div className="nav-links">
          <Link to="/auth" className="btn-primary">Login / Sign Up</Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Track your attendance, gracefully.</h1>
          <p className="hero-subtitle">
            The minimalist, beautiful way to manage your subjects, target criteria, and daily classes. Never fall below 75% again.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="btn-primary btn-large">Get Started for Free</Link>
          </div>
        </div>

        <div className="features-grid">
          <div className="glass-panel feature-card">
            <CheckCircle className="feature-icon" />
            <h3>Custom Criteria</h3>
            <p>Set a specific target percentage for every subject. We'll tell you when you are in the danger zone.</p>
          </div>
          <div className="glass-panel feature-card">
            <BarChart2 className="feature-icon" />
            <h3>Beautiful Stats</h3>
            <p>Animated progress bars and clear metrics so you know exactly where you stand at a glance.</p>
          </div>
          <div className="glass-panel feature-card">
            <Bell className="feature-icon" />
            <h3>Smart Notifications</h3>
            <p>Get instant feedback when you log a class. Your data is synced securely in the cloud.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
