import { connect, NatsConnection, StringCodec } from 'nats';
import { offerIndexService } from '../indexes/offer.index';
import { OFFER_EVENTS } from '../../events/types';

export class OfferSubscriber {
  private nc: NatsConnection | null = null;
  private sc = StringCodec();

  async start(): Promise<void> {
    try {
      const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
      this.nc = await connect({ servers: natsUrl });
      console.log('✅ Offer subscriber connected to NATS');

      await offerIndexService.initialize();

      const sub = this.nc.subscribe('offer.*');
      
      for await (const msg of sub) {
        try {
          const eventData = JSON.parse(this.sc.decode(msg.data));
          await this.handleEvent(eventData);
        } catch (error) {
          console.error('❌ Failed to handle offer event:', error);
        }
      }
    } catch (error) {
      console.error('❌ Offer subscriber error:', error);
    }
  }

  private async handleEvent(event: any): Promise<void> {
    const { eventType, aggregateId, payload } = event;

    console.log(`📥 Processing offer event: ${eventType}`, aggregateId);

    switch (eventType) {
      case OFFER_EVENTS.CREATED:
      case OFFER_EVENTS.UPDATED:
      case OFFER_EVENTS.SENT:
      case OFFER_EVENTS.ACCEPTED:
      case OFFER_EVENTS.REJECTED:
        await this.retryWithBackoff(() => offerIndexService.indexOffer(aggregateId));
        break;

      default:
        console.log(`⚠️  Unhandled offer event type: ${eventType}`);
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
      console.log('🔌 Offer subscriber disconnected');
    }
  }
}

