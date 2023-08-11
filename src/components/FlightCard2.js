import React, { useState } from 'react';
import { Button, Spinner,Modal } from 'react-bootstrap';
import jsPDF from 'jspdf';
import PaymentGateway from './PaymentGateway';
import { serverTimestamp,doc,setDoc } from 'firebase/firestore';
import { db } from './Firebase';


export default function FlightCard2({ flight, passengerCount,paymentStatus,setPaymentStatus,Class }) {

  const calculateUpdatedPrice = () => {
    if (Class === 'business') {
      return flight.price * 1.5; // Increase price by 50% for business class
    } else if (Class === 'first') {
      return flight.price * 2; // Double the price for first class
    } else {
      return flight.price; // Keep the original price for economy class
    }
  };
  let pr=calculateUpdatedPrice();
  const price = pr * parseInt(passengerCount);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refId,setRefId] = useState(""); 




  function generateReferenceId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8; // Set the desired length of the reference ID
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    

    const receiptGeneratedAt = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(refId)}&size=100x100`;

    // Add the QR code image to the PDF
    const img = new Image();
    img.src = qrCodeImageUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG',130,30,50,50);
    
      // Add a header with your travel agency name
      doc.setFontSize(20);
      doc.setTextColor(52, 58, 64); // Bootstrap's secondary color
      doc.setFont('courier', 'normal');
      doc.text('TravelKro - Flight Receipt', 40, 15); // Replace with your travel agency name

      const titleWidth = doc.getStringUnitWidth('TravelKro - Flight Receipt') * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const titleX = 40;
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
      doc.text('Payment Status: ',10,90);
      doc.setTextColor(0, 128, 0); // RGB color for green
      doc.text('Successful',49, 90);
      doc.setTextColor(33, 37, 41);
      doc.text(`Reference Id: ${refId}`,130,90);
      doc.setFontSize(8);
      doc.text(`Receipt Generated At: ${receiptGeneratedAt}`, 10, 100);

      const note = `
      Dear Valued Traveler,

      Thank you for choosing TravelKro for your journey. We're excited to be part of your adventure and are committed to making 
      your experience exceptional.

      May your flight be smooth, your destination unforgettable, and your memories everlasting.

      Safe travels and happy trails!

      Warm regards,
      Jagdamba Tripathi
    `;
    doc.setFontSize(10);
    doc.setTextColor(33, 37, 41);
    doc.text(note, 5, 110);
      
      // Save the PDF with a random number in the name
      doc.save(`flight_details_${refId}.pdf`);
    };
  }
  const handlePayNowClick = async () => {
    // Simulate payment processing
    setPaymentStatus('processing');
    setShowPaymentModal(true);
    setRefId(generateReferenceId());
    }
    //Saving to DB
    const saveBookingDataToFirestore = async () => {    
      const bookingRef = doc(db, 'flights',refId);
      const bookingData = {
        flightName: flight.name,
        flightNumber: flight.flight_number,
        departureCity: flight.dep_city,
        arrivalCity: flight.arrival_city,
        departureTime: flight.dep_time,
        passengerCount,
        totalPrice: price,
        bookingTime: serverTimestamp(),
        paymentStatus: 'success',
      };
    
      try {
        await setDoc(bookingRef, bookingData);
        console.log('Booking data saved successfully:', refId);
      } catch (error) {
        console.error('Error adding booking:', error);
      }
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
    saveBookingDataToFirestore();
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
      <Modal show={showPaymentModal} onHide={() => {setShowPaymentModal(false)
      setPaymentStatus('idle')}} onClose={() => {setShowPaymentModal(false)}  } centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Gateway</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render the PaymentGateway component inside the modal */}
          <PaymentGateway setPaymentStatus={setPaymentStatus} onClose={() => {setShowPaymentModal(false)}} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
