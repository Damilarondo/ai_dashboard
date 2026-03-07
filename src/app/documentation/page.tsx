'use client';
import { useEffect, useState } from 'react';
import { fetchIncidents, type Incident } from '@/lib/api';

export default function DocumentationPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIncidents(1, search, 'resolved').then(data => setIncidents(data.incidents)).catch(console.error);
  }, [search]);

  const selected = incidents.find(i => i.id === selectedId);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Documentation</h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Auto-generated incident reports with full AI analysis, remediation steps, and recommendations</p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', minHeight: '70vh' }}>
        {/* Report List */}
        <div className="glass-card" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
          <input className="input" placeholder="Search reports..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ marginBottom: '12px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {incidents.map(inc => (
              <div key={inc.id} onClick={() => setSelectedId(inc.id)} style={{
                padding: '12px', borderRadius: '8px', cursor: 'pointer',
                background: selectedId === inc.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                border: `1px solid ${selectedId === inc.id ? 'var(--accent-cyan)' : 'transparent'}`,
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{inc.id}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{inc.error_code} • {inc.mttr_seconds.toFixed(0)}s</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{new Date(inc.timestamp).toLocaleString()}</div>
              </div>
            ))}
            {incidents.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No resolved incidents yet</p>
            )}
          </div>
        </div>

        {/* Report Detail */}
        {selected ? (
          <div className="glass-card" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', marginBottom: '20px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(168, 85, 247, 0.05))',
              borderRadius: '8px', border: '1px solid var(--border)',
            }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace' }}>INCIDENT REPORT</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{selected.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${selected.status === 'resolved' ? 'resolved' : 'failed'}`}>{selected.status}</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>MTTR: {selected.mttr_seconds.toFixed(0)}s</div>
              </div>
            </div>

            {/* Section 1: Problem */}
            <ReportSection number="1" title="PROBLEM DESCRIPTION" color="var(--accent-red)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div><Label>Time Detected</Label><Value>{new Date(selected.timestamp).toLocaleString()}</Value></div>
                <div><Label>Server</Label><Value>{selected.server}</Value></div>
                <div><Label>Error Code</Label><Value>{selected.error_code}</Value></div>
              </div>
              <Label>Raw Log Entry</Label>
              <pre style={{ fontSize: '0.75rem', background: '#000', padding: '10px', borderRadius: '6px', overflow: 'auto', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                {selected.raw_logs}
              </pre>
            </ReportSection>

            {/* Section 2: Analysis */}
            <ReportSection number="2" title="AI ANALYSIS (Root Cause)" color="var(--accent-cyan)">
              <p style={{ fontSize: '0.8rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.ai_analysis}</p>
            </ReportSection>

            {/* Section 3: Remediation */}
            <ReportSection number="3" title="REMEDIATION STEPS" color="var(--accent-green)">
              <pre style={{ fontSize: '0.75rem', background: '#000', padding: '12px', borderRadius: '6px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                {selected.remediation_commands}
              </pre>
            </ReportSection>

            {/* Section 4: Result */}
            <ReportSection number="4" title="RESULT" color="var(--accent-purple)">
              <p style={{ fontSize: '0.8rem', lineHeight: 1.7 }}>
                {selected.execution_result || 'Remediation commands were sent to the agent for execution.'}
              </p>
            </ReportSection>

            {/* Section 5: Recommendations */}
            {selected.recommendations && (
              <ReportSection number="5" title="RECOMMENDATIONS" color="var(--accent-yellow)">
                <p style={{ fontSize: '0.8rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.recommendations}</p>
              </ReportSection>
            )}
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select an incident to view its report</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportSection({ number, title, color, children }: { number: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ background: color, color: '#000', width: '22px', height: '22px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{number}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{children}</div>;
}

function Value({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{children}</div>;
}
