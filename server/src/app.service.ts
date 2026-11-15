import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Injectable()
export class AppService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(@InjectConnection() private readonly conn: any) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth() {
    const conn: Connection = this.conn;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const connected = conn.readyState === 1;
    const db = conn.db;

    let counts: Record<string, number> = {};
    if (connected && db) {
      const [skills, projects, profiles, admins] = await Promise.all([
        db.collection('skills').countDocuments(),
        db.collection('projects').countDocuments(),
        db.collection('profiles').countDocuments(),
        db.collection('admin_users').countDocuments(),
      ]);
      counts = { skills, projects, profiles, admins };
    }

    return {
      status: connected ? 'ok' : 'degraded',
      service: 'portfolio-api',
      database: states[conn.readyState] ?? 'unknown',
      counts,
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  async statusPageHtml() {
    const health = await this.getHealth();
    const ok = health.status === 'ok';
    const badge = ok
      ? '<span style="background:#064e3b;color:#34d399;padding:6px 16px;border-radius:999px;font-weight:600">● ALL SYSTEMS OPERATIONAL</span>'
      : '<span style="background:#7f1d1d;color:#fca5a5;padding:6px 16px;border-radius:999px;font-weight:600">● SERVICE DEGRADED</span>';

    const cards = Object.entries(health.counts)
      .map(
        ([k, v]) => `<div style="background:#141418;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:28px;font-weight:800;color:#22d3ee">${v}</div>
          <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-top:4px">${k}</div>
        </div>`,
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta http-equiv="refresh" content="30"/>
<title>Portfolio API — Status</title>
<style>
  *{margin:0;box-sizing:border-box}
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#09090b;color:#e2e8f0;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;padding:24px}
  .card{max-width:640px;width:100%;background:#121216;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:40px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  h1{font-size:24px;font-weight:800;margin-bottom:6px}
  .sub{color:#64748b;font-size:14px;margin-bottom:24px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin:24px 0}
  .row{display:flex;justify-content:space-between;font-size:14px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)}
  .row b{color:#94a3b8;font-weight:500}
  .row span{font-family:ui-monospace,monospace}
  a{color:#22d3ee;text-decoration:none}
  a:hover{text-decoration:underline}
  .links{margin-top:24px;font-size:13px;color:#64748b}
</style>
</head>
<body>
  <div class="card">
    <h1>Portfolio API</h1>
    <p class="sub">abdallahhamada2103 · Full-Stack Developer</p>
    <div>${badge}</div>
    <div class="grid">${cards}</div>
    <div class="row"><b>Service</b><span>${health.service}</span></div>
    <div class="row"><b>Database</b><span>${health.database}</span></div>
    <div class="row"><b>Uptime</b><span>${health.uptimeSeconds}s</span></div>
    <div class="row"><b>Checked at</b><span>${new Date().toISOString()}</span></div>
    <p class="links">Endpoints: <a href="/api/portfolio">/api/portfolio</a> · <a href="/api/health">/api/health</a> (JSON) · auto-refreshes every 30s</p>
  </div>
</body>
</html>`;
  }
}
