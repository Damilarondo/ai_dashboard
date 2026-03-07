'use client';
import { useEffect, useState } from 'react';
import { fetchAgents, type Agent } from '@/lib/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetchAgents().then(data => setAgents(data.agents)).catch(console.error);
    const interval = setInterval(() => {
      fetchAgents().then(data => setAgents(data.agents)).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Agents</h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Monitor and manage connected server agents</p>

      {agents.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🖥️</div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>No Agents Registered</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            Agents will appear here once they send their first heartbeat to the control plane.
            The DigitalOcean agent client needs to be updated with heartbeat support.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {agents.map(agent => (
            <div key={agent.id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                  }}>🖥️</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{agent.server_name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{agent.server_ip}</div>
                  </div>
                </div>
                <span className={`badge badge-${agent.status === 'online' ? 'resolved' : 'failed'}`}>
                  {agent.status}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Last heartbeat: {agent.last_heartbeat ? new Date(agent.last_heartbeat).toLocaleString() : 'Never'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
