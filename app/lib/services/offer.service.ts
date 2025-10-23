import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { OFFER_EVENTS, ORDER_EVENTS } from '../events/types';
import type { Offer, OfferStatus, Prisma } from '@prisma/client';

export class OfferService {
  private generateOfferNo(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `OFF-${timestamp}-${random}`;
  }

  async createOffer(data: Omit<Prisma.OfferCreateInput, 'offerNo' | 'company' | 'customer'> & { 
    companyId: string; 
    customerId: string;
  }): Promise<Offer> {
    const offerNo = this.generateOfferNo();
    
    const offer = await prisma.offer.create({
      data: {
        offerNo,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        currency: data.currency || 'EUR',
        validUntil: data.validUntil,
        status: 'DRAFT',
        notes: data.notes,
        company: {
          connect: { id: data.companyId },
        },
        customer: {
          connect: { id: data.customerId },
        },
      },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      OFFER_EVENTS.CREATED,
      OFFER_EVENTS.CREATED,
      offer.id,
      'Offer',
      {
        offerId: offer.id,
        offerNo: offer.offerNo,
        companyId: offer.companyId,
        customerId: offer.customerId,
        total: offer.total.toString(),
        currency: offer.currency,
      }
    );

    return offer;
  }

  async updateOffer(id: string, data: Partial<Omit<Prisma.OfferUpdateInput, 'company' | 'customer'>>): Promise<Offer> {
    const offer = await prisma.offer.update({
      where: { id },
      data,
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      OFFER_EVENTS.UPDATED,
      OFFER_EVENTS.UPDATED,
      offer.id,
      'Offer',
      {
        offerId: offer.id,
        offerNo: offer.offerNo,
        updatedFields: Object.keys(data),
      }
    );

    return offer;
  }

  async getOffer(id: string): Promise<Offer | null> {
    return prisma.offer.findUnique({
      where: { id },
      include: {
        company: true,
        customer: true,
        orders: true,
      },
    });
  }

  async listOffers(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    customerId?: string;
    status?: OfferStatus;
  }): Promise<{ offers: Offer[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, companyId, customerId, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OfferWhereInput = {
      ...(companyId && { companyId }),
      ...(customerId && { customerId }),
      ...(status && { status }),
    };

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.offer.count({ where }),
    ]);

    return {
      offers,
      total,
      page,
      limit,
    };
  }

  async approveOffer(id: string): Promise<Offer> {
    const offer = await prisma.$transaction(async (tx) => {
      const updatedOffer = await tx.offer.update({
        where: { id },
        data: { status: 'ACCEPTED' },
        include: {
          company: true,
          customer: true,
        },
      });

      await eventPublisher.publishAndStore(
        OFFER_EVENTS.ACCEPTED,
        OFFER_EVENTS.ACCEPTED,
        updatedOffer.id,
        'Offer',
        {
          offerId: updatedOffer.id,
          offerNo: updatedOffer.offerNo,
          companyId: updatedOffer.companyId,
          customerId: updatedOffer.customerId,
        }
      );

      return updatedOffer;
    });

    return offer;
  }

  async rejectOffer(id: string, reason?: string): Promise<Offer> {
    const offer = await prisma.offer.update({
      where: { id },
      data: { 
        status: 'REJECTED',
        notes: reason || undefined,
      },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      OFFER_EVENTS.REJECTED,
      OFFER_EVENTS.REJECTED,
      offer.id,
      'Offer',
      {
        offerId: offer.id,
        offerNo: offer.offerNo,
        reason,
      }
    );

    return offer;
  }

  async sendOffer(id: string): Promise<Offer> {
    const offer = await prisma.offer.update({
      where: { id },
      data: { status: 'SENT' },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      OFFER_EVENTS.SENT,
      OFFER_EVENTS.SENT,
      offer.id,
      'Offer',
      {
        offerId: offer.id,
        offerNo: offer.offerNo,
        customerId: offer.customerId,
        customerEmail: offer.customer.email,
      }
    );

    return offer;
  }

  async checkAndExpireOffers(): Promise<number> {
    const expiredOffers = await prisma.offer.updateMany({
      where: {
        status: { in: ['DRAFT', 'SENT'] },
        validUntil: {
          lt: new Date(),
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return expiredOffers.count;
  }

  async bulkApproveOffers(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.offer.update({
            where: { id, status: 'SENT' },
            data: { status: 'ACCEPTED' },
          });

          await eventPublisher.publishAndStore(
            OFFER_EVENTS.ACCEPTED,
            OFFER_EVENTS.ACCEPTED,
            id,
            'Offer',
            { offerId: id, bulk: true }
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

  async bulkRejectOffers(ids: string[], reason?: string): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.offer.update({
            where: { id, status: 'SENT' },
            data: { status: 'REJECTED', notes: reason },
          });

          await eventPublisher.publishAndStore(
            OFFER_EVENTS.REJECTED,
            OFFER_EVENTS.REJECTED,
            id,
            'Offer',
            { offerId: id, reason, bulk: true }
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

  async bulkSendOffers(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.offer.update({
            where: { id, status: 'DRAFT' },
            data: { status: 'SENT' },
          });

          await eventPublisher.publishAndStore(
            OFFER_EVENTS.SENT,
            OFFER_EVENTS.SENT,
            id,
            'Offer',
            { offerId: id, bulk: true }
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

  async bulkDeleteOffers(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.offer.delete({
            where: { id, status: 'DRAFT' },
          });

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

export const offerService = new OfferService();

