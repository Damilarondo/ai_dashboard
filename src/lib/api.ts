export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8000';

export interface Incident {
  id: string;
  timestamp: string;
  server: string;
  error_code: string;
  root_cause: string | null;
  raw_logs: string;
  ai_analysis: string;
  remediation_commands: string;
  execution_result: string | null;
  mttr_seconds: number;
  status: string;
  recommendations: string;
  affected_services?: string;
}

export interface Metrics {
  total_incidents: number;
  resolved_incidents: number;
  success_rate: number;
  avg_mttr_seconds: number;
  agents_online: number;
  agents_total: number;
  daily_trend: { day: string; count: number }[];
}

export interface SystemMetrics {
  timestamp: string;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  server: string;
  processes?: any[];
  services?: Record<string, any>;
}

export interface AppConfig {
  model_id: string;
  temperature: number;
  max_tokens: number;
  remediation_mode: string;
  system_prompt: string;
}

export interface Agent {
  id: string;
  server_name: string;
  server_ip: string;
  last_heartbeat: string;
  status: string;
  config: string | null;
}

export async function fetchMetrics(): Promise<Metrics> {
  const res = await fetch(`${API_URL}/metrics`, { cache: 'no-store' });
  return res.json();
}

export async function fetchIncidents(page = 1, search = '', status = ''): Promise<{ incidents: Incident[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), per_page: '20' });
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const res = await fetch(`${API_URL}/incidents?${params}`, { cache: 'no-store' });
  return res.json();
}

export async function fetchIncident(id: string): Promise<Incident> {
  const res = await fetch(`${API_URL}/incidents/${id}`, { cache: 'no-store' });
  return res.json();
}

export async function fetchConfig(): Promise<AppConfig> {
  const res = await fetch(`${API_URL}/config`, { cache: 'no-store' });
  return res.json();
}

export async function updateConfig(config: Partial<AppConfig>): Promise<AppConfig> {
  const res = await fetch(`${API_URL}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return (await res.json()).config;
}

export async function fetchAgents(): Promise<{ agents: Agent[] }> {
  const res = await fetch(`${API_URL}/agents`, { cache: 'no-store' });
  return res.json();
}

export async function fetchSystemMetrics(limit = 50): Promise<SystemMetrics[]> {
  const res = await fetch(`${API_URL}/metrics/system?limit=${limit}`, { cache: 'no-store' });
  return res.json();
}

export async function approveIncident(id: string, action: string, editedCommands?: string) {
  const res = await fetch(`${API_URL}/incidents/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, edited_commands: editedCommands }),
  });
  return res.json();
}

export async function injectTest(errorType: string, customLog?: string) {
  const res = await fetch(`${API_URL}/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error_type: errorType, custom_log: customLog }),
  });
  return res.json();
}

export function createWebSocket(): WebSocket {
  let wsUrl = API_URL;
  if (wsUrl.startsWith('https://')) {
    wsUrl = wsUrl.replace('https://', 'wss://');
  } else if (wsUrl.startsWith('http://')) {
    wsUrl = wsUrl.replace('http://', 'ws://');
  } else if (wsUrl.startsWith('/')) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = `${protocol}//${window.location.host}${wsUrl}`;
  }
  return new WebSocket(`${wsUrl}/ws`);
}
