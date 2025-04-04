import React,{useState} from 'react'
import HotelCard2 from './HotelCard2';
import { Spinner } from 'react-bootstrap';


export default function Hotel() {

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [showHotelList, setShowHotelList] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [searching,setSearching] = useState(false);
    const [numberOfRoom,setNumberOfRoom] = useState(1);

    const fetchHotelsFromApi = async () => {
      try {
        setSearching(true);
        const response = await fetch(
          `https://script.google.com/macros/s/AKfycbxkZonoYDVcW_MKHro8ESK1W-1AyYu8MuCBP_g-T6CPgmzNa1BCrp5TPEC-UPXC2d6NOQ/exec?query=${searchQuery}`
        );
        const data = await response.json();
        setHotels(data.data);
        setShowHotelList(true);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }finally{
        setSearching(false);
      }
    };

    const HotelCard = ({ hotel,buttontxt }) => {
      return (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{hotel.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{hotel.location}</h6>
            <p className="card-text">{hotel.description}</p>
            <p className="card-text">Price/Day : {hotel.price}</p>
            <button className="btn btn-primary" onClick={() =>{ setSelectedHotel(hotel)
            setPaymentStatus("idle")
            }}>{buttontxt}</button>
          </div>
        </div>
      );
  };

    const handleSubmit = (event) => {
      event.preventDefault();
      fetchHotelsFromApi();
    };
  
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      // setSelectedHotel(null); // Reset selectedHotel when the user searches again
      // setShowHotelList(false);
    };

    // const handleCheckInDateChange = (event) => {
    //   const selectedCheckInDate = event.target.value;
    //   const maxCheckInDate = new Date(checkOutDate);
    //   maxCheckInDate.setDate(maxCheckInDate.getDate() - 1);
  
    //   if (selectedCheckInDate > maxCheckInDate.toISOString().slice(0, 10)) {
    //     // If the selected check-out date is before the minimum allowed date,
    //     // update the check-out date to the minimum allowed date.
    //     setCheckInDate(maxCheckInDate.toISOString().slice(0, 10));
    //   } else {
    //     setCheckInDate(selectedCheckInDate);
    //   }
    // };

    const handleCheckInDateChange = (event) => {
      setCheckInDate(event.target.value)
    }
    
    const handleBookNow = (hotel) => {
      setSelectedHotel(hotel);
    };

    const handleCheckOutDateChange = (event) => {
      const selectedCheckOutDate = event.target.value;
      const minimumCheckOutDate = new Date(checkInDate);
      minimumCheckOutDate.setDate(minimumCheckOutDate.getDate() + 1);
  
      if (selectedCheckOutDate < minimumCheckOutDate.toISOString().slice(0, 10)) {
        // If the selected check-out date is before the minimum allowed date,
        // update the check-out date to the minimum allowed date.
        setCheckOutDate(minimumCheckOutDate.toISOString().slice(0, 10));
      } else {
        setCheckOutDate(selectedCheckOutDate);
      }
    };

  return (
    <>
    <div className="row">
      <div className='col'>
        <form onSubmit={handleSubmit} className="my-2">
        <div className="form-row">
          <div className="mb-3">
            <label htmlFor="inputDestination">Hotel Name or Location</label>
            <input
              type="text"
              className="form-control"
              id="inputDestination"
              placeholder="Hotel Name or Location"
              value={searchQuery}
              onChange={handleSearchChange}
              required 
            />
          </div>
          <div className=" mb-3">
            <label htmlFor="inputCheckInDate">Check-in Date</label>
            <input
              type="date"
              className="form-control"
              id="inputCheckInDate"
              value={checkInDate}
              onChange={handleCheckInDateChange}
              min={new Date().toLocaleDateString('en-CA')}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className=" mb-3">
            <label htmlFor="inputCheckOutDate">Check-out Date</label>
            <input
              type="date"
              className="form-control"
              id="inputCheckOutDate"
              value={checkOutDate}
              onChange={handleCheckOutDateChange}
              required
            />
          </div>
          <div className=" mb-3">
            <label htmlFor="inputGuestCount">Number of Rooms</label>
            <input
              type="number"
              className="form-control"
              id="inputGuestCount"
              value={numberOfRoom}
              onChange={(e)=>{
                  setNumberOfRoom(e.target.value);
              }}
              min="1"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className=" mb-3">
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
        {/* <div className="form-col">
          <div className=" mb-3">
            <label htmlFor="inputPhone">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="inputPhone"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div> */}
        <button type="submit" className="btn btn-primary my-3">
                {searching ? (
                  <>
                    <Spinner animation="border" role="status" size="sm" />
                    &nbsp;Searching...
                  </>
                ) : (
                  'Search Hotels'
                )}      
        </button>
      </form>
    </div>
    <div className="col my-3 ms-1">
              {selectedHotel && (
                <div>
                  <h3>&nbsp;Selected Hotel</h3>
                  <HotelCard2 hotel={selectedHotel} buttontxt="Pay Now" checkInDate={checkInDate} checkOutDate={checkOutDate} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} numberOfRoom={numberOfRoom}/>
                </div>
              )}
    </div>
  </div>
  {showHotelList && (
        <div className="mt-3">
          <h3>List of Available Hotels</h3>
          {hotels.length > 0 ? (
            <div className="row">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="col-md-4">
                  <HotelCard hotel={hotel} buttontxt="Book Now" />
                </div>
              ))}
            </div>
          ) : (
            <p>No hotels found. Please try a different search.</p>
          )}
        </div>
      )}
  </>
  )
}

