import React from 'react'


const handleSubmit = () => {
    console.log('Form submitted!')
  }

export default function Hotel() {
  return (
    <form onSubmit={handleSubmit}>
    <div className="form-row">
      <div className="col-md-6 mb-3">
        <label htmlFor="inputDestination">Destination</label>
        <input
          type="text"
          className="form-control"
          id="inputDestination"
          placeholder="City or Hotel Name"
          required
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="inputCheckInDate">Check-in Date</label>
        <input
          type="date"
          className="form-control"
          id="inputCheckInDate"
          required
        />
      </div>
    </div>
    <div className="form-row">
      <div className="col-md-6 mb-3">
        <label htmlFor="inputCheckOutDate">Check-out Date</label>
        <input
          type="date"
          className="form-control"
          id="inputCheckOutDate"
          required
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="inputGuestCount">Number of Guests</label>
        <input
          type="number"
          className="form-control"
          id="inputGuestCount"
          min="1"
          required
        />
      </div>
    </div>
    <div className="form-row">
      <div className="col-md-6 mb-3">
        <label htmlFor="inputRoomType">Room Type</label>
        <select
          className="form-control"
          id="inputRoomType"
          required
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="twin">Twin</option>
          <option value="suite">Suite</option>
        </select>
      </div>
    </div>
    <div className="form-row">
      <div className="col-md-6 mb-3">
        <label htmlFor="inputEmail">Email</label>
        <input
          type="email"
          className="form-control"
          id="inputEmail"
          placeholder="example@example.com"
          required
        />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="inputPhone">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          id="inputPhone"
          placeholder="Enter phone number"
          required
        />
      </div>
    </div>
    <div className="form-group">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="inputBreakfast"
        />
        <label className="form-check-label" htmlFor="inputBreakfast">
          Include Breakfast
        </label>
      </div>
    </div>
    <button type="submit" className="btn btn-primary my-3">
      Book Now
    </button>
  </form>
  )
}

