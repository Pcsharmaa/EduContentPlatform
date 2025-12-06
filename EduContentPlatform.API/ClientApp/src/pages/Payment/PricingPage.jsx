import React, { useState } from 'react';
// DashboardLayout provided by router
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import './payment.css';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'View content',
        'Basic search',
        'Community access',
        'Limited to 5 bookmarks',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      description: 'Best for learners',
      features: [
        'All Free features',
        'Unlimited content access',
        'Advanced search',
        'Download resources',
        'Ad-free experience',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations',
      features: [
        'All Pro features',
        'Custom integrations',
        'Team management',
        'Analytics & reports',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="pricing-container">
        <div className="pricing-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that works best for you</p>

          <div className="billing-toggle">
            <button
              className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${billingCycle === 'annually' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annually')}
            >
              Annually
              <span className="badge">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>

              <div className="price-section">
                {typeof plan.price === 'number' ? (
                  <>
                    <span className="currency">$</span>
                    <span className="amount">{plan.price.toFixed(2)}</span>
                    <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </>
                ) : (
                  <span className="amount">{plan.price}</span>
                )}
              </div>

              <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth size="lg">
                {plan.cta}
              </Button>

              <div className="features-list">
                {plan.features.map((feature, i) => (
                  <div key={i} className="feature-item">
                    <span className="checkmark">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Can I change my plan?</h4>
              <p>Yes, you can upgrade or downgrade your plan at any time.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a free trial?</h4>
              <p>Yes, Pro plan comes with a 14-day free trial.</p>
            </div>
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Yes, cancel your subscription anytime with no penalties.</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PricingPage;
