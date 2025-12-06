import React, { useState } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import './payment.css';

const CheckoutPage = () => {
  const [cart] = useState([
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      price: 49.99,
      quantity: 1,
    },
  ]);

  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing payment:', checkoutData);
  };

  return (
    <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Checkout</h2>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              <section className="form-section">
                <h3>Billing Information</h3>
                
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={checkoutData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={checkoutData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </section>

              <section className="form-section">
                <h3>Payment Information</h3>
                
                <FormInput
                  label="Card Number"
                  name="cardNumber"
                  value={checkoutData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />

                <div className="form-row">
                  <FormInput
                    label="Expiry Date"
                    name="expiryDate"
                    value={checkoutData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                  <FormInput
                    label="CVV"
                    name="cvv"
                    value={checkoutData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </section>

              <Button variant="primary" type="submit" size="lg" fullWidth>
                Pay ${total.toFixed(2)}
              </Button>

              <p className="security-notice">
                🔒 Your payment information is secure and encrypted
              </p>
            </form>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div>
                    <h4>{item.title}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="promo-code">
              <FormInput
                label="Promo Code"
                placeholder="Enter code"
              />
              <Button variant="secondary">Apply</Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;
