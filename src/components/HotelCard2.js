import React,{useState,useEffect} from 'react';
import jsPDF from 'jspdf';
import { Button, Spinner,Modal } from 'react-bootstrap';
import PaymentGateway from './PaymentGateway';
import { serverTimestamp,doc,setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { auth } from './Firebase';

export default function HotelCard2({hotel,checkInDate,checkOutDate ,paymentStatus,setPaymentStatus,numberOfRoom}) {

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [referenceId,setReferenceId] = useState(''); 
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24); // Calculate the number of days
    const [user, setUser] = useState(null);
    const [datasaved, setDatasaved] = useState(false);

    onAuthStateChanged(auth,(authUser)=>{
      if(authUser){
        setUser(authUser);
      }
    })

    const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const pricePerNight = parseInt(hotel.price.replace(/\D/g, ''));
    numberOfRoom = parseInt(numberOfRoom);
    const total = pricePerNight * numberOfDays *numberOfRoom;

    const handlePayNowClick = () => {
      // Simulate payment processing
      setPaymentStatus('processing');
      setShowPaymentModal(true);
      setReferenceId(generateReferenceId());

    };

    //Saving to DB
    const saveBookingDataToFirestore = async () => {    
      const bookingRef = doc(db, 'hotels',referenceId);
      const bookingData = {
        userEmail:user.email,
        username:user.displayName,
        hotelName: hotel.name,
        hotelLocation: hotel.location,
        days: numberOfDays,
        from:formattedStartDate,
        to:formattedEndDate,
        numberOfRoom,
        totalPrice: total,
        bookingTime: serverTimestamp(),
        paymentStatus: 'Success',
        referenceId:referenceId,
      };
    
      try {
        const bookingTime = new Date();
        await setDoc(bookingRef, bookingData);
        const formattedBookingTime = bookingTime.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        });
        bookingData.bookingTime=formattedBookingTime;
        const response = await fetch('https://server-travelkro.vercel.app/hotel', {
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

    useEffect(() => {
      if (paymentStatus === 'success' && !datasaved) {
        saveBookingDataToFirestore();
      }
    }, [paymentStatus, datasaved]);

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
        doc.text('TravelKro - Hotel Receipt', 40, 15); // Replace with your travel agency name
    
        const titleWidth = doc.getStringUnitWidth('TravelKro - Hotel Receipt') * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const titleX = 40;
        const titleY = 15;
        doc.line(titleX, titleY + 2, titleX + titleWidth, titleY + 2);
        
        doc.setDrawColor(52, 58, 64);
        doc.rect(5,5,200,110, 'S');
        doc.setFontSize(14);
        doc.setTextColor(33, 37, 41);
        doc.setFont('helvetica', 'normal');
        doc.text(`Hotel Name: ${hotel.name}`, 10, 30);
        doc.text(`Location: ${hotel.location}`, 10, 40);
        doc.text(`Number of Days: ${numberOfDays}`, 10, 50);
        doc.text(`From Date: ${formattedStartDate}`, 10, 60);
        doc.text(`To Date: ${formattedEndDate}`, 10, 70);
        doc.text(`Number of Room: ${numberOfRoom}`,10,80);
        doc.text(`Total Price:${total} Rs`, 10, 90);
        doc.text('Payment Status: ',10,100);
        doc.setTextColor(0, 128, 0); // RGB color for green
        doc.text('Successful',49, 100);
        doc.setTextColor(33, 37, 41);
        doc.text(`Reference Id: ${referenceId}`,130,90);
        doc.setFontSize(8);
        doc.text(`Receipt Generated At: ${receiptGeneratedAt}`, 10, 110);

        const note = `
        Dear Valued Guest,
    
        Thank you for choosing TravelKro for your stay. We're dedicated to making your experience exceptional and memorable.
    
        May your days be filled with relaxation, discovery, and delightful moments.
    
        Safe travels and wonderful memories,
        Jagdamba Tripathi
      `;
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
      doc.text(note,3, 117);
        
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
          disabled={paymentStatus === 'processing' || paymentStatus === 'success' }
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
  )
}
