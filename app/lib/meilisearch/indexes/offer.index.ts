import { meilisearchClient } from '../client';
import { prisma } from '../../prisma';

export const OFFER_INDEX = 'offers';

export type OfferDocument = {
  id: string;
  offerNo: string;
  companyId: string;
  companyName: string;
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  validUntil: number;
  status: string;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
};

export class OfferIndexService {
  async initialize(): Promise<void> {
    await meilisearchClient.createIndexIfNotExists(OFFER_INDEX, 'id');
    await meilisearchClient.configureIndex(OFFER_INDEX, {
      searchableAttributes: ['offerNo', 'companyName', 'customerName', 'customerEmail', 'notes'],
      filterableAttributes: ['companyId', 'customerId', 'status', 'currency'],
      sortableAttributes: ['total', 'validUntil', 'createdAt', 'updatedAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'createdAt:desc',
      ],
    });
  }

  async indexOffer(offerId: string): Promise<void> {
    try {
      const offer = await prisma.offer.findUnique({
        where: { id: offerId },
        include: {
          company: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!offer) {
        console.warn(`Offer ${offerId} not found for indexing`);
        return;
      }

      const document: OfferDocument = {
        id: offer.id,
        offerNo: offer.offerNo,
        companyId: offer.companyId,
        companyName: offer.company.name,
        customerId: offer.customerId,
        customerName: offer.customer.name,
        customerEmail: offer.customer.email,
        subtotal: Number(offer.subtotal),
        tax: Number(offer.tax),
        total: Number(offer.total),
        currency: offer.currency,
        validUntil: new Date(offer.validUntil).getTime(),
        status: offer.status,
        notes: offer.notes,
        createdAt: new Date(offer.createdAt).getTime(),
        updatedAt: new Date(offer.updatedAt).getTime(),
      };

      const index = await meilisearchClient.getIndex(OFFER_INDEX);
      await index.addDocuments([document]);
      console.log(`✅ Indexed offer: ${offer.offerNo}`);
    } catch (error) {
      console.error(`❌ Failed to index offer ${offerId}:`, error);
      throw error;
    }
  }

  async updateOffer(offerId: string): Promise<void> {
    await this.indexOffer(offerId);
  }

  async removeOffer(offerId: string): Promise<void> {
    try {
      const index = await meilisearchClient.getIndex(OFFER_INDEX);
      await index.deleteDocument(offerId);
      console.log(`✅ Removed offer from index: ${offerId}`);
    } catch (error) {
      console.error(`❌ Failed to remove offer ${offerId}:`, error);
      throw error;
    }
  }

  async search(params: {
    query?: string;
    companyId?: string;
    customerId?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sort?: string[];
  }): Promise<{ hits: OfferDocument[]; estimatedTotalHits: number }> {
    try {
      const index = await meilisearchClient.getIndex(OFFER_INDEX);

      const filters: string[] = [];
      if (params.companyId) filters.push(`companyId = "${params.companyId}"`);
      if (params.customerId) filters.push(`customerId = "${params.customerId}"`);
      if (params.status) filters.push(`status = "${params.status}"`);

      const result = await index.search(params.query || '', {
        filter: filters.length > 0 ? filters : undefined,
        limit: params.limit || 20,
        offset: params.offset || 0,
        sort: params.sort || ['createdAt:desc'],
      });

      return {
        hits: result.hits as OfferDocument[],
        estimatedTotalHits: result.estimatedTotalHits || 0,
      };
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  async reindexAll(): Promise<void> {
    try {
      const offers = await prisma.offer.findMany({
        include: {
          company: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      const documents: OfferDocument[] = offers.map((offer: typeof offers[0]): OfferDocument => ({
        id: offer.id,
        offerNo: offer.offerNo,
        companyId: offer.companyId,
        companyName: offer.company.name,
        customerId: offer.customerId,
        customerName: offer.customer.name,
        customerEmail: offer.customer.email,
        subtotal: Number(offer.subtotal),
        tax: Number(offer.tax),
        total: Number(offer.total),
        currency: offer.currency,
        validUntil: new Date(offer.validUntil).getTime(),
        status: offer.status,
        notes: offer.notes,
        createdAt: new Date(offer.createdAt).getTime(),
        updatedAt: new Date(offer.updatedAt).getTime(),
      }));

      const index = await meilisearchClient.getIndex(OFFER_INDEX);
      await index.deleteAllDocuments();
      
      if (documents.length > 0) {
        await index.addDocuments(documents);
      }

      console.log(`✅ Reindexed ${documents.length} offers`);
    } catch (error) {
      console.error('❌ Failed to reindex offers:', error);
      throw error;
    }
  }
}

export const offerIndexService = new OfferIndexService();

