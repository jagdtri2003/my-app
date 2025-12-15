import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';

// Simple decryption function (base64 decode with URL-safe handling)
const decrypt = (encrypted) => {
  try {
    // Replace URL-safe characters back to base64 standard
    let base64 = encrypted.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode from base64
    const decoded = atob(base64);
    return decoded;
  } catch (error) {
    console.error('Decryption error:', error);
    return encrypted; // Return original if decryption fails
  }
};

export default function MCP_Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [decryptedReferenceId, setDecryptedReferenceId] = useState('');
  const [decryptedAmount, setDecryptedAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Get encrypted values from URL parameters
    const encryptedRefId = searchParams.get('referenceId');
    const encryptedAmount = searchParams.get('amount');

    if (encryptedRefId && encryptedAmount && !isNaN(encryptedAmount)) {
      
      // Decrypt the values
      try {
        const decryptedRef = decrypt(encryptedRefId);
        const decryptedAmt = decrypt(encryptedAmount);
        
        setDecryptedReferenceId(decryptedRef);
        setDecryptedAmount(decryptedAmt);
      } catch (err) {
        setError('Invalid Payment Link.Please try again later.');
        console.error('Decryption error:', err);
      }
    } else {
      setError('Invalid Payment Link.Please try again later.');
      setDecryptedReferenceId('N/A');
      setDecryptedAmount('N/A');
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors = {};

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number (13-19 digits)';
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
      newErrors.expirationDate = 'Please enter a valid expiration date (MM/YY)';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length <= 19) {
      setCardNumber(value);
      if (errors.cardNumber) {
        setErrors({ ...errors, cardNumber: '' });
      }
    }
  };

  const handleExpirationDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    
    if (value.length >= 2) {
      formatted = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    if (formatted.length <= 5) {
      setExpirationDate(formatted);
      if (errors.expirationDate) {
        setErrors({ ...errors, expirationDate: '' });
      }
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
      if (errors.cvv) {
        setErrors({ ...errors, cvv: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    const response = await fetch("https://script.google.com/macros/s/AKfycbyQMxnOH99tiCEfAxexH_7XJ41LqBEueLKKd7ghlWRgYzyHuB_N-WvPEBdb2pWxmAMtrA/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "updatePayment",
        RefId: decryptedReferenceId,
        PaymentStatus: "PAID"
      })
    })
    const data = await response.json();
    if (data.success) {
      setPaymentSuccess(true);
      setIsProcessing(false);
    } else {
      setError('Failed to update payment status. Please try again later.');
      setIsProcessing(false);
    }

  };

  const formatCardNumber = (number) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  if (paymentSuccess) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Card className="text-center p-5" style={{ maxWidth: '500px', width: '100%' }}>
          <FaCheckCircle style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1.5rem' }} />
          <Card.Body>
            <h3 className="mb-3">Payment Successful!</h3>
            <p className="text-muted mb-4">
              Your payment of <strong>₹{decryptedAmount}</strong> has been processed successfully.
            </p>
            <div className="bg-light p-3 rounded mb-4">
              <small className="text-muted d-block mb-1">Reference ID</small>
              <strong>{decryptedReferenceId}</strong>
            </div>
            <Button 
              variant="primary" 
              onClick={() => navigate('/')}
              className="w-100"
            >
              Return to Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <Card style={{ maxWidth: '600px', width: '100%' }} className="shadow">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h3 className="mb-0">
            <FaLock className="me-2" />
            Secure Payment
          </h3>
        </Card.Header>
        <Card.Body className="p-4">
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {decryptedReferenceId && decryptedAmount && (
            <div className="bg-light p-3 rounded mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Reference ID:</span>
                <strong>{decryptedReferenceId}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Amount:</span>
                <strong className="text-primary" style={{ fontSize: '1.5rem' }}>
                  ₹{decryptedAmount}
                </strong>
              </div>
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaCreditCard className="me-2" />
                Cardholder Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => {
                  setCardholderName(e.target.value);
                  if (errors.cardholderName) {
                    setErrors({ ...errors, cardholderName: '' });
                  }
                }}
                isInvalid={!!errors.cardholderName}
                disabled={isProcessing}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardholderName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                isInvalid={!!errors.cardNumber}
                disabled={isProcessing}
                maxLength="23"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.cardNumber}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter 13-19 digit card number
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
                    isInvalid={!!errors.expirationDate}
                    disabled={isProcessing}
                    maxLength="5"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.expirationDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCVVChange}
                    isInvalid={!!errors.cvv}
                    disabled={isProcessing}
                    maxLength="4"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cvv}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isProcessing || decryptedAmount === 'N/A' || decryptedReferenceId === 'N/A'}
                className="py-2"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaLock className="me-2" />
                    {decryptedAmount === 'N/A' ? 'Pay Now' : `Pay ₹${decryptedAmount || '0'}`}
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                <FaLock className="me-1" />
                Your payment information is secure and encrypted
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
