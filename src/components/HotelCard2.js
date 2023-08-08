import React from 'react';
import jsPDF from 'jspdf';
import { Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

export default function HotelCard2({hotel,buttontxt,checkInDate,checkOutDate ,paymentStatus,setPaymentStatus}) {

    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24); // Calculate the number of days

    const pricePerNight = parseInt(hotel.price.replace(/\D/g, ''));
    const total = pricePerNight * numberOfDays;

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
      const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // Generate a random number
      const referenceId = generateReferenceId();

      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(referenceId)}&size=100x100`;

      // Add the QR code image to the PDF
      const img = new Image();
      img.src = qrCodeImageUrl;
      img.onload = () => {
        doc.addImage(img, 'PNG',130,30,50,50);
      
      // Add a header with your travel agency name
        doc.setFontSize(20);
        doc.setTextColor(52, 58, 64); // Bootstrap's secondary color
        doc.setFont('courier', 'normal');
        doc.text('TravelKro - Hotel Receipt', 35, 15); // Replace with your travel agency name
    
        const titleWidth = doc.getStringUnitWidth('TravelKro - Hotel Receipt') * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const titleX = 35;
        const titleY = 15;
        doc.line(titleX, titleY + 2, titleX + titleWidth, titleY + 2);
        
        doc.setDrawColor(52, 58, 64);
        doc.rect(5,5,200,100, 'S');
        doc.setFontSize(14);
        doc.setTextColor(33, 37, 41);
        doc.setFont('helvetica', 'normal');
        doc.text(`Hotel Name: ${hotel.name}`, 10, 30);
        doc.text(`Location: ${hotel.location}`, 10, 40);
        doc.text(`Number of Days: ${numberOfDays}`, 10, 50);
        doc.text(`From Date: ${formattedStartDate}`, 10, 60);
        doc.text(`To Date: ${formattedEndDate}`, 10, 70);
        doc.text(`Total Price:${total} Rs`, 10, 80);
        doc.text('Payment Status: ',10,90);
        doc.setTextColor(0, 128, 0); // RGB color for green
        doc.text('Successful',49, 90);
        doc.setTextColor(33, 37, 41);
        doc.text(`Reference Id: ${referenceId}`,130,90);

        const note = `
        Dear Valued Guest,
    
        Thank you for choosing TravelKro for your stay. We're dedicated to making your experience exceptional and memorable.
    
        May your days be filled with relaxation, discovery, and delightful moments.
    
        Safe travels and wonderful memories,
        Jagdamba Tripathi
      `;
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
      doc.text(note,3, 110);
        
        // Save the PDF with a random number in the name
        doc.save(`hotel_details_${referenceId}.pdf`);
      };
  };

  return (
    <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">{hotel.name}</h5>
      <h6 className="card-subtitle mb-2 text-muted">{hotel.location}</h6>
      <p className="card-text">{hotel.description}</p>
      <p className="card-text">Price: {hotel.price}</p>
      <p className="card-text">Price for {numberOfDays} Days:<strong>₹{total}</strong></p>
      <Button
          variant={paymentStatus === 'success' ? 'success' : 'primary'}
          onClick={handlePayNowClick}
          disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
        >
          {buttonText}
        </Button>
        <br /><br />
        {( paymentStatus==='success') &&
                <Button variant="primary" onClick={generatePDF}>
                  Download Receipt
                </Button>
        }
    </div>
  </div>
  )
}
