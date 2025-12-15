// File: frontend/src/components/Navigation.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hide navigation on landing page
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleAdminClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login');
    }
  };

  // Don't render navigation on landing page
  if (isLandingPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>📋 Employee Feedback System</h2>
          </Link>
        </div>
        <div className="nav-links">
          <Link 
            to="/feedback" 
            className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
          >
            Feedback Form
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={handleAdminClick}
          >
            Admin Dashboard
          </Link>
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="nav-link nav-link-button"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
