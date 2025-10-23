import { OfferSubscriber } from './offer.subscriber';
import { OrderSubscriber } from './order.subscriber';
import { DeliverySubscriber } from './delivery.subscriber';
import { InvoiceSubscriber } from './invoice.subscriber';

export class MeilisearchSubscribers {
  private offerSubscriber: OfferSubscriber;
  private orderSubscriber: OrderSubscriber;
  private deliverySubscriber: DeliverySubscriber;
  private invoiceSubscriber: InvoiceSubscriber;

  constructor() {
    this.offerSubscriber = new OfferSubscriber();
    this.orderSubscriber = new OrderSubscriber();
    this.deliverySubscriber = new DeliverySubscriber();
    this.invoiceSubscriber = new InvoiceSubscriber();
  }

  async startAll(): Promise<void> {
    console.log('🚀 Starting Meilisearch subscribers...');
    
    await Promise.all([
      this.offerSubscriber.start(),
      this.orderSubscriber.start(),
      this.deliverySubscriber.start(),
      this.invoiceSubscriber.start(),
    ]);

    console.log('✅ All Meilisearch subscribers started');
  }

  async stopAll(): Promise<void> {
    console.log('🛑 Stopping Meilisearch subscribers...');
    
    await Promise.all([
      this.offerSubscriber.stop(),
      this.orderSubscriber.stop(),
      this.deliverySubscriber.stop(),
      this.invoiceSubscriber.stop(),
    ]);

    console.log('✅ All Meilisearch subscribers stopped');
  }
}

export const meilisearchSubscribers = new MeilisearchSubscribers();

