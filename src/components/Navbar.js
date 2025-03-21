import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';

const profileLogoUrl = "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png";

export default function Navbar(props) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  const handleCollapseToggle = () => {
    setCollapseOpen(!collapseOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      backgroundColor: 'var(--primary-color)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0'
    }}>
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={collapseOpen}
          aria-label="Toggle navigation"
          onClick={handleCollapseToggle}
          style={{ border: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link 
          className="navbar-brand" 
          to="/" 
          style={{ 
            color: 'var(--white)',
            fontWeight: '600',
            fontSize: '1.5rem',
            transition: 'opacity 0.2s ease-in-out'
          }}
          onMouseOver={e => e.target.style.opacity = '0.8'}
          onMouseOut={e => e.target.style.opacity = '1'}
        >
          {props.title}
        </Link>
        <div className={`collapse navbar-collapse${collapseOpen ? ' show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                style={{
                  color: isActive('/') ? 'var(--white)' : 'rgba(255,255,255,0.8)',
                  fontWeight: isActive('/') ? '500' : '400',
                  transition: 'all 0.2s ease-in-out',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem'
                }}
                onMouseOver={e => e.target.style.color = 'var(--white)'}
                onMouseOut={e => e.target.style.color = isActive('/') ? 'var(--white)' : 'rgba(255,255,255,0.8)'}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/about') ? 'active' : ''}`} 
                to="/about"
                style={{
                  color: isActive('/about') ? 'var(--white)' : 'rgba(255,255,255,0.8)',
                  fontWeight: isActive('/about') ? '500' : '400',
                  transition: 'all 0.2s ease-in-out',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem'
                }}
                onMouseOver={e => e.target.style.color = 'var(--white)'}
                onMouseOut={e => e.target.style.color = isActive('/about') ? 'var(--white)' : 'rgba(255,255,255,0.8)'}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`} 
                to="/contact"
                style={{
                  color: isActive('/contact') ? 'var(--white)' : 'rgba(255,255,255,0.8)',
                  fontWeight: isActive('/contact') ? '500' : '400',
                  transition: 'all 0.2s ease-in-out',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem'
                }}
                onMouseOver={e => e.target.style.color = 'var(--white)'}
                onMouseOut={e => e.target.style.color = isActive('/contact') ? 'var(--white)' : 'rgba(255,255,255,0.8)'}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        {!collapseOpen && user && (
          <div className="ms-3">
            <Link to='/profile' style={{ textDecoration: 'none' }}>
              <img 
                title="My Profile" 
                src={profileLogoUrl} 
                alt="Profile" 
                style={{ 
                  width: '35px', 
                  height: '35px',
                  borderRadius: '50%',
                  border: '2px solid var(--white)',
                  transition: 'transform 0.2s ease-in-out'
                }}
                onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'}
              />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
};

Navbar.defaultProps = {
  title: 'Set Title Here',
};
