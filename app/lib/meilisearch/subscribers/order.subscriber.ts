import { connect, NatsConnection, StringCodec } from 'nats';
import { orderIndexService } from '../indexes/order.index';
import { ORDER_EVENTS } from '../../events/types';

export class OrderSubscriber {
  private nc: NatsConnection | null = null;
  private sc = StringCodec();

  async start(): Promise<void> {
    try {
      const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
      this.nc = await connect({ servers: natsUrl });
      console.log('✅ Order subscriber connected to NATS');

      await orderIndexService.initialize();

      const sub = this.nc.subscribe('order.*');
      
      for await (const msg of sub) {
        try {
          const eventData = JSON.parse(this.sc.decode(msg.data));
          await this.handleEvent(eventData);
        } catch (error) {
          console.error('❌ Failed to handle order event:', error);
        }
      }
    } catch (error) {
      console.error('❌ Order subscriber error:', error);
    }
  }

  private async handleEvent(event: any): Promise<void> {
    const { eventType, aggregateId, payload } = event;

    console.log(`📥 Processing order event: ${eventType}`, aggregateId);

    switch (eventType) {
      case ORDER_EVENTS.CREATED:
      case ORDER_EVENTS.UPDATED:
      case ORDER_EVENTS.CONFIRMED:
      case ORDER_EVENTS.FULFILLED:
      case ORDER_EVENTS.CANCELLED:
        await this.retryWithBackoff(() => orderIndexService.indexOrder(aggregateId));
        break;

      default:
        console.log(`⚠️  Unhandled order event type: ${eventType}`);
    }
  }

  private async retryWithBackoff(
    fn: () => Promise<void>,
    maxRetries = 3,
    delay = 1000
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn();
        return;
      } catch (error) {
        console.error(`❌ Retry ${i + 1}/${maxRetries} failed:`, error);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    throw new Error('Max retries exceeded');
  }

  async stop(): Promise<void> {
    if (this.nc) {
      await this.nc.drain();
      this.nc = null;
      console.log('🔌 Order subscriber disconnected');
    }
  }
}

