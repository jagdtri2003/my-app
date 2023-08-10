import React, { useState } from 'react';
import { Button, Form, Container, Row, Col,Spinner } from 'react-bootstrap';

export default function PaymentGateway({setPaymentStatus ,onClose}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumberError, setCardNumberError] = useState('');
  const [expirationDateError, setExpirationDateError] = useState('');
  const [cvvError, setCvvError] = useState('');

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    // Simulate payment processing

    setCardNumberError('');
    setExpirationDateError('');
    setCvvError('');

    if (cardNumber.length<10) {
        setCardNumberError('Invalid card number. Card Number should be atleast 10 digit long.');
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

      setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success'); // Change this based on actual payment response
      setIsProcessing(false);
      onClose();
    }, 2500);
  };

  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <h3>Payment Details</h3>
          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group>
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
              <Form.Text className="text-danger">{cardNumberError}</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
              <Form.Text className="text-danger">{expirationDateError}</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="password"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
              <Form.Text className="text-danger">{cvvError}</Form.Text>
            </Form.Group>
            <Button className='my-3'
              variant="primary"
              type="submit"
              disabled={isProcessing}
            >
            {isProcessing ? (
              <>
                <Spinner as="span" animation="border" size="sm" />
                 &nbsp;Processing...
              </>
            ) : (
              'Pay Now'
            )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
