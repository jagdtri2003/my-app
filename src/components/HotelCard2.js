import React from 'react'

export default function HotelCard2({hotel,buttontxt,checkInDate,checkOutDate}) {

    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24); // Calculate the number of days

    // Assuming hotel.price is in '₹XXXX' format
    const pricePerNight = parseInt(hotel.price.replace(/\D/g, ''));
    const total = pricePerNight * numberOfDays;
    // setTotalPrice('₹' + total);


  return (
    <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">{hotel.name}</h5>
      <h6 className="card-subtitle mb-2 text-muted">{hotel.location}</h6>
      <p className="card-text">{hotel.description}</p>
      <p className="card-text">Price: {hotel.price}</p>
      <p className="card-text">Price for {numberOfDays} Days: ₹{total}</p>
      <button className="btn btn-primary">{buttontxt}</button>
    </div>
  </div>
  )
}
