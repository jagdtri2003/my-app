import React from 'react';
import { FaCode, FaHeart, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function About() {
  return (
    <div className="about-container fade-in">
      <div className="about-header">
        <h1>About TravelKro</h1>
        <p>Your one-stop destination for seamless travel planning</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            TravelKro aims to make travel planning easier and more accessible for everyone.
            We provide a comprehensive platform for booking flights, hotels, and car rentals
            while ensuring the best deals and user experience.
          </p>
        </div>

        <div className="about-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <FaCode className="feature-icon" />
              <h3>Modern Technology</h3>
              <p>Built with cutting-edge web technologies for a smooth experience</p>
            </div>
            <div className="feature-item">
              <FaHeart className="feature-icon" />
              <h3>User-First Approach</h3>
              <p>Designed with user experience and satisfaction in mind</p>
            </div>
          </div>
        </div>

        <div className="developer-section">
          <h2>Meet the Developer</h2>
          <div className="developer-card">
            <div className="developer-info">
              <h3>Jagdamba Tripathi</h3>
              <p className="developer-title">Full Stack Developer</p>
              <p className="developer-bio">
                A passionate developer dedicated to creating innovative web solutions.
                Specializing in React, Node.js, and modern web technologies.
              </p>
            </div>
            <div className="developer-social">
              <a href="https://github.com/jagdtri2003" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/jagdamba-tripathi/" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="mailto:jagdtri2003@gmail.com" className="social-link">
                <FaEnvelope /> Email
              </a>
            </div>
          </div>
        </div>

        <div className="tech-stack">
          <h2>Technologies Used</h2>
          <div className="tech-grid">
            <div className="tech-item">React.js</div>
            <div className="tech-item">Firebase</div>
            <div className="tech-item">Bootstrap</div>
            <div className="tech-item">React Router</div>
            <div className="tech-item">CSS3</div>
            <div className="tech-item">JavaScript</div>
          </div>
        </div>
      </div>
    </div>
  );
}
