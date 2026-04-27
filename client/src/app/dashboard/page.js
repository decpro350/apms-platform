"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setWorkOrders(data);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { 
      title: 'Open Work Orders', 
      value: workOrders.filter(wo => !['COMPLETED', 'CLOSED', 'CANCELLED'].includes(wo.status)).length, 
      change: 'Active tickets', 
      color: 'var(--primary)', 
      icon: '🔧' 
    },
    { 
      title: 'New Requests', 
      value: workOrders.filter(wo => wo.status === 'SUBMITTED').length, 
      change: 'Awaiting review', 
      color: 'var(--secondary)', 
      icon: '✨' 
    },
    { 
      title: 'Emergency Jobs', 
      value: workOrders.filter(wo => wo.priority === 'EMERGENCY' && wo.status !== 'CLOSED').length, 
      change: 'Critical attention', 
      color: 'var(--accent)', 
      icon: '🚨' 
    },
    { 
      title: 'Total Managed', 
      value: workOrders.length, 
      change: 'Lifetime volume', 
      color: '#10b981', 
      icon: '📊' 
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</span>
              <span className={styles.statChange}>{stat.change}</span>
            </div>
            <h3 className={styles.statValue}>{stat.value}</h3>
            <p className={styles.statTitle}>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3>Recent Work Orders</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Property</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>Loading...</td></tr>
                ) : workOrders.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No recent activity.</td></tr>
                ) : workOrders.slice(0, 5).map(wo => (
                  <tr key={wo.id}>
                    <td><Link href={`/dashboard/work-orders/${wo.id}`}>#{wo.number || wo.id.substring(0, 5)}</Link></td>
                    <td>{wo.property?.name || 'N/A'}</td>
                    <td>{wo.category?.name || 'General'}</td>
                    <td><span className={styles.badge} data-status={wo.status}>{wo.status}</span></td>
                    <td>{new Date(wo.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h3>Technician Workload</h3>
          <div className={styles.technicians}>
            {['John Doe', 'Jane Smith', 'Mike Ross'].map((name, i) => (
              <div key={i} className={styles.techItem}>
                <div className={styles.techInfo}>
                  <p className={styles.techName}>{name}</p>
                  <p className={styles.techStatus}>3 active jobs</p>
                </div>
                <div className={styles.techProgress}>
                  <div className={styles.progressBar} style={{ width: i === 0 ? '80%' : i === 1 ? '40%' : '100%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
