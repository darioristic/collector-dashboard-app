import { cache, CacheKeys, CacheTTL } from './redis';

export interface Session {
  token: string;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
  metadata?: Record<string, unknown>;
}

export class SessionManager {
  async create(session: Omit<Session, 'createdAt' | 'expiresAt'>): Promise<Session> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CacheTTL.SESSION * 1000);
    
    const fullSession: Session = {
      ...session,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    const key = CacheKeys.session(session.token);
    await cache.set(key, fullSession, CacheTTL.SESSION);

    // Also store by user ID for multi-session management
    const userSessionsKey = `sessions:user:${session.userId}`;
    await cache['client'].sadd(userSessionsKey, session.token);
    await cache['client'].expire(userSessionsKey, CacheTTL.SESSION);

    return fullSession;
  }

  async get(token: string): Promise<Session | null> {
    const key = CacheKeys.session(token);
    const session = await cache.get<Session>(key);
    
    if (!session) {
      return null;
    }

    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      await this.delete(token);
      return null;
    }

    return session;
  }

  async update(token: string, updates: Partial<Session>): Promise<Session | null> {
    const session = await this.get(token);
    if (!session) {
      return null;
    }

    const updatedSession = { ...session, ...updates };
    const key = CacheKeys.session(token);
    
    // Calculate remaining TTL
    const expiresAt = new Date(updatedSession.expiresAt);
    const now = new Date();
    const ttl = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
    
    await cache.set(key, updatedSession, ttl);
    return updatedSession;
  }

  async delete(token: string): Promise<void> {
    const session = await this.get(token);
    if (session) {
      // Remove from user sessions set
      const userSessionsKey = `sessions:user:${session.userId}`;
      await cache['client'].srem(userSessionsKey, token);
    }

    const key = CacheKeys.session(token);
    await cache.del(key);
  }

  async refresh(token: string, extensionMs: number = CacheTTL.SESSION * 1000): Promise<Session | null> {
    const session = await this.get(token);
    if (!session) {
      return null;
    }

    const expiresAt = new Date(Date.now() + extensionMs);
    return this.update(token, { expiresAt: expiresAt.toISOString() });
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const userSessionsKey = `sessions:user:${userId}`;
    const tokens = await cache['client'].smembers(userSessionsKey);
    
    const sessions: Session[] = [];
    for (const token of tokens) {
      const session = await this.get(token);
      if (session) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  async deleteUserSessions(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);
    for (const session of sessions) {
      await this.delete(session.token);
    }
  }

  async cleanup(): Promise<number> {
    // This would be called by a cron job
    // Redis TTL handles most cleanup automatically
    return 0;
  }
}

export const sessionManager = new SessionManager();

