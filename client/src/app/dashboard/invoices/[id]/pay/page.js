"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './pay.module.css';

export default function PaymentPage({ params }) {
  const [method, setMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/invoices'), 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Thank you for your payment. Your invoice has been updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className="glass-card">
          <h3>Secure Payment</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Complete your payment for Invoice #{params.id}</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.methodSelector}>
              <div 
                className={`${styles.method} ${method === 'credit_card' ? styles.methodActive : ''}`}
                onClick={() => setMethod('credit_card')}
              >
                💳 Credit Card
              </div>
              <div 
                className={`${styles.method} ${method === 'ach' ? styles.methodActive : ''}`}
                onClick={() => setMethod('ach')}
              >
                🏦 ACH / Bank
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Cardholder Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>

            <div className="input-group">
              <label className="input-label">Card Number</label>
              <input type="text" placeholder="•••• •••• •••• ••••" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Expiry Date</label>
                <input type="text" placeholder="MM/YY" required />
              </div>
              <div className="input-group">
                <label className="input-label">CVC</label>
                <input type="password" placeholder="•••" required />
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay $1,250.00'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              🔒 Your payment information is encrypted and secure.
            </p>
          </form>
        </div>

        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3>Order Summary</h3>
          <div className={styles.summaryItem}>
            <span>Invoice #{params.id}</span>
            <span>$1,000.00</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Service Fee</span>
            <span>$250.00</span>
          </div>
          <div className={styles.summaryDivider}></div>
          <div className={`${styles.summaryItem} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>$1,250.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
