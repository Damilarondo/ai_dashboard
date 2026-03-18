'use client';
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { API_URL } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!crypto || !crypto.subtle) {
        throw new Error('Crypto API not available. Please ensure you are using a secure context (HTTPS).');
      }

      // Hash password before sending, matching what install.sh stores
      const encoder = new TextEncoder();
      const hashData = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', hashData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: passwordHash })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
        const errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
        throw new Error(errorMessage || 'Invalid username or password');
      }

      const loginData = await res.json();
      login(loginData.access_token, {
        username,
        tenant_id: loginData.tenant_id,
        role: loginData.role
      });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0a0a0f 0%, #000 100%)',
    }}>
      <div className="glass-card glow-cyan" style={{ width: '400px', padding: '40px', borderRadius: '24px' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 700, color: '#fff',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
          }}>A</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Control Plane</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure Multi-Tenant Access</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '8px', marginTop: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none',
              color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
