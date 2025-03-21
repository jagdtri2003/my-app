import React, { useState } from 'react';
import Flights from './Flights';
import Hotel from './Hotel';
import {Row, Col, Card, Button } from 'react-bootstrap';
import VerifyEmail from './VerifyEmail';
import { FaPlane, FaHotel, FaCar, FaMapMarkedAlt, FaCalendarAlt, FaUserCircle, FaSearch, FaGlobe, FaStar, FaHandshake, FaHeadset } from 'react-icons/fa';

export default function MainCard({user}) {
  const [activeTab, setActiveTab] = useState('flights');
  const [showWelcome, setShowWelcome] = useState(true);

  document.title = "TravelKro";
  let displayName = user.displayName;
  const savedDisplayName = localStorage.getItem('displayName');
  if (savedDisplayName) {
    displayName = savedDisplayName;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'flights':
        return <Flights />;
      case 'hotels':
        return <Hotel />;
      case 'cars':
        return (
          <div className="coming-soon-container">
            <h2>Car Rental Service Coming Soon</h2>
            <p>We're working on bringing you the best car rental deals!</p>
          </div>
        );
      default:
        return <Flights />;
    }
  };

  return (
    <div className="main-container fade-in">
      {displayName && showWelcome && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <FaUserCircle className="welcome-icon" />
            <div className="welcome-text">
              <h3>Welcome back, {displayName}!</h3>
              <p>Ready to plan your next adventure?</p>
            </div>
            <Button 
              variant="outline-light" 
              className="close-welcome"
              onClick={() => setShowWelcome(false)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {user.emailVerified ? (
        <>
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h1>Discover Your Dream Destinations</h1>
              <p>Experience the world with comfortable stays and memorable journeys</p>
              <div className="hero-search">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input type="text" placeholder="Search destinations, hotels, flights..." />
                </div>
                <button className="btn-custom search-button">Search</button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="container">
              <div className="row">
                <div className="col-md-3 col-sm-6 mb-4">
                  <div className="feature-card">
                    <FaGlobe className="feature-icon" />
                    <h4>Global Coverage</h4>
                    <p>Explore destinations worldwide with our extensive network of partners</p>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-4">
                  <div className="feature-card">
                    <FaStar className="feature-icon" />
                    <h4>Best Deals</h4>
                    <p>Get exclusive offers and discounts on hotels and flights</p>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-4">
                  <div className="feature-card">
                    <FaHandshake className="feature-icon" />
                    <h4>Trusted Partners</h4>
                    <p>We work with reliable partners to ensure a quality experience</p>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-4">
                  <div className="feature-card">
                    <FaHeadset className="feature-icon" />
                    <h4>24/7 Support</h4>
                    <p>Our customer support team is available around the clock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Main Booking Section */}
          <div className="booking-container">
            <div className="booking-tabs">
              <button 
                className={`tab-button ${activeTab === 'flights' ? 'active' : ''}`}
                onClick={() => setActiveTab('flights')}
              >
                <FaPlane className="tab-icon" />
                <span>Flights</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'hotels' ? 'active' : ''}`}
                onClick={() => setActiveTab('hotels')}
              >
                <FaHotel className="tab-icon" />
                <span>Hotels</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'cars' ? 'active' : ''}`}
                onClick={() => setActiveTab('cars')}
              >
                <FaCar className="tab-icon" />
                <span>Cars</span>
              </button>
            </div>

            <div className="tab-content">
              {renderTabContent()}
            </div>

            <div className="quick-actions">
              <Row className="g-4">
                <Col md={4}>
                  <Card className="quick-action-card">
                    <Card.Body>
                      <FaMapMarkedAlt className="action-icon" />
                      <h5>Popular Destinations</h5>
                      <p>Explore trending travel spots</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="quick-action-card">
                    <Card.Body>
                      <FaCalendarAlt className="action-icon" />
                      <h5>Special Deals</h5>
                      <p>Limited time offers</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="quick-action-card">
                    <Card.Body>
                      <FaUserCircle className="action-icon" />
                      <h5>Travel Tips</h5>
                      <p>Expert travel advice</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>


          {/* Newsletter Section */}
          <div className="newsletter-section">
            <div className="newsletter-content">
              <h3>Subscribe to Our Newsletter</h3>
              <p>Get the latest travel deals, offers, and tips straight to your inbox.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email address" />
                <button className="btn-custom">Subscribe</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <VerifyEmail user={user} />
      )}
    </div>
  );
}
