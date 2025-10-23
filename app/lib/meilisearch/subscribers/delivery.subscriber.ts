import { connect, NatsConnection, StringCodec } from 'nats';
import { deliveryIndexService } from '../indexes/delivery.index';
import { DELIVERY_EVENTS } from '../../events/types';

export class DeliverySubscriber {
  private nc: NatsConnection | null = null;
  private sc = StringCodec();

  async start(): Promise<void> {
    try {
      const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
      this.nc = await connect({ servers: natsUrl });
      console.log('✅ Delivery subscriber connected to NATS');

      await deliveryIndexService.initialize();

      const sub = this.nc.subscribe('delivery.*');
      
      for await (const msg of sub) {
        try {
          const eventData = JSON.parse(this.sc.decode(msg.data));
          await this.handleEvent(eventData);
        } catch (error) {
          console.error('❌ Failed to handle delivery event:', error);
        }
      }
    } catch (error) {
      console.error('❌ Delivery subscriber error:', error);
    }
  }

  private async handleEvent(event: any): Promise<void> {
    const { eventType, aggregateId, payload } = event;

    console.log(`📥 Processing delivery event: ${eventType}`, aggregateId);

    switch (eventType) {
      case DELIVERY_EVENTS.CREATED:
      case DELIVERY_EVENTS.UPDATED:
      case DELIVERY_EVENTS.DELIVERED:
      case DELIVERY_EVENTS.SIGNED:
        await this.retryWithBackoff(() => deliveryIndexService.indexDelivery(aggregateId));
        break;

      default:
        console.log(`⚠️  Unhandled delivery event type: ${eventType}`);
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
      console.log('🔌 Delivery subscriber disconnected');
    }
  }
}

