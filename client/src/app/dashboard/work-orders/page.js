"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from '../page.module.css'; // Reusing dashboard styles for consistency

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setWorkOrders(data);
        }
      } catch (error) {
        console.error('Error fetching work orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Work Orders</h2>
          <button className="btn-primary">+ New Work Order</button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Property</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading work orders...</td></tr>
              ) : workOrders.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No work orders found.</td></tr>
              ) : workOrders.map((wo) => (
                <tr key={wo.id}>
                  <td>#{wo.number || wo.id.substring(0, 8)}</td>
                  <td style={{ fontWeight: '500' }}>{wo.title}</td>
                  <td>{wo.property?.name}</td>
                  <td>{wo.category?.name || 'General'}</td>
                  <td><span className={styles.badge} data-status={wo.status}>{wo.status}</span></td>
                  <td><span className={styles.badge} data-priority={wo.priority}>{wo.priority}</span></td>
                  <td>{new Date(wo.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/dashboard/work-orders/${wo.id}`} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                      View
                    </Link>
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
