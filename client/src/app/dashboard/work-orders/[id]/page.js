"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './workorder.module.css';

export default function WorkOrderDetail({ params }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState('messages');
  const [message, setMessage] = useState('');
  const [visibility, setVisibility] = useState('INTERNAL');
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setWorkOrder(data);
        }
      } catch (error) {
        console.error('Error fetching work order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrder();
  }, [id]);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!workOrder) return <div className={styles.container}>Work Order not found</div>;

  const messages = workOrder.messages || [];

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workOrderId: id,
          content: message,
          visibility
        })
      });

      if (res.ok) {
        setMessage('');
        // Refresh work order to show new message
        const updatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updatedData = await updatedRes.json();
        setWorkOrder(updatedData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Upper Info Section */}
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className={styles.badge} data-priority={workOrder.priority}>{workOrder.priority}</span>
            <span className={styles.badge} data-status={workOrder.status}>{workOrder.status}</span>
          </div>
          <h2>Ticket #{workOrder.number || workOrder.id}: {workOrder.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{workOrder.property?.name} • Unit {workOrder.unit?.number}</p>
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
                <span>{workOrder.tenant?.user ? `${workOrder.tenant.user.firstName} ${workOrder.tenant.user.lastName}` : 'N/A'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Access</span>
                <span>Permission to enter: {workOrder.permissionToEnter ? 'Yes' : 'No'}</span>
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
              {workOrder.costs?.map((cost) => (
                <div key={cost.id} className={styles.costItem}>
                  <span>{cost.description || cost.type}</span>
                  <span>${cost.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className={styles.costDivider}></div>
              <div className={styles.costTotal}>
                <span>Total Cost</span>
                <span>${workOrder.costs?.reduce((sum, c) => sum + c.amount, 0).toFixed(2) || '0.00'}</span>
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
                    <span className={styles.messageUser}>{msg.user?.firstName} {msg.user?.lastName}</span>
                    <span className={styles.messageTime}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className={styles.messageContent}>{msg.content}</p>
                  <span className={styles.messageType} data-type={msg.visibility}>{msg.visibility?.replace('_', ' ')}</span>
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
                <button className="btn-primary" onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
