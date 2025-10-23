import { meilisearchClient } from '../client';
import { prisma } from '../../prisma';

export const ORDER_INDEX = 'orders';

export type OrderDocument = {
  id: string;
  orderNo: string;
  offerId: string | null;
  offerNo: string | null;
  companyId: string;
  companyName: string;
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
};

export class OrderIndexService {
  async initialize(): Promise<void> {
    await meilisearchClient.createIndexIfNotExists(ORDER_INDEX, 'id');
    await meilisearchClient.configureIndex(ORDER_INDEX, {
      searchableAttributes: ['orderNo', 'offerNo', 'companyName', 'customerName', 'customerEmail', 'notes'],
      filterableAttributes: ['companyId', 'customerId', 'status', 'currency', 'offerId'],
      sortableAttributes: ['total', 'createdAt', 'updatedAt'],
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

  async indexOrder(orderId: string): Promise<void> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          company: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
          offer: {
            select: { offerNo: true },
          },
        },
      });

      if (!order) {
        console.warn(`Order ${orderId} not found for indexing`);
        return;
      }

      const document: OrderDocument = {
        id: order.id,
        orderNo: order.orderNo,
        offerId: order.offerId,
        offerNo: order.offer?.offerNo || null,
        companyId: order.companyId,
        companyName: order.company.name,
        customerId: order.customerId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        total: Number(order.total),
        currency: order.currency,
        status: order.status,
        notes: order.notes,
        createdAt: new Date(order.createdAt).getTime(),
        updatedAt: new Date(order.updatedAt).getTime(),
      };

      const index = await meilisearchClient.getIndex(ORDER_INDEX);
      await index.addDocuments([document]);
      console.log(`✅ Indexed order: ${order.orderNo}`);
    } catch (error) {
      console.error(`❌ Failed to index order ${orderId}:`, error);
      throw error;
    }
  }

  async updateOrder(orderId: string): Promise<void> {
    await this.indexOrder(orderId);
  }

  async removeOrder(orderId: string): Promise<void> {
    try {
      const index = await meilisearchClient.getIndex(ORDER_INDEX);
      await index.deleteDocument(orderId);
      console.log(`✅ Removed order from index: ${orderId}`);
    } catch (error) {
      console.error(`❌ Failed to remove order ${orderId}:`, error);
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
  }): Promise<{ hits: OrderDocument[]; estimatedTotalHits: number }> {
    try {
      const index = await meilisearchClient.getIndex(ORDER_INDEX);

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
        hits: result.hits as OrderDocument[],
        estimatedTotalHits: result.estimatedTotalHits || 0,
      };
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  async reindexAll(): Promise<void> {
    try {
      const orders = await prisma.order.findMany({
        include: {
          company: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
          offer: {
            select: { offerNo: true },
          },
        },
      });

      const documents: OrderDocument[] = orders.map((order: typeof orders[0]): OrderDocument => ({
        id: order.id,
        orderNo: order.orderNo,
        offerId: order.offerId,
        offerNo: order.offer?.offerNo || null,
        companyId: order.companyId,
        companyName: order.company.name,
        customerId: order.customerId,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        total: Number(order.total),
        currency: order.currency,
        status: order.status,
        notes: order.notes,
        createdAt: new Date(order.createdAt).getTime(),
        updatedAt: new Date(order.updatedAt).getTime(),
      }));

      const index = await meilisearchClient.getIndex(ORDER_INDEX);
      await index.deleteAllDocuments();
      
      if (documents.length > 0) {
        await index.addDocuments(documents);
      }

      console.log(`✅ Reindexed ${documents.length} orders`);
    } catch (error) {
      console.error('❌ Failed to reindex orders:', error);
      throw error;
    }
  }
}

export const orderIndexService = new OrderIndexService();

