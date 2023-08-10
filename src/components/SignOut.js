import React from 'react';
import { Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase';

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);

    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
