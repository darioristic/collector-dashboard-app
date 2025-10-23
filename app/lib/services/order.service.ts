import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { ORDER_EVENTS } from '../events/types';
import type { Order, OrderStatus, Prisma } from '@prisma/client';

export class OrderService {
  private generateOrderNo(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async createOrder(data: Omit<Prisma.OrderCreateInput, 'orderNo' | 'company' | 'customer' | 'offer'> & { 
    companyId: string; 
    customerId: string;
    offerId?: string;
  }): Promise<Order> {
    const orderNo = this.generateOrderNo();
    
    const order = await prisma.order.create({
      data: {
        orderNo,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        currency: data.currency || 'EUR',
        status: 'DRAFT',
        notes: data.notes,
        company: {
          connect: { id: data.companyId },
        },
        customer: {
          connect: { id: data.customerId },
        },
        ...(data.offerId && {
          offer: {
            connect: { id: data.offerId },
          },
        }),
      },
      include: {
        company: true,
        customer: true,
        offer: true,
      },
    });

    await eventPublisher.publishAndStore(
      ORDER_EVENTS.CREATED,
      ORDER_EVENTS.CREATED,
      order.id,
      'Order',
      {
        orderId: order.id,
        orderNo: order.orderNo,
        companyId: order.companyId,
        customerId: order.customerId,
        offerId: order.offerId,
        total: order.total.toString(),
        currency: order.currency,
      }
    );

    return order;
  }

  async createFromOffer(offerId: string): Promise<Order> {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { company: true, customer: true },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.status !== 'ACCEPTED') {
      throw new Error('Only accepted offers can be converted to orders');
    }

    return this.createOrder({
      companyId: offer.companyId,
      customerId: offer.customerId,
      offerId: offer.id,
      items: offer.items as Prisma.InputJsonValue,
      subtotal: offer.subtotal,
      tax: offer.tax,
      total: offer.total,
      currency: offer.currency,
      notes: `Created from offer ${offer.offerNo}`,
    });
  }

  async updateOrder(id: string, data: Partial<Omit<Prisma.OrderUpdateInput, 'company' | 'customer' | 'offer'>>): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data,
      include: {
        company: true,
        customer: true,
        offer: true,
      },
    });

    await eventPublisher.publishAndStore(
      ORDER_EVENTS.UPDATED,
      ORDER_EVENTS.UPDATED,
      order.id,
      'Order',
      {
        orderId: order.id,
        orderNo: order.orderNo,
        updatedFields: Object.keys(data),
      }
    );

    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        company: true,
        customer: true,
        offer: true,
        deliveries: true,
      },
    });
  }

  async listOrders(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    customerId?: string;
    status?: OrderStatus;
  }): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, companyId, customerId, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(companyId && { companyId }),
      ...(customerId && { customerId }),
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          offer: {
            select: {
              id: true,
              offerNo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async confirmOrder(id: string): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: 'CONFIRMED' },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      ORDER_EVENTS.CONFIRMED,
      ORDER_EVENTS.CONFIRMED,
      order.id,
      'Order',
      {
        orderId: order.id,
        orderNo: order.orderNo,
        companyId: order.companyId,
        customerId: order.customerId,
      }
    );

    return order;
  }

  async fulfillOrder(id: string): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: 'FULFILLED' },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      ORDER_EVENTS.FULFILLED,
      ORDER_EVENTS.FULFILLED,
      order.id,
      'Order',
      {
        orderId: order.id,
        orderNo: order.orderNo,
        companyId: order.companyId,
        customerId: order.customerId,
      }
    );

    return order;
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        notes: reason || undefined,
      },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      ORDER_EVENTS.CANCELLED,
      ORDER_EVENTS.CANCELLED,
      order.id,
      'Order',
      {
        orderId: order.id,
        orderNo: order.orderNo,
        reason,
      }
    );

    return order;
  }

  async bulkConfirmOrders(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.order.update({
            where: { id, status: 'DRAFT' },
            data: { status: 'CONFIRMED' },
          });

          await eventPublisher.publishAndStore(
            ORDER_EVENTS.CONFIRMED,
            ORDER_EVENTS.CONFIRMED,
            id,
            'Order',
            { orderId: id, bulk: true }
          );

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({ id, error: error.message });
        }
      }
    });

    return results;
  }

  async bulkFulfillOrders(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.order.update({
            where: { id, status: 'CONFIRMED' },
            data: { status: 'FULFILLED' },
          });

          await eventPublisher.publishAndStore(
            ORDER_EVENTS.FULFILLED,
            ORDER_EVENTS.FULFILLED,
            id,
            'Order',
            { orderId: id, bulk: true }
          );

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({ id, error: error.message });
        }
      }
    });

    return results;
  }

  async bulkCancelOrders(ids: string[], reason?: string): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.order.update({
            where: { id },
            data: { status: 'CANCELLED', notes: reason },
          });

          await eventPublisher.publishAndStore(
            ORDER_EVENTS.CANCELLED,
            ORDER_EVENTS.CANCELLED,
            id,
            'Order',
            { orderId: id, reason, bulk: true }
          );

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({ id, error: error.message });
        }
      }
    });

    return results;
  }
}

export const orderService = new OrderService();

