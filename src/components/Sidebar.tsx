'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/incidents', label: 'Incidents', icon: '🔔' },
  { href: '/documentation', label: 'Documentation', icon: '📄' },
  { href: '/operations', label: 'Operations', icon: '⚙️' },
  { href: '/agents', label: 'Agents', icon: '🖥️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      width: '240px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 700, color: '#fff',
          }}>A</div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Control Plane</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Network Troubleshooter</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Status */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div className="pulse-dot" />
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>All Systems Online</span>
      </div>
    </aside>
  );
}
