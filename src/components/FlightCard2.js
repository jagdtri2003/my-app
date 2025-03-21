import React, { useState, useEffect } from 'react';
import { Button, Spinner, Modal, Badge } from 'react-bootstrap';
import jsPDF from 'jspdf';
import PaymentGateway from './PaymentGateway';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FaPlane, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserFriends, FaRupeeSign, FaDownload, FaCheckCircle, FaCreditCard } from 'react-icons/fa';

export default function FlightCard2({ flight, passengerCount, paymentStatus, setPaymentStatus, Class }) {
  const [user, setUser] = useState(null);
  const [datasaved, setDatasaved] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refId, setRefId] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Proper authentication state handling with useEffect and cleanup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      }
    });
    
    // Return cleanup function to prevent memory leaks
    return () => unsubscribe();
  }, []);

  const calculateUpdatedPrice = () => {
    if (Class === 'business') {
      return flight.price * 1.5; // Increase price by 50% for business class
    } else if (Class === 'first') {
      return flight.price * 2; // Double the price for first class
    } else {
      return flight.price; // Keep the original price for economy class
    }
  };
  
  let pr = calculateUpdatedPrice();
  const price = pr * parseInt(passengerCount);

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

  const handlePayNowClick = () => {
    if (!user) {
      alert("Please login to continue with payment");
      return;
    }
    
    setPaymentStatus('processing');
    setShowPaymentModal(true);
    setRefId(generateReferenceId());
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add background color to the whole page
    doc.setFillColor(248, 250, 252); // Light background
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add colored header bar - shorter so it doesn't overlap QR code
    doc.setFillColor(37, 99, 235); // Primary color
    doc.rect(0, 0, 210, 25, 'F');
    
    // Add header text
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); // White color
    doc.setFont("helvetica", "bold");
    doc.text('TravelKro', 15, 15);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text('E-TICKET / RECEIPT', 15, 22);
    
    // Generate QR code - moved below header to prevent overlap
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(refId)}&size=100x100`;
    const img = new Image();
    img.src = qrCodeImageUrl;
    
    img.onload = () => {
      // First draw a white background for QR code to ensure it's visible
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(150, 5, 50, 50, 3, 3, 'F');
      doc.addImage(img, 'PNG', 155, 10, 40, 40);
      
      // Booking reference
      doc.setFillColor(241, 245, 249); // Lighter gray
      doc.roundedRect(10, 35, 130, 25, 2, 2, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // Slate-500 color
      doc.text('BOOKING REFERENCE:', 15, 45);
      
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59); // Slate-800 color
      doc.setFont("helvetica", "bold");
      doc.text(refId, 75, 45);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // Slate-500 color
      doc.text('KEEP THIS NUMBER FOR REFERENCE', 15, 53);
      
      // Flight info section
      doc.setFillColor(255, 255, 255); // White background
      doc.roundedRect(10, 70, 190, 70, 2, 2, 'F');
      
      // Route header
      doc.setFillColor(37, 99, 235, 0.1); // Light blue bg
      doc.rect(10, 70, 190, 15, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235); // Primary color
      doc.setFont("helvetica", "bold");
      // Using text instead of symbol for arrow
      doc.text(`${flight.dep_city} to ${flight.arrival_city}`, 15, 80);
      
      // Flight details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 41, 59); // Slate-800 color
      
      // First column
      doc.text('Airline:', 15, 95);
      doc.text('Flight:', 15, 105);
      doc.text('Departure City:', 15, 115);
      doc.text('Departure Time:', 15, 125);
      
      // First column values
      doc.setFont("helvetica", "bold");
      doc.text(flight.name, 70, 95);
      doc.text(flight.flight_number, 70, 105);
      doc.text(flight.dep_city, 70, 115);
      doc.text(flight.dep_time, 70, 125);
      
      // Second column
      doc.setFont("helvetica", "normal");
      doc.text('Class:', 120, 95);
      doc.text('Passengers:', 120, 105);
      doc.text('Arrival City:', 120, 115);
      
      // Second column values
      doc.setFont("helvetica", "bold");
      doc.text(Class.charAt(0).toUpperCase() + Class.slice(1), 160, 95);
      doc.text(passengerCount.toString(), 160, 105);
      doc.text(flight.arrival_city, 160, 115);
      
      // Cost section
      doc.setFillColor(241, 245, 249); // Lighter gray
      doc.roundedRect(10, 150, 190, 25, 2, 2, 'F');
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // Slate-500 color
      doc.text('TOTAL COST:', 15, 160);
      
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129); // Green-500 color
      doc.setFont("helvetica", "bold");
      // Using INR instead of ₹ symbol to ensure compatibility
      doc.text(`INR ${price.toLocaleString('en-IN')}`, 90, 160);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // Slate-500 color
      doc.text('PAYMENT COMPLETED SUCCESSFULLY', 15, 168);
      
      // Important information
      doc.setFillColor(254, 242, 242, 0.5); // Light red bg
      doc.roundedRect(10, 185, 190, 50, 2, 2, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(239, 68, 68); // Red-500 color
      doc.setFont("helvetica", "bold");
      doc.text('IMPORTANT INFORMATION:', 15, 195);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // Slate-500 color
      doc.text('1. Please arrive at the airport at least 2 hours before the scheduled departure.', 15, 205);
      doc.text('2. Carry a valid photo ID proof for verification at the airport.', 15, 213);
      doc.text('3. Baggage allowance is subject to airline policy and cabin class.', 15, 221);
      doc.text('4. For any changes or cancellations, contact our customer support.', 15, 229);
      
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // Slate-400 color
      doc.text(`E-Ticket generated on: ${new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })}`, 10, 280);
      
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235); // Primary color
      doc.text('TravelKro | jagdtri2003@gmail.com | +91 9876543210', 10, 288);
      
      // Save the PDF
      doc.save(`TravelKro_Flight_${refId}.pdf`);
    };
  };

  //Saving to DB
  const saveBookingDataToFirestore = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    
    if (!datasaved) {
      try {
        const bookingRef = doc(db, 'flights', refId);
        const bookingData = {
          userEmail: user.email,
          username: user.displayName,
          flightName: flight.name,
          flightNumber: flight.flight_number,
          departureCity: flight.dep_city,
          arrivalCity: flight.arrival_city,
          departureTime: flight.dep_time,
          cabinClass: Class,
          passengerCount,
          totalPrice: price,
          referenceId: refId,
          bookingTime: serverTimestamp(),
          paymentStatus: 'success',
        };
        
        const bookingTime = new Date();
        await setDoc(bookingRef, bookingData);
        // Format the date and time
        const formattedBookingTime = bookingTime.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
        bookingData.bookingTime = formattedBookingTime;
        const response = await fetch('https://server-travelkro.vercel.app/flight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });
        console.log('Booking data saved successfully:', refId);
        console.log(response);
        setDatasaved(true);
      } catch (error) {
        console.error('Error adding booking:', error);
      }
    }
  };

  let buttonText;
  if (paymentStatus === 'idle') {
    buttonText = (
      <>
        <FaCreditCard className="me-2" /> Pay Now
      </>
    );
  } else if (paymentStatus === 'processing') {
    buttonText = (
      <>
        <Spinner animation="border" size="sm" className="me-2" /> Processing...
      </>
    );
  } else if (paymentStatus === 'success') {
    buttonText = (
      <>
        <FaCheckCircle className="me-2" /> Payment Successful!
      </>
    );
  }

  useEffect(() => {
    if (paymentStatus === 'success' && !datasaved && user) {
      saveBookingDataToFirestore();
    }
  }, [paymentStatus, datasaved, user]);

  const getCabinClassBadge = () => {
    if (Class === 'business') {
      return <Badge bg="primary">Business Class</Badge>;
    } else if (Class === 'first') {
      return <Badge bg="warning" text="dark">First Class</Badge>;
    } else {
      return <Badge bg="info">Economy Class</Badge>;
    }
  };

  return (
    <div 
      className="flight-card2-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flight-card2-header">
        <div className="airline-logo">
          <FaPlane className="plane-icon" />
        </div>
        <div className="flight-details">
          <h4>{flight.name}</h4>
          <div className="flight-number">{flight.flight_number}</div>
        </div>
        <div className="cabin-class">
          {getCabinClassBadge()}
        </div>
      </div>
      
      <div className="flight-card2-route">
        <div className="departure">
          <div className="city">{flight.dep_city}</div>
          <div className="time">
            <FaClock className="route-icon" /> {flight.dep_time}
          </div>
        </div>
        <div className="route-line">
          <div className="plane-animation" style={{ left: isHovered ? '70%' : '30%' }}>
            <FaPlane />
          </div>
        </div>
        <div className="arrival">
          <div className="city">{flight.arrival_city}</div>
          <div className="time">
            <FaMapMarkerAlt className="route-icon" /> Arrival
          </div>
        </div>
      </div>
      
      <div className="flight-card2-info">
        <div className="info-row">
          <div className="info-item">
            <FaUserFriends className="info-icon" />
            <div>
              <div className="info-label">Passengers</div>
              <div className="info-value">{passengerCount}</div>
            </div>
          </div>
          <div className="info-item">
            <FaRupeeSign className="info-icon" />
            <div>
              <div className="info-label">Total Price</div>
              <div className="info-value price-value">₹{price}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flight-card2-actions">
        <Button
          variant={paymentStatus === 'success' ? 'success' : 'primary'}
          className={`flight-action-button ${paymentStatus === 'success' ? 'success-button' : ''}`}
          onClick={handlePayNowClick}
          disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
        >
          {buttonText}
        </Button>
        
        {paymentStatus === 'success' && (
          <Button 
            variant="outline-primary" 
            className="flight-action-button receipt-button"
            onClick={generatePDF}
          >
            <FaDownload className="me-2" /> Download E-Ticket
          </Button>
        )}
      </div>
      
      <Modal 
        show={showPaymentModal} 
        onHide={() => {
          setShowPaymentModal(false);
          setPaymentStatus('idle');
        }}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaymentGateway 
            setPaymentStatus={setPaymentStatus} 
            onClose={() => {
              setShowPaymentModal(false);
            }} 
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
