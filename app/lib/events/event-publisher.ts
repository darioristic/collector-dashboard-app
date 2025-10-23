import { eventBus, type DomainEvent } from './event-bus';
import { prisma } from '../prisma';

export class EventPublisher {
  async publishAndStore(
    subject: string,
    eventType: string,
    aggregateId: string,
    aggregateType: string,
    payload: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<void> {
    const event: DomainEvent = {
      eventType,
      aggregateId,
      aggregateType,
      payload,
      metadata,
      occurredAt: new Date(),
    };

    try {
      await prisma.domainEvent.create({
        data: {
          eventType: event.eventType,
          aggregateId: event.aggregateId,
          aggregateType: event.aggregateType,
          payload: event.payload,
          metadata: event.metadata || {},
          occurredAt: event.occurredAt,
        },
      });

      await eventBus.publish(subject, event);
    } catch (error) {
      console.error('Failed to publish and store event:', error);
      throw error;
    }
  }
}

export const eventPublisher = new EventPublisher();

