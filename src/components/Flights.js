import React,{useState} from 'react'
import FlightCard2 from './FlightCard2';
import { Spinner } from 'react-bootstrap';

export default function Flights() {

  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [showFlightList,setShowFlightList] =useState(false);
  const [flights, setFlights] = useState([]);
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [selectedFlight,setSelectedFlight]=useState(null);
  const [passengerCount,setPassengerCount]=useState(1);
  const [searching, setSearching] = useState(false);
  const [selectedCabinClass, setSelectedCabinClass] = useState('economy');


  const searchFlights = async (event) => {
    event.preventDefault();
    try {
      setSearching(true);
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwamj0Wcf37F6aVsdu8kuZeij-oWoPWlr667ggmPGTsLIpAfX6Q22utMBeqhPosaBilJg/exec?frm=${departureCity}&to=${destinationCity}`
      );
      const data = await response.json();
      setFlights(data.data);
      setShowFlightList(true);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }finally{
      setSearching(false);
    }
  };


  const FlightCard = ({ flight }) => {

    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{flight.name} - {flight.flight_number}</h5>
          <p className="card-text">Departure: {flight.dep_city}</p>
          <p className="card-text">Destination: {flight.arrival_city}</p>
          <p className="card-text">Departure Time: {flight.dep_time}</p>
          <p className="card-text">Price: ₹{flight.price}</p>
          <button className="btn btn-primary" onClick={() =>{ setSelectedFlight(flight) 
          setPaymentStatus("idle")}}>Select Flight</button>
        </div>
      </div>
    );
  };


  return (
    <>
    <div className='row'>
        <div className="col mt-2">
            <form onSubmit={searchFlights}>
                <div class="form-row">
                    <div class="mr-2 mb-3">
                        <label for="inputFrom">From</label>
                        <input type="text" class="form-control" id="inputFrom" placeholder="Departure City"
                        value={departureCity}
                        required 
                        onChange={(e) => {
                          setDepartureCity(e.target.value)}}
                        />
                    </div>
                    <div class="mr-2 mb-3">
                        <label for="inputTo">To</label>
                        <input type="text" class="form-control" id="inputTo" placeholder="Destination City" value={destinationCity} onChange={(e) => {setDestinationCity(e.target.value)}}  required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="mr-2 mb-3">
                        <label for="inputDepartureDate">Departure Date</label>
                        <input type="date" class="form-control" id="inputDepartureDate"
                        min={new Date().toLocaleDateString('en-CA')}
                        required/>
                    </div>
                </div>
                <div class="form-row">
                    <div class="mr-2 mb-3">
                        <label for="inputPassengerCount">Number of Passengers</label>
                        <input type="number" class="form-control" id="inputPassengerCount" min="1" value={passengerCount} onChange={(e)=>setPassengerCount(e.target.value)} required/>
                    </div>
                    <div class="mr-2 mb-3">
                        <label for="inputCabinClass">Cabin Class</label>
                        <select class="form-control" id="inputCabinClass"   value={selectedCabinClass}
                        onChange={(e) => setSelectedCabinClass(e.target.value)} required>
                            <option value="economy">Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary my-3" type="submit" >
                {searching ? (
                  <>
                    <Spinner animation="border" role="status" size="sm" />
                    &nbsp;Searching...
                  </>
                ) : (
                  'Search Flights'
                )}
                </button>
            </form>
        </div>
        <div className="col my-3 ms-1">
              {selectedFlight && (
                <div>
                  <h3>&nbsp;Selected Flight</h3>
                  <FlightCard2 flight={selectedFlight} passengerCount={passengerCount} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} Class={selectedCabinClass}/>
                </div>
              )}
        </div>
    </div>
      {showFlightList && (
        <div className="mt-4 mx-1">
          <h3>List of Available Flights</h3>
          {flights.length > 0 ? (
            <div className="row">
              {flights.map((flight) => (
                <div key={flight.id} className="col-md-4 my-2">
                  <FlightCard flight={flight}/>
                </div>
              ))}
            </div>
          ) : (
            <p>No flights found. Please try a different search.</p>
          )}
        </div>
      )}
      </>
  )
}
