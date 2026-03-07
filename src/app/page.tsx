'use client';
import { useEffect, useState } from 'react';
import { fetchMetrics, fetchIncidents, createWebSocket, type Metrics, type Incident } from '@/lib/api';

interface LiveEvent {
  type: string;
  incident_id?: string;
  server?: string;
  timestamp?: string;
  preview?: string;
  mttr?: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [activeNode, setActiveNode] = useState<string>('');

  useEffect(() => {
    // Fetch initial data
    fetchMetrics().then(setMetrics).catch(console.error);
    fetchIncidents(1).then(data => setRecentIncidents(data.incidents.slice(0, 5))).catch(console.error);

    // WebSocket for live events
    const ws = createWebSocket();
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEvents(prev => [data, ...prev].slice(0, 50));

      // Update workflow visualization
      if (data.type === 'error_detected') setActiveNode('detect');
      else if (data.type === 'analyzing') setActiveNode('analyze');
      else if (data.type === 'analysis_complete' || data.type === 'pending_approval') setActiveNode('remediate');
      else if (data.type === 'resolved') setActiveNode('verify');

      // Refresh metrics on new events
      fetchMetrics().then(setMetrics).catch(console.error);
      fetchIncidents(1).then(data => setRecentIncidents(data.incidents.slice(0, 5))).catch(console.error);
    };

    // Refresh metrics every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics().then(setMetrics).catch(console.error);
    }, 30000);

    return () => { ws.close(); clearInterval(interval); };
  }, []);

  const workflowNodes = ['Detect', 'Analyze', 'Remediate', 'Verify'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time system overview</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card glow-cyan">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Total Incidents</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{metrics?.total_incidents ?? '—'}</div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Mean Time to Repair</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-green)' }}>{metrics ? `${metrics.avg_mttr_seconds.toFixed(0)}s` : '—'}</div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Success Rate</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: metrics && metrics.success_rate >= 90 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>{metrics ? `${metrics.success_rate}%` : '—'}</div>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Active Agents</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{metrics ? `${metrics.agents_online}/${metrics.agents_total || 1}` : '—'}</div>
        </div>
      </div>

      {/* Middle Row: Live Feed + Workflow */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Live Event Feed */}
        <div className="glass-card" style={{ maxHeight: '360px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Live Event Feed</h2>
            <div className="pulse-dot" />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '290px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {events.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>
                Waiting for events...
              </p>
            ) : (
              events.map((evt, i) => (
                <div key={i} className={`feed-item ${evt.type === 'error_detected' ? 'error' : evt.type === 'analyzing' ? 'analyzing' : 'resolved'}`}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {evt.type === 'error_detected' && '🔴 Error Detected'}
                      {evt.type === 'analyzing' && '🟡 AI Analyzing...'}
                      {evt.type === 'analysis_complete' && '🟢 Analysis Complete'}
                      {evt.type === 'pending_approval' && '🟠 Pending Approval'}
                      {evt.type === 'resolved' && '✅ Resolved'}
                      {evt.type === 'failed' && '❌ Failed'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {evt.incident_id} {evt.server ? `• ${evt.server}` : ''} {evt.mttr ? `• ${evt.mttr.toFixed(0)}s` : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Agent Workflow Visualizer */}
        <div className="glass-card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>Agent Workflow</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 0' }}>
            {workflowNodes.map((node, i) => (
              <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className={`workflow-node ${activeNode === node.toLowerCase() ? 'active' : ''}`}>
                  {node}
                </div>
                {i < workflowNodes.length - 1 && <span className="workflow-arrow">→</span>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {activeNode ? `Currently: ${activeNode.charAt(0).toUpperCase() + activeNode.slice(1)}` : 'Idle — waiting for events'}
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Recent Incidents</h2>
          <a href="/incidents" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>View all →</a>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Server</th>
              <th>Error</th>
              <th>MTTR</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentIncidents.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>No incidents yet</td></tr>
            ) : (
              recentIncidents.map(inc => (
                <tr key={inc.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/incidents/${inc.id}`}>
                  <td style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {new Date(inc.timestamp).toLocaleString()}
                  </td>
                  <td>{inc.server}</td>
                  <td style={{ fontFamily: 'monospace' }}>{inc.error_code}</td>
                  <td>{inc.mttr_seconds.toFixed(0)}s</td>
                  <td>
                    <span className={`badge badge-${inc.status === 'resolved' ? 'resolved' : inc.status === 'failed' ? 'failed' : 'pending'}`}>
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
