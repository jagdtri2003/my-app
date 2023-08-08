import React from 'react';

export default function ContactUs() {
  document.title="TravelKro-Contact Us";
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-12">
          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? Feel free to reach out to us anytime. We're here to assist you on your travel journey.
          </p>
          <p>
            You can contact us via email, phone, or by filling out the form below. We'll get back to you as soon as possible.
          </p>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-6 my-3">
          <h3>Contact Form</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea className="form-control" id="message" rows="4"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
        <div className="col-lg-6 my-3">
          <h3>Contact Information</h3>
          <p>Email: contact@travelkro.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
}
