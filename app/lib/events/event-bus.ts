import { connect, NatsConnection, StringCodec } from 'nats';

export type DomainEvent = {
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  occurredAt: Date;
};

class EventBus {
  private nc: NatsConnection | null = null;
  private sc = StringCodec();
  private connecting: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.nc) return;
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      try {
        const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
        this.nc = await connect({ servers: natsUrl });
        console.log(`✅ Connected to NATS at ${natsUrl}`);
      } catch (error) {
        console.error('❌ Failed to connect to NATS:', error);
        this.nc = null;
      } finally {
        this.connecting = null;
      }
    })();

    return this.connecting;
  }

  async publish(subject: string, event: DomainEvent): Promise<void> {
    if (!this.nc) {
      await this.connect();
    }

    if (!this.nc) {
      console.warn(`⚠️  NATS not connected, skipping event: ${subject}`);
      return;
    }

    try {
      const eventData = {
        ...event,
        occurredAt: event.occurredAt.toISOString(),
      };

      this.nc.publish(subject, this.sc.encode(JSON.stringify(eventData)));
      console.log(`📤 Published event: ${subject}`, event.eventType);
    } catch (error) {
      console.error(`❌ Failed to publish event ${subject}:`, error);
    }
  }

  async close(): Promise<void> {
    if (this.nc) {
      await this.nc.drain();
      this.nc = null;
      console.log('🔌 NATS connection closed');
    }
  }
}

export const eventBus = new EventBus();

