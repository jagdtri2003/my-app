import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';


const profileLogoUrl = "https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png";

export default function Navbar(props) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    onAuthStateChanged(auth,(authUser)=>{
      // console.log(authUser);
      setUser(authUser);
    })
  })

  const handleCollapseToggle = () => {
    setCollapseOpen(!collapseOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#45526e' }}>
      <div className="container-fluid">
        <button
          className="navbar-toggler order-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={collapseOpen}
          aria-label="Toggle navigation"
          onClick={handleCollapseToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand mx-auto pe-4 order-1" to="/" style={{ color: '#fff', fontFamily: 'Cherry Bomb One' }}>
          {props.title}
        </Link>
        <div className={`collapse navbar-collapse order-2${collapseOpen ? ' show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        {!collapseOpen && user && (
          <div className="order-3">
            <a href='/profile'>
            <img title="My Profile" src={profileLogoUrl} alt="Profile" style={{ width: '30px', height: '30px',borderRadius: '50%' }} />
            </a>
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
