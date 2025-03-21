import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About TravelKro</h4>
          <p>Your trusted partner for seamless travel experiences. We offer the best deals on flights, hotels, and car rentals worldwide.</p>
          <div className="social-links">
            <a href="#" className="social-link"><FaFacebook /></a>
            <a href="#" className="social-link"><FaTwitter /></a>
            <a href="#" className="social-link"><FaInstagram /></a>
            <a href="#" className="social-link"><FaLinkedin /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Services</h4>
          <ul className="footer-links">
            <li><Link to="/">Flights</Link></li>
            <li><Link to="/">Hotels</Link></li>
            <li><Link to="/">Car Rentals</Link></li>
            <li><Link to="/">Travel Insurance</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li>
              <FaPhone className="contact-icon" />
              <span>+91 9876543210</span>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <span>jagdtri2003@gmail.com</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Prayagraj, Uttar Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} TravelKro. All rights reserved.</p>
          <p>Made with ❤️ by Jagdamba Tripathi</p>
        </div>
      </div>
    </footer>
  );
}