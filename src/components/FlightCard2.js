import React from 'react'

export default function FlightCard2({flight,passengerCount}) {
    const price=flight.price*parseInt(passengerCount);
  return (
    <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">{flight.name} - {flight.flight_number}</h5>
      <p className="card-text">Departure: {flight.dep_city}</p>
      <p className="card-text">Destination: {flight.arrival_city}</p>
      <p className="card-text">Departure Time: {flight.dep_time}</p>
      <p className="card-text">Passengers: {passengerCount}</p>
      <p className="card-text">Total Price: <strong>₹{price}</strong></p>
      <button className="btn btn-success">Pay Now</button>
    </div>
  </div>
  )
}
