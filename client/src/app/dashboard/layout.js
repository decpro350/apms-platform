"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Work Orders', path: '/dashboard/work-orders', icon: '🔧' },
    { name: 'Clients', path: '/dashboard/clients', icon: '🏢' },
    { name: 'Properties', path: '/dashboard/properties', icon: '🏠' },
    { name: 'Invoices', path: '/dashboard/invoices', icon: '📄' },
    { name: 'Reports', path: '/dashboard/reports', icon: '📈' },
    { name: 'Team', path: '/dashboard/users', icon: '👥' },
    { name: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
  ];

  if (!user) return null; // Or a loading spinner

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>APMS</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={styles.toggleBtn}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{user.firstName[0]}{user.lastName[0]}</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user.firstName} {user.lastName}</p>
              <p className={styles.userRole}>{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>{navItems.find(i => i.path === pathname)?.name || 'Dashboard'}</h1>
          <div className={styles.headerActions}>
            <button className={styles.notifBtn}>🔔</button>
            <div className={styles.themeToggle}>🌙</div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
