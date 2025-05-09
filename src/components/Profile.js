import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaPlane, FaHotel, FaCalendarAlt, FaClock, FaTicketAlt, FaCreditCard, FaUserTie, FaMapMarkedAlt, FaBed, FaTimesCircle, FaBan, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('Travel enthusiast exploring the world one destination at a time.');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancellationConfirm, setShowCancellationConfirm] = useState(false);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Fetch flight bookings
      const flightBookingsQuery = query(
        collection(db, 'flights'),
        where('userEmail', '==', auth.currentUser.email)
      );
      const flightBookingsSnapshot = await getDocs(flightBookingsQuery);
      const flightBookings = flightBookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'flight'
      }));

      // Fetch hotel bookings
      const hotelBookingsQuery = query(
        collection(db, 'hotels'),
        where('userEmail', '==', auth.currentUser.email)
      );
      const hotelBookingsSnapshot = await getDocs(hotelBookingsQuery);
      const hotelBookings = hotelBookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'hotel'
      }));

      // Combine all bookings
      const allBookings = [...flightBookings, ...hotelBookings];
      
      // Sort bookings by booking date (newest first)
      const sortedBookings = allBookings.sort((a, b) => {
        // Get booking timestamps from bookingTime field
        const dateA = a.bookingTime?.toDate ? a.bookingTime.toDate() : new Date(a.bookingTime);
        const dateB = b.bookingTime?.toDate ? b.bookingTime.toDate() : new Date(b.bookingTime);
        
        // Sort in descending order (newest first)
        return dateB - dateA;
      });

      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      localStorage.setItem('displayName', displayName);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
    setCancellationSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setShowCancellationConfirm(false);
    setCancellationSuccess(false);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Check if booking is eligible for cancellation
  const isBookingCancellable = (booking) => {
    if (booking.paymentStatus?.toLowerCase() === 'cancelled') {
      return false;
    }
    
    let targetDate;
    
    if (booking.type === 'flight') {
      // For flights, use departure date/time
      const departureTimestamp = booking.departureTimestamp || booking.departureTime;
      targetDate = departureTimestamp?.toDate ? departureTimestamp.toDate() : new Date(departureTimestamp);
    } else {
      // For hotels, use check-in date
      const checkInDate = booking.from;
      targetDate = checkInDate?.toDate ? checkInDate.toDate() : new Date(checkInDate);
    }
    
    if (!targetDate) return false;
    
    // Check if target date is in the future (cancellable)
    return targetDate > new Date();
  };

  // Calculate cancellation fee (15%)
  const calculateCancellationFee = (booking) => {
    if (!booking?.totalPrice) return 0;
    return booking.totalPrice * 0.15;
  };

  // Calculate refund amount (85%)
  const calculateRefundAmount = (booking) => {
    if (!booking?.totalPrice) return 0;
    return booking.totalPrice * 0.85;
  };

  // Handle booking cancellation
  const handleCancellationRequest = () => {
    setShowCancellationConfirm(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setCancellationLoading(true);
    
    try {
      const bookingRef = doc(db, selectedBooking.type === 'flight' ? 'flights' : 'hotels', selectedBooking.id);
      
      // Calculate cancellation fee and refund amount
      const cancellationFee = calculateCancellationFee(selectedBooking);
      const refundAmount = calculateRefundAmount(selectedBooking);
      const cancellationDate = new Date();
      
      // Update booking status to 'CANCELLED'
      await updateDoc(bookingRef, {
        paymentStatus: 'CANCELLED',
        cancellationDate,
        cancellationFee,
        refundAmount
      });
      
      // Prepare payload for the cancellation API
      let payload;
      
      if (selectedBooking.type === 'flight') {
        payload = {
          customerName: auth.currentUser?.displayName || selectedBooking.userName || 'Customer',
          isFlight: true,
          isHotel: false,
          referenceId: selectedBooking.referenceId,
          flightName: selectedBooking.flightName,
          flightNumber: selectedBooking.flightNumber,
          departureCity: selectedBooking.departureCity,
          arrivalCity: selectedBooking.arrivalCity,
          departureDate: selectedBooking.departureTime instanceof Date 
            ? selectedBooking.departureTime.toISOString().split('T')[0]
            : new Date(selectedBooking.departureTime).toISOString().split('T')[0],
          passengerCount: selectedBooking.passengerCount,
          cabinClass: selectedBooking.cabinClass,
          cancellationDate: cancellationDate.toISOString().split('T')[0],
          totalPrice: selectedBooking.totalPrice,
          cancellationFee,
          refundAmount,
          email: auth.currentUser.email
        };
      } else {
        payload = {
          customerName: auth.currentUser?.displayName || selectedBooking.userName || 'Customer',
          isFlight: false,
          isHotel: true,
          referenceId: selectedBooking.referenceId,
          hotelName: selectedBooking.hotelName,
          hotelLocation: selectedBooking.hotelLocation,
          checkInDate: selectedBooking.from instanceof Date 
            ? selectedBooking.from.toISOString().split('T')[0]
            : new Date(selectedBooking.from).toISOString().split('T')[0],
          checkOutDate: selectedBooking.to instanceof Date 
            ? selectedBooking.to.toISOString().split('T')[0]
            : new Date(selectedBooking.to).toISOString().split('T')[0],
          days: selectedBooking.days,
          numberOfRoom: selectedBooking.numberOfRoom,
          cancellationDate: cancellationDate.toISOString().split('T')[0],
          totalPrice: selectedBooking.totalPrice,
          cancellationFee,
          refundAmount,
          email: auth.currentUser.email
        };
      }
      
      // Send cancellation data to the API
      const response = await fetch('https://server-travelkro-production.up.railway.app/cancelbooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error('Error from cancellation API:', await response.text());
      }
      
      // Update local state
      setCancellationSuccess(true);
      setShowCancellationConfirm(false);
      
      // Update bookings list
      const updatedBookings = bookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          return {
            ...booking,
            paymentStatus: 'CANCELLED',
            cancellationDate,
            cancellationFee,
            refundAmount
          };
        }
        return booking;
      });
      
      setBookings(updatedBookings);
      setSelectedBooking({
        ...selectedBooking,
        paymentStatus: 'CANCELLED',
        cancellationDate,
        cancellationFee,
        refundAmount
      });
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellationLoading(false);
    }
  };

  return (
    <div className="profile-container fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <div className="profile-info">
          <h2>{auth.currentUser?.displayName || 'User'}</h2>
          <p>{auth.currentUser?.email}</p>
        </div>
        <button className="btn-signout" onClick={handleSignOut}>
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <label>Display Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="profile-input"
                  />
                ) : (
                  <p>{auth.currentUser?.displayName || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <label>Email</label>
                <p>{auth.currentUser?.email}</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhone className="info-icon" />
              <div className="info-content">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="profile-input"
                    placeholder="Add your phone number"
                  />
                ) : (
                  <p>{phone || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-content">
                <label>Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="profile-input"
                    placeholder="Add your location"
                  />
                ) : (
                  <p>{location || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bio-section">
            <label>Bio</label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="profile-textarea"
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="bio-text">{bio}</p>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn-save" onClick={handleUpdateProfile}>
                  <FaSave /> Save Changes
                </button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <h4>Bookings</h4>
              <p>12</p>
            </div>
            <div className="stat-card">
              <h4>Reviews</h4>
              <p>8</p>
            </div>
            <div className="stat-card">
              <h4>Points</h4>
              <p>1,250</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Booking History</h3>
          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found. Start exploring and book your next adventure!</p>
            </div>
          ) : (
            <div className="booking-history">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="booking-card"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="booking-icon">
                    {booking.type === 'flight' ? <FaPlane /> : <FaHotel />}
                  </div>
                  <div className="booking-details">
                    <div className="booking-header">
                      <h4>{booking.type === 'flight' ? 'Flight Booking' : 'Hotel Booking'}</h4>
                      <span className={`status-${booking.paymentStatus?.toLowerCase()}`}>
                        {booking.paymentStatus?.toUpperCase()}
                      </span>
                    </div>
                    <p className="booking-date">
                      <FaCalendarAlt /> {formatDate(booking.bookingTime)}
                    </p>
                    {booking.type === 'flight' ? (
                      <div className="booking-summary">
                        <div className="route-summary">
                          <span>{booking.departureCity}</span>
                          <FaPlane className="route-icon" />
                          <span>{booking.arrivalCity}</span>
                        </div>
                        <p className="flight-info">
                          {booking.flightName} - {booking.flightNumber} • {booking.cabinClass}
                        </p>
                      </div>
                    ) : (
                      <div className="booking-summary">
                        <p className="hotel-name">{booking.hotelName}</p>
                        <p className="hotel-location">
                          <FaMapMarkerAlt /> {booking.hotelLocation}
                        </p>
                        <p className="stay-duration">
                          {booking.days} days • {booking.numberOfRoom} {booking.numberOfRoom > 1 ? 'rooms' : 'room'}
                        </p>
                      </div>
                    )}
                    <div className="booking-footer">
                      <span className="booking-amount">{formatCurrency(booking.totalPrice)}</span>
                      <span className="view-details">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimesCircle />
            </button>
            
            <div className="modal-header">
              <div className="modal-icon">
                {selectedBooking.type === 'flight' ? <FaPlane /> : <FaHotel />}
              </div>
              <div className="modal-title">
                <h2>{selectedBooking.type === 'flight' ? 'Flight Booking Details' : 'Hotel Booking Details'}</h2>
                <span className={`status-${selectedBooking.paymentStatus.toLowerCase()}`}>
                  {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>

            <div className="modal-body">
              {cancellationSuccess ? (
                <div className="cancellation-success">
                  <div className="success-icon">
                    <FaCheck />
                  </div>
                  <h3>Booking Cancelled Successfully</h3>
                  <p>Your booking has been cancelled. A refund of {formatCurrency(calculateRefundAmount(selectedBooking))} will be processed to your original payment method within 5-7 business days.</p>
                  <p>You will receive a confirmation email within 5-10 minutes with the cancellation details.</p>
                  <p className="cancellation-details">
                    <span>Cancellation Fee (15%): {formatCurrency(calculateCancellationFee(selectedBooking))}</span>
                    <span>Refund Amount (85%): {formatCurrency(calculateRefundAmount(selectedBooking))}</span>
                  </p>
                </div>
              ) : (
                <>
                  {selectedBooking.type === 'flight' ? (
                    <div className="flight-details-modal">
                      <div className="route-info">
                        <div className="departure">
                          <h3>{selectedBooking.departureCity}</h3>
                          <p>{selectedBooking.departureTime}</p>
                        </div>
                        <div className="route-line">
                          <FaPlane className="plane-icon" />
                        </div>
                        <div className="arrival">
                          <h3>{selectedBooking.arrivalCity}</h3>
                          <p>{selectedBooking.arrivalTime}</p>
                        </div>
                      </div>

                      <div className="booking-info-grid">
                        <div className="info-item">
                          <FaTicketAlt className="info-icon" />
                          <div>
                            <label>Booking ID</label>
                            <p>{selectedBooking.referenceId}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaPlane className="info-icon" />
                          <div>
                            <label>Flight</label>
                            <p>{selectedBooking.flightName} ({selectedBooking.flightNumber})</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaUserTie className="info-icon" />
                          <div>
                            <label>Passengers</label>
                            <p>{selectedBooking.passengerCount}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock className="info-icon" />
                          <div>
                            <label>Booking Date</label>
                            <p>{formatDate(selectedBooking.bookingTime)}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCreditCard className="info-icon" />
                          <div>
                            <label>Amount</label>
                            <p>{formatCurrency(selectedBooking.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="hotel-details-modal">
                      <div className="hotel-header">
                        <h3>{selectedBooking.hotelName}</h3>
                        <div className="location">
                          <FaMapMarkedAlt />
                          <span>{selectedBooking.hotelLocation}</span>
                        </div>
                      </div>

                      <div className="booking-info-grid">
                        <div className="info-item">
                          <FaTicketAlt className="info-icon" />
                          <div>
                            <label>Booking ID</label>
                            <p>{selectedBooking.referenceId}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaBed className="info-icon" />
                          <div>
                            <label>Rooms</label>
                            <p>{selectedBooking.numberOfRoom}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaClock className="info-icon" />
                          <div>
                            <label>Duration</label>
                            <p>{selectedBooking.days} days</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCalendarAlt className="info-icon" />
                          <div>
                            <label>Check-in</label>
                            <p>{formatDate(selectedBooking.from)}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCalendarAlt className="info-icon" />
                          <div>
                            <label>Check-out</label>
                            <p>{formatDate(selectedBooking.to)}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <FaCreditCard className="info-icon" />
                          <div>
                            <label>Amount</label>
                            <p>{formatCurrency(selectedBooking.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              {!cancellationSuccess && isBookingCancellable(selectedBooking) && (
                <button className="btn-cancel-booking" onClick={handleCancellationRequest}>
                  <FaBan className="btn-icon" /> Request Cancellation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancellationConfirm && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowCancellationConfirm(false)}>
          <div className="modal-content cancellation-confirm" onClick={e => e.stopPropagation()}>
            <div className="cancellation-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Confirm Cancellation</h3>
            </div>
            <div className="cancellation-body">
              <p>Are you sure you want to cancel this booking?</p>
              <div className="cancellation-fees">
                <div className="fee-item">
                  <span>Total Booking Amount:</span>
                  <span>{formatCurrency(selectedBooking.totalPrice)}</span>
                </div>
                <div className="fee-item">
                  <span>Cancellation Fee (15%):</span>
                  <span>{formatCurrency(calculateCancellationFee(selectedBooking))}</span>
                </div>
                <div className="fee-item refund">
                  <span>Refund Amount (85%):</span>
                  <span>{formatCurrency(calculateRefundAmount(selectedBooking))}</span>
                </div>
              </div>
              <p className="disclaimer">Refunds will be processed to your original payment method and may take 5-7 business days to reflect in your account.</p>
              <p className="disclaimer">A confirmation email will be sent within 5-10 minutes after cancellation.</p>
            </div>
            <div className="cancellation-actions">
              <button 
                className="btn-proceed" 
                onClick={handleCancelBooking}
                disabled={cancellationLoading}
              >
                {cancellationLoading ? 'Processing...' : 'Proceed with Cancellation'}
              </button>
              <button 
                className="btn-back" 
                onClick={() => setShowCancellationConfirm(false)}
                disabled={cancellationLoading}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}