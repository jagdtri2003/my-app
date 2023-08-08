import React from 'react';

export default function About() {
  document.title="TravelKro-About Us";
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-6">
          <h2>About Us</h2>
          <p>
            Welcome to TravelKro, your ultimate travel companion! We are passionate about helping you discover the world's most amazing destinations.
          </p>
          <p>
            Our team of travel enthusiasts works tirelessly to provide you with the best travel tips, guides, and resources to make your journeys unforgettable.
          </p>
        </div>
        <div className="col-lg-6">
          <img
            src="https://p7.hiclipart.com/preview/102/609/191/package-tour-flight-travel-website-vacation-travel.jpg"
            alt="About Us"
            className="img-fluid rounded"
            height="400px" width="400px"
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <h3>Our Mission</h3>
          <p>
            At TravelKro, our mission is to inspire and empower travelers to explore new horizons, experience diverse cultures, and create lasting memories.
          </p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <h3>Why Choose Us?</h3>
          <p>
            With our extensive travel guides, insider tips, and curated recommendations, you can plan your dream vacation with confidence and ease.
          </p>
          <p>
            Join our community of passionate travelers and embark on a journey of discovery and adventure with TravelKro!
          </p>
        </div>
      </div>
    </div>
  );
}
