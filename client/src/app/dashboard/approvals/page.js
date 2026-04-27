"use client";
import React from 'react';
import styles from '../dashboard.module.css';

export default function ApprovalsPage() {
  const estimates = [
    { id: 'EST-102', workOrder: 'Mainline Repair', amount: 1450.00, status: 'PENDING', date: 'Oct 26, 2023' },
    { id: 'EST-095', workOrder: 'HVAC Replacement', amount: 3200.00, status: 'APPROVED', date: 'Oct 12, 2023' },
  ];

  return (
    <div>
      <div className="glass-card">
        <h3>Pending Approvals</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review and approve repairs that exceed your property threshold.</p>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Estimate ID</th>
                <th>Work Order</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((est) => (
                <tr key={est.id}>
                  <td>{est.id}</td>
                  <td style={{ fontWeight: 600 }}>{est.workOrder}</td>
                  <td>${est.amount.toLocaleString()}</td>
                  <td>
                    <span 
                      className={styles.badge} 
                      style={{ 
                        backgroundColor: est.status === 'PENDING' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: est.status === 'PENDING' ? 'var(--secondary)' : '#10b981'
                      }}
                    >
                      {est.status}
                    </span>
                  </td>
                  <td>
                    {est.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Approve</button>
                        <button style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)' }}>Decline</button>
                      </div>
                    ) : (
                      <button style={{ background: 'var(--border)', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>View History</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
