import React from 'react'

export default function Flights() {
  return (
    <div className='container'>
        <form>
            <div class="form-row">
                <div class="col-md-5 mb-3">
                    <label for="inputFrom">From</label>
                    <input type="text" class="form-control" id="inputFrom" placeholder="Departure City" required/>
                </div>
                <div class="col-md-5 mb-3">
                    <label for="inputTo">To</label>
                    <input type="text" class="form-control" id="inputTo" placeholder="Destination City" required/>
                </div>
            </div>
            <div class="form-row">
                <div class="col-md-5 mb-3">
                    <label for="inputDepartureDate">Departure Date</label>
                    <input type="date" class="form-control" id="inputDepartureDate" required/>
                </div>
            </div>
            <div class="form-row">
                <div class="col-md-5 mb-3">
                    <label for="inputPassengerCount">Number of Passengers</label>
                    <input type="number" class="form-control" id="inputPassengerCount" min="1" required/>
                </div>
                <div class="col-md-5 mb-3">
                    <label for="inputCabinClass">Cabin Class</label>
                    <select class="form-control" id="inputCabinClass" required>
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-primary" type="submit">Search Flights</button>
        </form>
    </div>
  )
}
