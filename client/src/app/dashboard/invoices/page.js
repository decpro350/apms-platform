"use client";
import React from 'react';
import Link from 'next/link';
import styles from '../dashboard.module.css';

export default function InvoicesPage() {
  const invoices = [
    { id: 'IV-101', amount: 1250.00, status: 'SENT', date: 'Oct 24, 2023', dueDate: 'Nov 24, 2023' },
    { id: 'IV-098', amount: 840.50, status: 'PAID', date: 'Sep 12, 2023', dueDate: 'Oct 12, 2023' },
    { id: 'IV-085', amount: 3200.00, status: 'OVERDUE', date: 'Aug 05, 2023', dueDate: 'Sep 05, 2023' },
  ];

  return (
    <div>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3>Invoices</h3>
          <button className="btn-primary">+ Create Invoice</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600 }}>{inv.id}</td>
                <td>{inv.date}</td>
                <td>{inv.dueDate}</td>
                <td>${inv.amount.toLocaleString()}</td>
                <td>
                  <span 
                    className={styles.badge} 
                    style={{ 
                      backgroundColor: inv.status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'OVERDUE' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                      color: inv.status === 'PAID' ? '#10b981' : inv.status === 'OVERDUE' ? 'var(--accent)' : 'var(--primary)'
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--border)', color: 'var(--text-main)' }}>View</button>
                    {inv.status !== 'PAID' && (
                      <Link href={`#`}>
                        <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Pay Now</button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
