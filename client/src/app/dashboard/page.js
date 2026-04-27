"use client";
import React from 'react';
import styles from './page.module.css';

export default function DashboardPage() {
  const stats = [
    { title: 'Open Work Orders', value: '42', change: '+5 from yesterday', color: 'var(--primary)', icon: '🔧' },
    { title: 'New Requests', value: '12', change: '8 pending review', color: 'var(--secondary)', icon: '✨' },
    { title: 'Emergency Jobs', value: '3', change: 'All dispatched', color: 'var(--accent)', icon: '🚨' },
    { title: 'Billable (MTD)', value: '$12,450', change: '+12% vs last month', color: '#10b981', icon: '💰' },
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
                {[1024, 1025, 1026, 1027].map(id => (
                  <tr key={id}>
                    <td>#{id}</td>
                    <td>Sunrise Apartments</td>
                    <td>Plumbing</td>
                    <td><span className={styles.badge}>In Progress</span></td>
                    <td>Oct 24, 2023</td>
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
