import React, { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

export default function VerifyEmail({ user }) {
  const [emailSent, setEmailSent] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleResendVerification = async () => {
    const lastSentTimestamp = parseInt(localStorage.getItem('lastSentTimestamp'), 10) || 0;
    const currentTime = new Date().getTime();
    const timeSinceLastSent = currentTime - lastSentTimestamp;
    const rateLimitTimeRange = 600000; // 10 minutes in milliseconds

    if (timeSinceLastSent >= rateLimitTimeRange) {
      // Simulating email sent for demonstration purposes
      // Replace this with your actual logic to resend verification email
      setEmailSent(true);
      localStorage.setItem('lastSentTimestamp', currentTime.toString());
      try {
        await sendEmailVerification(user);
        console.log('Email sent!');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    } else {
      const remainingMilliseconds = rateLimitTimeRange - timeSinceLastSent;
      const remainingMinutes = Math.floor(remainingMilliseconds / 60000); // 1 minute = 60000 milliseconds
      const remainingSeconds = Math.floor((remainingMilliseconds % 60000) / 1000);

      setRemainingTime({ minutes: remainingMinutes, seconds: remainingSeconds });
      console.log(`You can send another email in ${remainingMinutes} minutes and ${remainingSeconds} seconds.`);
    }
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }}>
          <Alert variant={emailSent ? 'success' : 'danger'}>
            <h4>{emailSent ? 'Email Sent!' : 'Account Not Verified'}</h4>
            {emailSent ? (
              <p className="text-success">We've sent you a verification email to {user.email}. Please check your inbox.</p>
            ) : (
              <div>
                <p>Your <b>TravelKro</b> account has not been verified yet.</p>
                <p>To continue enjoying a seamless travelling experience with TravelKro, please verify your email. Check your inbox for a verification link or click the button below to resend the verification email.</p>
                <Button variant="primary" onClick={handleResendVerification}>Resend Verification Email</Button>
                {remainingTime.minutes > 0 && (
                  <p className="mt-2">Please wait {remainingTime.minutes} minutes and {remainingTime.seconds} seconds before sending another email.</p>
                )}
              </div>
            )}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}
