import { eventBus, type DomainEvent } from './event-bus';
import { OFFER_EVENTS, ORDER_EVENTS, DELIVERY_EVENTS } from './types';
import { orderService } from '../services/order.service';
import { deliveryService } from '../services/delivery.service';
import { invoiceService } from '../services/invoice.service';
import { StringCodec } from 'nats';

export class EventSubscriber {
  private sc = StringCodec();
  private subscriptions: any[] = [];

  async start(): Promise<void> {
    try {
      await eventBus.connect();
      
      await this.subscribeToOfferEvents();
      await this.subscribeToOrderEvents();
      await this.subscribeToDeliveryEvents();

      console.log('✅ Event Subscriber started successfully');
    } catch (error) {
      console.error('❌ Failed to start Event Subscriber:', error);
    }
  }

  private async subscribeToOfferEvents(): Promise<void> {
    const nc = (eventBus as any).nc;
    if (!nc) return;

    const sub = nc.subscribe(OFFER_EVENTS.ACCEPTED);
    
    (async () => {
      for await (const msg of sub) {
        try {
          const event: DomainEvent = JSON.parse(this.sc.decode(msg.data));
          console.log(`📥 Received ${event.eventType}:`, event.aggregateId);

          await this.handleOfferAccepted(event);
        } catch (error) {
          console.error('Error processing offer.accepted event:', error);
        }
      }
    })();

    this.subscriptions.push(sub);
  }

  private async subscribeToOrderEvents(): Promise<void> {
    const nc = (eventBus as any).nc;
    if (!nc) return;

    const sub = nc.subscribe(ORDER_EVENTS.FULFILLED);
    
    (async () => {
      for await (const msg of sub) {
        try {
          const event: DomainEvent = JSON.parse(this.sc.decode(msg.data));
          console.log(`📥 Received ${event.eventType}:`, event.aggregateId);

          await this.handleOrderFulfilled(event);
        } catch (error) {
          console.error('Error processing order.fulfilled event:', error);
        }
      }
    })();

    this.subscriptions.push(sub);
  }

  private async subscribeToDeliveryEvents(): Promise<void> {
    const nc = (eventBus as any).nc;
    if (!nc) return;

    const sub = nc.subscribe(DELIVERY_EVENTS.SIGNED);
    
    (async () => {
      for await (const msg of sub) {
        try {
          const event: DomainEvent = JSON.parse(this.sc.decode(msg.data));
          console.log(`📥 Received ${event.eventType}:`, event.aggregateId);

          await this.handleDeliverySigned(event);
        } catch (error) {
          console.error('Error processing delivery.signed event:', error);
        }
      }
    })();

    this.subscriptions.push(sub);
  }

  private async handleOfferAccepted(event: DomainEvent): Promise<void> {
    try {
      const offerId = event.aggregateId;
      
      console.log(`🔄 Creating order from accepted offer: ${offerId}`);
      const order = await orderService.createFromOffer(offerId);
      console.log(`✅ Order created: ${order.orderNo}`);
    } catch (error) {
      console.error(`❌ Failed to create order from offer ${event.aggregateId}:`, error);
    }
  }

  private async handleOrderFulfilled(event: DomainEvent): Promise<void> {
    try {
      const orderId = event.aggregateId;
      
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2);

      console.log(`🔄 Creating delivery for fulfilled order: ${orderId}`);
      const delivery = await deliveryService.createFromOrder(orderId, deliveryDate);
      console.log(`✅ Delivery created: ${delivery.deliveryNo}`);
    } catch (error) {
      console.error(`❌ Failed to create delivery from order ${event.aggregateId}:`, error);
    }
  }

  private async handleDeliverySigned(event: DomainEvent): Promise<void> {
    try {
      const deliveryId = event.aggregateId;
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      console.log(`🔄 Creating invoice for signed delivery: ${deliveryId}`);
      const invoice = await invoiceService.createFromDelivery(deliveryId, dueDate);
      console.log(`✅ Invoice created: ${invoice.invoiceNo}`);
    } catch (error) {
      console.error(`❌ Failed to create invoice from delivery ${event.aggregateId}:`, error);
    }
  }

  async stop(): Promise<void> {
    for (const sub of this.subscriptions) {
      try {
        await sub.drain();
      } catch (error) {
        console.error('Error draining subscription:', error);
      }
    }
    this.subscriptions = [];
    
    await eventBus.close();
    console.log('🔌 Event Subscriber stopped');
  }
}

export const eventSubscriber = new EventSubscriber();

