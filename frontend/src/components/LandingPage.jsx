import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Top Navigation */}
      <div className="landing-nav">
        <div className="landing-nav-container">
          <div className="nav-brand-landing">
            <h2>📋 Employee Feedback System</h2>
          </div>
          <Link to="/login" className="btn-admin-nav">
            <span className="btn-icon">🔐</span>
            Admin Login
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Employee Feedback System
            </h1>
            <p className="hero-subtitle">
              Empowering voices, driving growth. Share your thoughts and help us build a better workplace together.
            </p>
            <div className="hero-buttons">
              <Link to="/feedback" className="btn btn-primary">
                <span className="btn-icon">📝</span>
                Submit Feedback
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon">💬</div>
              <div className="card-text">Real-time Feedback</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">📊</div>
              <div className="card-text">Analytics Dashboard</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🎯</div>
              <div className="card-text">Actionable Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Easy to Use</h3>
              <p>Simple and intuitive interface designed for quick feedback submission</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your feedback is protected with enterprise-grade security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Updates</h3>
              <p>Instant feedback delivery to admin dashboard for quick response</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Comprehensive Analytics</h3>
              <p>Track and analyze feedback trends across departments</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Make Your Voice Heard?</h2>
          <p className="cta-text">
            Join thousands of employees who are shaping the future of their workplace
          </p>
          <Link to="/feedback" className="btn btn-cta">
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2025 Employee Feedback System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
