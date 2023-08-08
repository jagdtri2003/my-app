import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';

export default function FlightCard2({ flight, passengerCount,paymentStatus,setPaymentStatus }) {
  const price = flight.price * parseInt(passengerCount);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Generate a random number
    const randomNum = Math.floor(Math.random() * 10000);
    
    // Add a header with your travel agency name
    doc.setFontSize(20);
    doc.setTextColor(52, 58, 64); // Bootstrap's secondary color
    doc.setFont('courier', 'normal');
    doc.text('TravelKro - Flight Receipt', 35, 15); // Replace with your travel agency name

    const titleWidth = doc.getStringUnitWidth('TravelKro - Flight Receipt') * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const titleX = 35;
    const titleY = 15;
    doc.line(titleX, titleY + 2, titleX + titleWidth, titleY + 2);
    
    // Add flight details
    doc.setDrawColor(52, 58, 64); // Set border color to Bootstrap's secondary color
    doc.rect(5,5,200,100, 'S'); // Draw a border around the flight details area
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41); // Bootstrap's dark color
    doc.setFont('helvetica', 'normal');
    doc.text(`Flight Details: ${flight.name} - ${flight.flight_number}`, 10, 30);
    doc.text(`Departure: ${flight.dep_city}`, 10, 40);
    doc.text(`Destination: ${flight.arrival_city}`, 10, 50);
    doc.text(`Departure Time: ${flight.dep_time}`, 10, 60);
    doc.text(`Passengers: ${passengerCount}`, 10, 70);
    doc.text(`Total Price:${price} Rs`, 10, 80);
    doc.text('Payment Status: Successful ',10,90)

    const note = `
    Dear Valued Traveler,

    Thank you for choosing TravelKro for your journey. We're excited to be part of your adventure and are committed to making 
    your experience exceptional.

    May your flight be smooth, your destination unforgettable, and your memories everlasting.

    Safe travels and happy trails!

    Warm regards,
    TravelKro
  `;
  doc.setFontSize(10);
  doc.setTextColor(33, 37, 41);
  doc.text(note, 5, 110);
    
    // Save the PDF with a random number in the name
    doc.save(`flight_details_${randomNum}.pdf`);
  };
  
  const handlePayNowClick = () => {
    // Simulate payment processing
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success'); // Change this based on actual payment response
    }, 2500);
  };

  let buttonText;
  if (paymentStatus === 'idle') {
    buttonText = 'Pay Now';
  } else if (paymentStatus === 'processing') {
    buttonText = (
      <>
        <Spinner animation="border" size="sm" /> Processing...
      </>
    );
  } else if (paymentStatus === 'success') {
    buttonText = 'Payment Successful!';
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          {flight.name} - {flight.flight_number}
        </h5>
        <p className="card-text">Departure: {flight.dep_city}</p>
        <p className="card-text">Destination: {flight.arrival_city}</p>
        <p className="card-text">Departure Time: {flight.dep_time}</p>
        <p className="card-text">Passengers: {passengerCount}</p>
        <p className="card-text">
          Total Price: <strong>₹{price}</strong>
        </p>
        <Button
          variant={paymentStatus === 'success' ? 'success' : 'primary'}
          onClick={handlePayNowClick}
          disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
        >
          {buttonText}
        </Button>
        <br /><br/>
        {( paymentStatus==='success') &&
                <Button variant="primary" onClick={generatePDF}>
                  Download Receipt
                </Button>
        }
      </div>
    </div>
  );
}
