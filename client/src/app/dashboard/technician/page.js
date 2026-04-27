"use client";
import React from 'react';
import styles from '../dashboard.module.css';

export default function TechnicianDashboard() {
  const assignments = [
    { id: '1024', property: 'Sunset Gardens', unit: '101A', title: 'Leaking Sink', status: 'In Progress', priority: 'HIGH' },
    { id: '1025', property: 'Oak Ridge', unit: '302', title: 'Broken Window', status: 'Assigned', priority: 'MEDIUM' },
  ];

  return (
    <div>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))', color: 'white', marginBottom: '2rem' }}>
        <h2>Good Morning, Tech!</h2>
        <p>You have 2 jobs assigned for today. Stay safe out there.</p>
      </div>

      <div className={styles.section}>
        <h3>Your Active Assignments</h3>
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {assignments.map(job => (
            <div key={job.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.125rem' }}>#{job.id}: {job.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{job.property} • Unit {job.unit}</p>
                </div>
                <span className={styles.badge}>{job.status}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}>Update Status</button>
                <button className="btn-secondary" style={{ flex: 1, fontSize: '0.875rem', border: '1px solid var(--border)' }}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
