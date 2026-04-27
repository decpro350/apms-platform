"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './tenant.module.css';

export default function TenantLayout({ children }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>APMS</h1>
          <span>Tenant Portal</span>
        </div>
        <div className={styles.userNav}>
          <span>Welcome, {user.firstName}</span>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <nav className={styles.mobileNav}>
        <div className={styles.navItem}>🏠 Home</div>
        <div className={styles.navItem}>🔧 Requests</div>
        <div className={styles.navItem}>💬 Messages</div>
        <div className={styles.navItem}>👤 Profile</div>
      </nav>
    </div>
  );
}
