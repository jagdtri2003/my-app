// ForgotPassword.js
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './Firebase';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [resetRequested, setResetRequested] = useState(false);
  
    const handleResetPassword = (e) => {
      e.preventDefault();
      sendPasswordResetEmail(auth,email);
      setResetRequested(true);
    };
  
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title mb-4">Forgot Password</h2>
                {resetRequested ? (
                  <p>An email has been sent to {email} with instructions to reset your password.</p>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                  </form>
                )}
                <p className="mt-3">
                  Remember your password? <Link to="/login">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

