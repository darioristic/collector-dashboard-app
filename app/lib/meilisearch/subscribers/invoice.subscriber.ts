import { connect, NatsConnection, StringCodec } from 'nats';
import { invoiceIndexService } from '../indexes/invoice.index';
import { INVOICE_EVENTS } from '../../events/types';

export class InvoiceSubscriber {
  private nc: NatsConnection | null = null;
  private sc = StringCodec();

  async start(): Promise<void> {
    try {
      const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
      this.nc = await connect({ servers: natsUrl });
      console.log('✅ Invoice subscriber connected to NATS');

      await invoiceIndexService.initialize();

      const sub = this.nc.subscribe('invoice.*');
      
      for await (const msg of sub) {
        try {
          const eventData = JSON.parse(this.sc.decode(msg.data));
          await this.handleEvent(eventData);
        } catch (error) {
          console.error('❌ Failed to handle invoice event:', error);
        }
      }
    } catch (error) {
      console.error('❌ Invoice subscriber error:', error);
    }
  }

  private async handleEvent(event: any): Promise<void> {
    const { eventType, aggregateId, payload } = event;

    console.log(`📥 Processing invoice event: ${eventType}`, aggregateId);

    switch (eventType) {
      case INVOICE_EVENTS.CREATED:
      case INVOICE_EVENTS.UPDATED:
      case INVOICE_EVENTS.SENT:
      case INVOICE_EVENTS.PAID:
      case INVOICE_EVENTS.OVERDUE:
      case INVOICE_EVENTS.CANCELLED:
        await this.retryWithBackoff(() => invoiceIndexService.indexInvoice(aggregateId));
        break;

      default:
        console.log(`⚠️  Unhandled invoice event type: ${eventType}`);
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
      console.log('🔌 Invoice subscriber disconnected');
    }
  }
}

