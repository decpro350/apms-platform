"use client";
import React, { useState } from 'react';
import styles from './workorder.module.css';

export default function WorkOrderDetail({ params }) {
  const [activeTab, setActiveTab] = useState('messages');
  const [message, setMessage] = useState('');
  const [visibility, setVisibility] = useState('INTERNAL');

  const workOrder = {
    id: params.id,
    title: 'Kitchen Sink Leaking',
    status: 'In Progress',
    priority: 'HIGH',
    property: 'Sunset Gardens',
    unit: '101A',
    tenant: 'John Tenant',
    description: 'The pipe under the kitchen sink is leaking heavily when the water is turned on. Possible crack in the P-trap.',
  };

  const messages = [
    { id: 1, user: 'APMS Admin', content: 'Technician has been dispatched.', time: '10:15 AM', type: 'INTERNAL' },
    { id: 2, user: 'John Tech', content: 'Arrived at property. Starting inspection.', time: '10:45 AM', type: 'INTERNAL' },
    { id: 3, user: 'John Tech', content: 'Initial inspection complete. Need to replace the P-trap.', time: '11:00 AM', type: 'CLIENT_VISIBLE' },
  ];

  return (
    <div className={styles.container}>
      {/* Upper Info Section */}
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={styles.badge} data-priority={workOrder.priority}>{workOrder.priority}</span>
            <span className={styles.badge} data-status={workOrder.status}>{workOrder.status}</span>
          </div>
          <h2>Ticket #{workOrder.id}: {workOrder.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{workOrder.property} • Unit {workOrder.unit}</p>
        </div>
        <div className={styles.actions}>
          <button className="btn-primary">Update Status</button>
          <button className="btn-secondary" style={{ border: '1px solid var(--border)' }}>Assign To...</button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Details */}
        <div className={styles.detailsCol}>
          <div className="glass-card">
            <h3>Description</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-main)' }}>{workOrder.description}</p>
            
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tenant</span>
                <span>{workOrder.tenant}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Access</span>
                <span>Permission to enter: Yes</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: '1.5rem' }}>
            <h3>Files & Media</h3>
            <div className={styles.fileGrid}>
              {[1, 2].map(id => (
                <div key={id} className={styles.fileItem}>
                  <div className={styles.filePlaceholder}>📄</div>
                  <span className={styles.fileName}>photo-{id}.jpg</span>
                </div>
              ))}
              <div className={styles.fileUploadBtn}>+</div>
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Financial Summary</h3>
              <button className="btn-secondary" style={{ fontSize: '0.75rem' }}>+ Add Cost</button>
            </div>
            <div className={styles.costList}>
              <div className={styles.costItem}>
                <span>Labor (2 hrs @ $75)</span>
                <span>$150.00</span>
              </div>
              <div className={styles.costItem}>
                <span>Parts (P-Trap)</span>
                <span>$45.00</span>
              </div>
              <div className={styles.costDivider}></div>
              <div className={styles.costTotal}>
                <span>Estimated Total</span>
                <span>$195.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Feed (Messages/History) */}
        <div className={styles.feedCol}>
          <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'messages' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                Messages
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>

            <div className={styles.messageList}>
              {messages.map((msg) => (
                <div key={msg.id} className={styles.message}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageUser}>{msg.user}</span>
                    <span className={styles.messageTime}>{msg.time}</span>
                  </div>
                  <p className={styles.messageContent}>{msg.content}</p>
                  <span className={styles.messageType}>{msg.type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>

            <div className={styles.messageInput}>
              <div className={styles.visibilityToggle}>
                <select 
                  value={visibility} 
                  onChange={(e) => setVisibility(e.target.value)}
                  className={styles.select}
                >
                  <option value="INTERNAL">Internal Note</option>
                  <option value="CLIENT_VISIBLE">Client Visible</option>
                  <option value="TENANT_VISIBLE">Tenant Visible</option>
                  <option value="VENDOR_VISIBLE">Vendor Visible</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <textarea 
                  placeholder="Type a message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="2"
                />
                <button className="btn-primary">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
