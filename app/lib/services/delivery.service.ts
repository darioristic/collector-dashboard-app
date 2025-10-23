import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { DELIVERY_EVENTS } from '../events/types';
import type { Delivery, DeliveryStatus, Prisma } from '@prisma/client';

export class DeliveryService {
  private generateDeliveryNo(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEL-${timestamp}-${random}`;
  }

  async createDelivery(data: Omit<Prisma.DeliveryCreateInput, 'deliveryNo' | 'order'> & { 
    orderId: string;
  }): Promise<Delivery> {
    const deliveryNo = this.generateDeliveryNo();
    
    const delivery = await prisma.delivery.create({
      data: {
        deliveryNo,
        deliveryDate: data.deliveryDate,
        items: data.items,
        status: 'PREPARED',
        notes: data.notes,
        order: {
          connect: { id: data.orderId },
        },
      },
      include: {
        order: {
          include: {
            company: true,
            customer: true,
          },
        },
      },
    });

    await eventPublisher.publishAndStore(
      DELIVERY_EVENTS.CREATED,
      DELIVERY_EVENTS.CREATED,
      delivery.id,
      'Delivery',
      {
        deliveryId: delivery.id,
        deliveryNo: delivery.deliveryNo,
        orderId: delivery.orderId,
        deliveryDate: delivery.deliveryDate.toISOString(),
      }
    );

    return delivery;
  }

  async createFromOrder(orderId: string, deliveryDate: Date): Promise<Delivery> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { company: true, customer: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'FULFILLED') {
      throw new Error('Only fulfilled orders can have deliveries created');
    }

    return this.createDelivery({
      orderId: order.id,
      deliveryDate,
      items: order.items as Prisma.InputJsonValue,
      notes: `Created from order ${order.orderNo}`,
    });
  }

  async updateDelivery(id: string, data: Partial<Omit<Prisma.DeliveryUpdateInput, 'order'>>): Promise<Delivery> {
    const delivery = await prisma.delivery.update({
      where: { id },
      data,
      include: {
        order: {
          include: {
            company: true,
            customer: true,
          },
        },
      },
    });

    await eventPublisher.publishAndStore(
      DELIVERY_EVENTS.UPDATED,
      DELIVERY_EVENTS.UPDATED,
      delivery.id,
      'Delivery',
      {
        deliveryId: delivery.id,
        deliveryNo: delivery.deliveryNo,
        updatedFields: Object.keys(data),
      }
    );

    return delivery;
  }

  async getDelivery(id: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            company: true,
            customer: true,
          },
        },
        invoices: true,
      },
    });
  }

  async listDeliveries(params: {
    page?: number;
    limit?: number;
    orderId?: string;
    status?: DeliveryStatus;
  }): Promise<{ deliveries: Delivery[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, orderId, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.DeliveryWhereInput = {
      ...(orderId && { orderId }),
      ...(status && { status }),
    };

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        skip,
        take: limit,
        include: {
          order: {
            select: {
              id: true,
              orderNo: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
              customer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          deliveryDate: 'desc',
        },
      }),
      prisma.delivery.count({ where }),
    ]);

    return {
      deliveries,
      total,
      page,
      limit,
    };
  }

  async markDelivered(id: string): Promise<Delivery> {
    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status: 'DELIVERED' },
      include: {
        order: {
          include: {
            company: true,
            customer: true,
          },
        },
      },
    });

    await eventPublisher.publishAndStore(
      DELIVERY_EVENTS.DELIVERED,
      DELIVERY_EVENTS.DELIVERED,
      delivery.id,
      'Delivery',
      {
        deliveryId: delivery.id,
        deliveryNo: delivery.deliveryNo,
        orderId: delivery.orderId,
      }
    );

    return delivery;
  }

  async signDelivery(id: string, signedBy: string): Promise<Delivery> {
    const delivery = await prisma.delivery.update({
      where: { id },
      data: { 
        status: 'SIGNED',
        signedBy,
        signedAt: new Date(),
      },
      include: {
        order: {
          include: {
            company: true,
            customer: true,
          },
        },
      },
    });

    await eventPublisher.publishAndStore(
      DELIVERY_EVENTS.SIGNED,
      DELIVERY_EVENTS.SIGNED,
      delivery.id,
      'Delivery',
      {
        deliveryId: delivery.id,
        deliveryNo: delivery.deliveryNo,
        orderId: delivery.orderId,
        signedBy,
        signedAt: delivery.signedAt?.toISOString(),
      }
    );

    return delivery;
  }
}

export const deliveryService = new DeliveryService();

