import React, { useState } from 'react';
import { auth } from './Firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('Travel enthusiast exploring the world one destination at a time.');
  const navigate = useNavigate();

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
    </div>
  );
}