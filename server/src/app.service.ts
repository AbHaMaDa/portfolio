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
}
