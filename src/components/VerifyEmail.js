import React,{useState} from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { Container, Row, Col, Alert,Button } from 'react-bootstrap';


export default function VerifyEmail({user}) {

  const [emailSent, setEmailSent] = useState(false);

  const handleResendVerification = async () => {
    // Simulating email sent for demonstration purposes
    // Replace this with your actual logic to resend verification email
    await sendEmailVerification(user);
    setEmailSent(true);
  };
  return (
    <Container>
      <Row className="mt-5">
        <Col md={{ span: 6, offset: 3 }}>
          <Alert variant={emailSent ? 'success' : 'danger'}>
            <h4>{emailSent ? 'Email Sent!' : 'Account Not Verified'}</h4>
            {emailSent ? (
              <p className="text-success">We've sent you a verification email to {user.email} . Please check your inbox.</p>
            ) : (
              <div>
                <p>Your Travelkro account has not been verified yet.</p>
                <p>To continue enjoying a seamless travelling experience with Travelkro, please verify your email. Check your inbox for a verification link or click the button below to resend the verification email.</p>
                <Button variant="primary" onClick={handleResendVerification}>Resend Verification Email</Button>
              </div>
            )}
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}
