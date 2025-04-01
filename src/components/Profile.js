import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaPlane, FaHotel, FaCalendarAlt, FaClock, FaTicketAlt, FaCreditCard, FaUserTie, FaMapMarkedAlt, FaBed, FaTimesCircle } from 'react-icons/fa';
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

      // Combine and sort bookings by date
      const allBookings = [...flightBookings, ...hotelBookings].sort((a, b) => 
        new Date(b.bookingDate) - new Date(a.bookingDate)
      );

      setBookings(allBookings);
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
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}