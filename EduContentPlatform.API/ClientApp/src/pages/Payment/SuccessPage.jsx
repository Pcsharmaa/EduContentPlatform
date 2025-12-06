import React from 'react';
import MainLayout from '../../components/common/Layout/MainLayout';
import Button from '../../components/common/UI/Button/Button';
import './payment.css';

const SuccessPage = () => {
  return (
    <MainLayout>
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          
          <h1>Payment Successful!</h1>
          
          <p className="success-message">
            Thank you for your purchase. Your content is now available in your library.
          </p>

          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Order ID:</span>
              <strong>#ORD-2024-001234</strong>
            </div>
            <div className="detail-row">
              <span>Amount Paid:</span>
              <strong>$54.99</strong>
            </div>
            <div className="detail-row">
              <span>Date:</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Button variant="primary" to="/dashboard">
              Go to Dashboard
            </Button>
            <Button variant="secondary" to="/browse">
              Continue Shopping
            </Button>
          </div>

          <p className="confirmation-email">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessPage;
