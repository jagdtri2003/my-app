import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

export default function PaymentGateway({ setPaymentStatus, onClose }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumberError, setCardNumberError] = useState('');
  const [expirationDateError, setExpirationDateError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    
    try {
      // Clear previous errors
      setCardNumberError('');
      setExpirationDateError('');
      setCvvError('');
      setGeneralError('');

      // Validate card number (should be at least 10 digits)
      if (cardNumber.length < 10) {
        setCardNumberError('Invalid card number. Card Number should be at least 10 digits long.');
        return;
      }
  
      // Check if expiration date is valid (MM/YY format)
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
        setExpirationDateError('Invalid expiration date. Please use MM/YY format.');
        return;
      }
  
      // Check if CVV is valid (numbers only)
      if (!/^[0-9]+$/.test(cvv)) {
        setCvvError('Invalid CVV. Please enter numbers only.');
        return;
      }

      // Start processing
      setIsProcessing(true);

      // Simulate payment processing
      setTimeout(() => {
        try {
          setPaymentStatus('success'); // Change this based on actual payment response
          setIsProcessing(false);
          onClose();
        } catch (error) {
          console.error("Error completing payment:", error);
          setGeneralError("Failed to complete payment. Please try again.");
          setIsProcessing(false);
          setPaymentStatus('idle');
        }
      }, 2500);
      
    } catch (error) {
      console.error("Unexpected error during payment:", error);
      setGeneralError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
      setPaymentStatus('idle');
    }
  };

  // Handle input changes with validation
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setCardNumber(value);
      if (cardNumberError && value.length >= 10) {
        setCardNumberError('');
      }
    }
  };

  const handleExpirationDateChange = (e) => {
    const value = e.target.value;
    // Format as MM/YY
    if (/^[0-9/]*$/.test(value)) {
      if (value.length === 2 && !value.includes('/') && expirationDate.length === 1) {
        setExpirationDate(value + '/');
      } else {
        setExpirationDate(value);
      }
      
      if (expirationDateError && /^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        setExpirationDateError('');
      }
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value;
    // Allow only numbers with max length 4
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCvv(value);
      if (cvvError && value.length > 0) {
        setCvvError('');
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          {generalError && (
            <Alert variant="danger" className="mb-3">
              {generalError}
            </Alert>
          )}
          
          <h3>Payment Details</h3>
          <p className="text-muted mb-4">Enter your card details to complete the payment</p>
          
          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                isInvalid={!!cardNumberError}
                required
                maxLength="16"
                disabled={isProcessing}
              />
              <Form.Control.Feedback type="invalid">
                {cardNumberError}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter a 10-16 digit card number
              </Form.Text>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={expirationDate}
                    onChange={handleExpirationDateChange}
                    isInvalid={!!expirationDateError}
                    required
                    maxLength="5"
                    disabled={isProcessing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {expirationDateError}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="CVV"
                    value={cvv}
                    onChange={handleCVVChange}
                    isInvalid={!!cvvError}
                    required
                    maxLength="4"
                    disabled={isProcessing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {cvvError}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isProcessing}
                className="py-2"
              >
                {isProcessing ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
              
              {!isProcessing && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    onClose();
                    setPaymentStatus('idle');
                  }}
                  className="py-2"
                >
                  Cancel
                </Button>
              )}
            </div>
            
            <div className="text-center mt-3">
              <small className="text-muted">
                Your payment information is secure. We don't store your card details.
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
