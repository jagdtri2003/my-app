import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { Button, Spinner, Modal, Badge } from 'react-bootstrap';
import PaymentGateway from './PaymentGateway';
import { serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { FaHotel, FaMapMarkerAlt, FaCalendarAlt, FaBed, FaRupeeSign, FaCreditCard, FaFileDownload, FaCheckCircle, FaStar } from 'react-icons/fa';

export default function HotelCard2({ hotel, checkInDate, checkOutDate, paymentStatus, setPaymentStatus, numberOfRoom }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const numberOfDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 3600 * 24)));
    const [user, setUser] = useState(null);
    const [datasaved, setDatasaved] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            }
        });
        
        return () => unsubscribe();
    }, []);

    const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const pricePerNight = parseInt(hotel.price.replace(/\D/g, ''));
    const parsedNumberOfRoom = parseInt(numberOfRoom);
    const total = pricePerNight * numberOfDays * parsedNumberOfRoom;

    const handlePayNowClick = () => {
        // Check if user is authenticated
        if (!user) {
            alert("Please login to continue with payment");
            return;
        }
        
        // Simulate payment processing
        setPaymentStatus('processing');
        setShowPaymentModal(true);
        setReferenceId(generateReferenceId());
    };

    //Saving to DB
    const saveBookingDataToFirestore = async () => {
        // Verify user authentication
        if (!user) {
            console.error("User not authenticated");
            return;
        }
        
        const bookingRef = doc(db, 'hotels', referenceId);
        const bookingData = {
            userEmail: user.email,
            username: user.displayName,
            hotelName: hotel.name,
            hotelLocation: hotel.location,
            days: numberOfDays,
            from: formattedStartDate,
            to: formattedEndDate,
            numberOfRoom: parsedNumberOfRoom,
            totalPrice: total,
            bookingTime: serverTimestamp(),
            paymentStatus: 'Success',
            referenceId: referenceId,
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
            bookingData.bookingTime = formattedBookingTime;
            const response = await fetch('https://server-travelkro.vercel.app/hotel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            console.log('Booking data saved successfully:', referenceId);
            console.log(response);
            setDatasaved(true);

        } catch (error) {
            console.error('Error adding booking:', error);
            // Handle the error by alerting the user
            alert("Error saving booking data. Please try again or contact support.");
        }
    };

    let buttonContent;
    if (paymentStatus === 'idle') {
        buttonContent = (
            <>
                <FaCreditCard className="me-2" /> Pay Now
            </>
        );
    } else if (paymentStatus === 'processing') {
        buttonContent = (
            <>
                <Spinner animation="border" size="sm" className="me-2" /> Processing...
            </>
        );
    } else if (paymentStatus === 'success') {
        buttonContent = (
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
        
        // Add background color to the whole page
        doc.setFillColor(248, 250, 252); // Light background
        doc.rect(0, 0, 210, 297, 'F');
        
        // Add colored header bar - shorter so it doesn't overlap QR code
        doc.setFillColor(79, 70, 229); // Indigo-600 color
        doc.rect(0, 0, 210, 25, 'F');
        
        // Add header text
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255); // White color
        doc.setFont("helvetica", "bold");
        doc.text('TravelKro', 15, 15);
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text('HOTEL RESERVATION', 15, 22);
        
        // Hotel receipt generated date
        const receiptGeneratedAt = new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        });

        // Generate QR code with reference ID - moved below header to prevent overlap
        const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(referenceId)}&size=100x100`;

        // Add the QR code image to the PDF
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
            doc.text(referenceId, 75, 45);
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(71, 85, 105); // Slate-500 color
            doc.text('KEEP THIS NUMBER FOR REFERENCE', 15, 53);
            
            // Hotel info section
            doc.setFillColor(255, 255, 255); // White background
            doc.roundedRect(10, 70, 190, 85, 2, 2, 'F');
            
            // Hotel header
            doc.setFillColor(79, 70, 229, 0.1); // Light indigo bg
            doc.rect(10, 70, 190, 15, 'F');
            
            doc.setFontSize(14);
            doc.setTextColor(79, 70, 229); // Indigo-600 color
            doc.setFont("helvetica", "bold");
            doc.text('HOTEL DETAILS', 15, 80);
            
            // Hotel details
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(30, 41, 59); // Slate-800 color
            
            // First column
            doc.text('Hotel Name:', 15, 95);
            doc.text('Location:', 15, 105);
            doc.text('Check-in Date:', 15, 115);
            doc.text('Check-out Date:', 15, 125);
            doc.text('Number of Days:', 15, 135);
            doc.text('Number of Rooms:', 15, 145);
            
            // First column values
            doc.setFont("helvetica", "bold");
            doc.text(hotel.name, 70, 95);
            doc.text(hotel.location, 70, 105);
            doc.text(formattedStartDate, 70, 115);
            doc.text(formattedEndDate, 70, 125);
            doc.text(numberOfDays.toString(), 70, 135);
            doc.text(parsedNumberOfRoom.toString(), 70, 145);
            
            // Cost section
            doc.setFillColor(241, 245, 249); // Lighter gray
            doc.roundedRect(10, 165, 190, 25, 2, 2, 'F');
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(71, 85, 105); // Slate-500 color
            doc.text('TOTAL COST:', 15, 175);
            
            doc.setFontSize(16);
            doc.setTextColor(16, 185, 129); // Green-500 color
            doc.setFont("helvetica", "bold");
            // Using INR instead of ₹ symbol to ensure compatibility
            doc.text(`INR ${total.toLocaleString('en-IN')}`, 90, 175);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(71, 85, 105); // Slate-500 color
            doc.text('PAYMENT COMPLETED SUCCESSFULLY', 15, 183);
            
            // Amenities section
            doc.setFillColor(236, 253, 245, 0.8); // Light green bg
            doc.roundedRect(10, 200, 190, 40, 2, 2, 'F');
            
            doc.setFontSize(12);
            doc.setTextColor(16, 185, 129); // Green-500 color
            doc.setFont("helvetica", "bold");
            doc.text('INCLUDED AMENITIES:', 15, 210);
            
            // Draw amenity bullets
            const drawBullet = (x, y) => {
                doc.setFillColor(16, 185, 129); // Green-500 color
                doc.circle(x, y, 1.5, 'F');
            };
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(71, 85, 105); // Slate-500 color
            
            // First row of amenities
            drawBullet(15, 220);
            doc.text('Free WiFi', 20, 220);
            
            drawBullet(70, 220);
            doc.text('Breakfast Included', 75, 220);
            
            drawBullet(140, 220);
            doc.text('Air Conditioning', 145, 220);
            
            // Second row of amenities
            drawBullet(15, 230);
            doc.text('Room Service', 20, 230);
            
            drawBullet(70, 230);
            doc.text('Swimming Pool', 75, 230);
            
            drawBullet(140, 230);
            doc.text('Parking', 145, 230);
            
            // Guest Message - simplified to prevent any potential font issues
            doc.setFillColor(255, 255, 255); // White background
            doc.roundedRect(10, 250, 190, 20, 2, 2, 'F');
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(71, 85, 105); // Slate-500 color
            
            const message = "Thank you for choosing TravelKro for your stay. We wish you a pleasant and memorable experience.";
                
            // Split the message into multiple lines
            const lines = doc.splitTextToSize(message, 180);
            doc.text(lines, 15, 260);
            
            // Footer
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184); // Slate-400 color
            doc.text(`Receipt Generated: ${receiptGeneratedAt}`, 10, 280);
            
            doc.setFontSize(10);
            doc.setTextColor(79, 70, 229); // Indigo-600 color
            doc.text('TravelKro | jagdtri2003@gmail.com | +91 9876543210', 10, 288);
            
            // Save the PDF with reference ID
            doc.save(`TravelKro_Hotel_${referenceId}.pdf`);
        };
    };

    // Function to render stars based on hotel rating
    const renderRating = (rating) => {
        const stars = [];
        const ratingValue = parseInt(rating) || 4; // Default to 4 if not specified
        
        for (let i = 0; i < 5; i++) {
            if (i < ratingValue) {
                stars.push(<FaStar key={i} className="text-warning" />);
            } else {
                stars.push(<FaStar key={i} className="text-muted" />);
            }
        }
        
        return stars;
    };

    return (
        <div 
            className="hotel-card-container" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="hotel-card-header">
                <div className="hotel-logo">
                    <FaHotel className="hotel-icon" />
                </div>
                <div className="hotel-details">
                    <h4>{hotel.name}</h4>
                    <div className="hotel-rating">
                        {renderRating(hotel.rating)}
                    </div>
                </div>
                <Badge bg="info" className="hotel-badge">
                    Best Deal
                </Badge>
            </div>
            
            <div className="hotel-location">
                <FaMapMarkerAlt className="info-icon" />
                <span>{hotel.location}</span>
            </div>
            
            <div className="hotel-description">
                <p>{hotel.description || "Experience luxury and comfort in this beautiful hotel with amazing amenities and excellent service."}</p>
            </div>
            
            <div className="hotel-info-grid">
                <div className="info-row">
                    <div className="info-item">
                        <FaCalendarAlt className="info-icon" />
                        <div>
                            <div className="info-label">Check-in</div>
                            <div className="info-value">{formattedStartDate}</div>
                        </div>
                    </div>
                    
                    <div className="info-item">
                        <FaCalendarAlt className="info-icon" />
                        <div>
                            <div className="info-label">Check-out</div>
                            <div className="info-value">{formattedEndDate}</div>
                        </div>
                    </div>
                </div>
                
                <div className="info-row">
                    <div className="info-item">
                        <FaBed className="info-icon" />
                        <div>
                            <div className="info-label">Rooms</div>
                            <div className="info-value">{parsedNumberOfRoom}</div>
                        </div>
                    </div>
                    
                    <div className="info-item">
                        <FaRupeeSign className="info-icon" />
                        <div>
                            <div className="info-label">Total Price</div>
                            <div className="price-value">₹{total}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="hotel-amenities">
                <span>Free WiFi</span>
                <span>Breakfast</span>
                <span>Swimming Pool</span>
                <span>Parking</span>
            </div>
            
            <div className="hotel-actions">
                <Button
                    variant={paymentStatus === 'success' ? 'success' : 'primary'}
                    onClick={handlePayNowClick}
                    disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                    className="action-button"
                >
                    {buttonContent}
                </Button>
                
                {paymentStatus === 'success' && (
                    <Button 
                        variant="outline-primary" 
                        onClick={generatePDF}
                        className="receipt-button"
                    >
                        <FaFileDownload className="me-2" /> Download Receipt
                    </Button>
                )}
            </div>
            
            <Modal 
                show={showPaymentModal} 
                onHide={() => {
                    setShowPaymentModal(false)
                    setPaymentStatus('idle')
                }} 
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Complete Your Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PaymentGateway 
                        setPaymentStatus={setPaymentStatus} 
                        onClose={() => {setShowPaymentModal(false)}} 
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}
