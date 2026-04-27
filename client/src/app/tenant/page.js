"use client";
import React, { useState } from 'react';
import styles from './tenant.module.css';

export default function TenantDashboard() {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const requests = [
    { id: '1024', title: 'Leaking Faucet', status: 'In Progress', date: 'Oct 24' },
    { id: '1012', title: 'AC Not Cooling', status: 'Completed', date: 'Oct 15' },
  ];

  return (
    <div className={styles.dashboard}>
      {!showNewRequest ? (
        <>
          <div className={styles.welcomeCard}>
            <h2>How can we help today?</h2>
            <p>Report a maintenance issue or check status of existing requests.</p>
            <button className="btn-primary" onClick={() => setShowNewRequest(true)}>
              + Submit New Request
            </button>
          </div>

          <section className={styles.section}>
            <h3>Your Recent Requests</h3>
            <div className={styles.requestList}>
              {requests.map(req => (
                <div key={req.id} className="glass-card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{req.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket #{req.id} • {req.date}</p>
                    </div>
                    <span className={styles.badge} data-status={req.status}>{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>New Service Request</h2>
            <button onClick={() => setShowNewRequest(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>✕ Cancel</button>
          </div>

          <form className={styles.form}>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select required>
                <option value="">Select a category</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC / Heating</option>
                <option value="appliances">Appliances</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Issue Title</label>
              <input type="text" placeholder="e.g. Kitchen sink is clogged" required />
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea rows="4" placeholder="Please provide details about the issue..." required></textarea>
            </div>

            <div className="input-group">
              <label className="input-label">Urgency</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="urgency" value="low" defaultChecked /> Low
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="urgency" value="medium" /> Medium
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="urgency" value="high" /> High
                </label>
              </div>
            </div>

            <div className="input-group">
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Permission to enter if not home?
              </label>
            </div>

            <div className="input-group">
              <label className="input-label">Photos (Optional)</label>
              <div className={styles.uploadArea}>
                <span>📷 Upload Photos</span>
                <input type="file" multiple hidden />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Request</button>
          </form>
        </div>
      )}
    </div>
  );
}
