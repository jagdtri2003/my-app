import React,{useState} from 'react'

const handleSubmit = () => {
    console.log('Form submitted!')
}

const hotels = [
  {
    id: 1,
    name: 'Hotel A',
    location: 'City X',
    price: '$100',
    description: 'A beautiful hotel in the heart of City X.',
  },
  {
    id: 2,
    name: 'Hotel B',
    location: 'City Y',
    price: '$150',
    description: 'A luxury hotel with stunning views in City Y.',
  },
  {
    id: 3,
    name: 'Hotel C',
    location: 'City Z',
    price: '$80',
    description: 'An affordable hotel with great amenities in City Z.',
  },
  // Add more hotel objects as needed
];

const HotelCard = ({ hotel }) => {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{hotel.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{hotel.location}</h6>
          <p className="card-text">{hotel.description}</p>
          <p className="card-text">Price: {hotel.price}</p>
          <button className="btn btn-primary">Book Now</button>
        </div>
      </div>
    );
};




export default function Hotel() {

    
const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
};

    const [searchQuery, setSearchQuery] = useState('');
  
    const filteredHotels = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  return (
    <>
    <form onSubmit={handleSubmit}>
    <div className="form-row">
      <div className="col-md-6 mb-3">
        <label htmlFor="inputDestination">Destination</label>
        <input
          type="text"
          className="form-control"
          id="inputDestination"
          placeholder="City or Hotel Name"
          value={searchQuery}
          onChange={handleSearchChange}
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
  <div className="mt-3">
        <h3>List of Hotels</h3>
        {filteredHotels.length > 0 ? (
          <div className="row">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="col-md-4">
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        ) : (
          <p>No hotels found. Please try a different search.</p>
        )}
    </div>
  </>
  )
}

