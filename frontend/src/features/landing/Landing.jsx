import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Target, Activity, ShieldCheck, Zap, ArrowRight, BookOpen } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const heroRef = useRef(null);
  const mockupRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Hero Text Animation
    gsap.fromTo('.hero-badge', 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo('.hero-title-main', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo('.hero-subtitle', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo('.hero-cta', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
    );

    // Mockup Floating Animation
    gsap.fromTo('.mockup-image',
      { y: 100, opacity: 0, rotationX: 10 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1.5, ease: 'power3.out', delay: 0.8 }
    );
    gsap.to('.mockup-image', {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2.3
    });

    // Features Stagger Animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo('.feature-card', 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
          );
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
  }, []);

  return (
    <div className="landing-wrapper">
      <div className="landing-bg-glow"></div>
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo-container">
            <img src="/favicon.png" alt="LastBench Logo" className="nav-logo-img" />
            <span className="nav-logo-text">LastBench</span>
          </div>
          <div className="nav-links">
            <Link to="/auth" className="btn-secondary">Log In</Link>
            <Link to="/auth" state={{ isSignUp: true }} className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse"></span> LastBench 2.0 is Here
            </div>
            <h1 className="hero-title-main">
              Master Your Attendance. <br />
              <span className="text-gradient">Never Fall Behind.</span>
            </h1>
            <p className="hero-subtitle">
              The smartest, most beautiful way to track your academic presence. 
              Set target thresholds, know exactly how many classes you can safely skip, 
              and visualize your semester effortlessly.
            </p>
            <div className="hero-cta">
              <Link to="/auth" state={{ isSignUp: true }} className="btn-primary btn-large cta-button">
                Start Tracking Free <ArrowRight size={20} className="cta-icon" />
              </Link>
              <p className="cta-subtext">No credit card required. Setup in 30 seconds.</p>
            </div>
          </div>
          
          <div className="hero-mockup" ref={mockupRef}>
            <div className="mockup-glow"></div>
            <img src="/mockup.png" alt="LastBench Dashboard Preview" className="mockup-image" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="section-header">
          <h2>Everything you need to survive the semester.</h2>
          <p>Built by students, for students. We took the stress out of attendance tracking.</p>
        </div>
        
        <div className="features-grid">
          <div className="glass-panel feature-card">
            <div className="feature-icon-wrapper" style={{background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)'}}>
              <Target size={28} />
            </div>
            <h3>Smart Thresholds</h3>
            <p>Set a global default criteria like 75%, or customize it per subject. We do the math to keep you safe.</p>
          </div>
          
          <div className="glass-panel feature-card">
            <div className="feature-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>
              <Activity size={28} />
            </div>
            <h3>Bunk Predictor</h3>
            <p>Instantly know exactly how many classes you can afford to miss without dropping below your target.</p>
          </div>
          
          <div className="glass-panel feature-card">
            <div className="feature-icon-wrapper" style={{background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)'}}>
              <BookOpen size={28} />
            </div>
            <h3>Semester Segregation</h3>
            <p>Keep your academic history clean. Subjects and logs are strictly bound to active semesters.</p>
          </div>

          <div className="glass-panel feature-card">
            <div className="feature-icon-wrapper" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)'}}>
              <ShieldCheck size={28} />
            </div>
            <h3>Danger Zone Alerts</h3>
            <p>Visual warnings and banners appear immediately when you slip below your required attendance.</p>
          </div>

          <div className="glass-panel feature-card">
            <div className="feature-icon-wrapper" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6'}}>
              <Zap size={28} />
            </div>
            <h3>Lightning Fast</h3>
            <p>A modernized, extremely responsive dashboard built with React and advanced View Transitions.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="logo-container" style={{justifyContent: 'center', marginBottom: '1.5rem'}}>
            <img src="/favicon.png" alt="LastBench Logo" className="nav-logo-img" style={{width:'32px', height:'32px'}} />
            <span className="nav-logo-text" style={{fontSize: '1.5rem'}}>LastBench</span>
          </div>
          <p>© {new Date().getFullYear()} LastBench App. Developed with precision.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
