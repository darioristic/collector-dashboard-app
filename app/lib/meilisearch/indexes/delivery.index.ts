import { meilisearchClient } from '../client';
import { prisma } from '../../prisma';

export const DELIVERY_INDEX = 'deliveries';

export type DeliveryDocument = {
  id: string;
  deliveryNo: string;
  orderId: string;
  orderNo: string;
  companyId: string;
  companyName: string;
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  deliveryDate: number;
  status: string;
  signedBy: string | null;
  signedAt: number | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
};

export class DeliveryIndexService {
  async initialize(): Promise<void> {
    await meilisearchClient.createIndexIfNotExists(DELIVERY_INDEX, 'id');
    await meilisearchClient.configureIndex(DELIVERY_INDEX, {
      searchableAttributes: ['deliveryNo', 'orderNo', 'companyName', 'customerName', 'customerEmail', 'signedBy', 'notes'],
      filterableAttributes: ['companyId', 'customerId', 'orderId', 'status'],
      sortableAttributes: ['deliveryDate', 'createdAt', 'updatedAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'deliveryDate:desc',
      ],
    });
  }

  async indexDelivery(deliveryId: string): Promise<void> {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: { id: deliveryId },
        include: {
          order: {
            include: {
              company: {
                select: { id: true, name: true },
              },
              customer: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      });

      if (!delivery) {
        console.warn(`Delivery ${deliveryId} not found for indexing`);
        return;
      }

      const document: DeliveryDocument = {
        id: delivery.id,
        deliveryNo: delivery.deliveryNo,
        orderId: delivery.orderId,
        orderNo: delivery.order.orderNo,
        companyId: delivery.order.companyId,
        companyName: delivery.order.company.name,
        customerId: delivery.order.customerId,
        customerName: delivery.order.customer.name,
        customerEmail: delivery.order.customer.email,
        deliveryDate: new Date(delivery.deliveryDate).getTime(),
        status: delivery.status,
        signedBy: delivery.signedBy,
        signedAt: delivery.signedAt ? new Date(delivery.signedAt).getTime() : null,
        notes: delivery.notes,
        createdAt: new Date(delivery.createdAt).getTime(),
        updatedAt: new Date(delivery.updatedAt).getTime(),
      };

      const index = await meilisearchClient.getIndex(DELIVERY_INDEX);
      await index.addDocuments([document]);
      console.log(`✅ Indexed delivery: ${delivery.deliveryNo}`);
    } catch (error) {
      console.error(`❌ Failed to index delivery ${deliveryId}:`, error);
      throw error;
    }
  }

  async updateDelivery(deliveryId: string): Promise<void> {
    await this.indexDelivery(deliveryId);
  }

  async removeDelivery(deliveryId: string): Promise<void> {
    try {
      const index = await meilisearchClient.getIndex(DELIVERY_INDEX);
      await index.deleteDocument(deliveryId);
      console.log(`✅ Removed delivery from index: ${deliveryId}`);
    } catch (error) {
      console.error(`❌ Failed to remove delivery ${deliveryId}:`, error);
      throw error;
    }
  }

  async search(params: {
    query?: string;
    companyId?: string;
    customerId?: string;
    orderId?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sort?: string[];
  }): Promise<{ hits: DeliveryDocument[]; estimatedTotalHits: number }> {
    try {
      const index = await meilisearchClient.getIndex(DELIVERY_INDEX);

      const filters: string[] = [];
      if (params.companyId) filters.push(`companyId = "${params.companyId}"`);
      if (params.customerId) filters.push(`customerId = "${params.customerId}"`);
      if (params.orderId) filters.push(`orderId = "${params.orderId}"`);
      if (params.status) filters.push(`status = "${params.status}"`);

      const result = await index.search(params.query || '', {
        filter: filters.length > 0 ? filters : undefined,
        limit: params.limit || 20,
        offset: params.offset || 0,
        sort: params.sort || ['deliveryDate:desc'],
      });

      return {
        hits: result.hits as DeliveryDocument[],
        estimatedTotalHits: result.estimatedTotalHits || 0,
      };
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  async reindexAll(): Promise<void> {
    try {
      const deliveries = await prisma.delivery.findMany({
        include: {
          order: {
            include: {
              company: {
                select: { id: true, name: true },
              },
              customer: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      });

      type DeliveryWithRelations = typeof deliveries[0];

      const documents: DeliveryDocument[] = deliveries.map((delivery: DeliveryWithRelations): DeliveryDocument => ({
        id: delivery.id,
        deliveryNo: delivery.deliveryNo,
        orderId: delivery.orderId,
        orderNo: delivery.order.orderNo,
        companyId: delivery.order.companyId,
        companyName: delivery.order.company.name,
        customerId: delivery.order.customerId,
        customerName: delivery.order.customer.name,
        customerEmail: delivery.order.customer.email,
        deliveryDate: new Date(delivery.deliveryDate).getTime(),
        status: delivery.status,
        signedBy: delivery.signedBy,
        signedAt: delivery.signedAt ? new Date(delivery.signedAt).getTime() : null,
        notes: delivery.notes,
        createdAt: new Date(delivery.createdAt).getTime(),
        updatedAt: new Date(delivery.updatedAt).getTime(),
      }));

      const index = await meilisearchClient.getIndex(DELIVERY_INDEX);
      await index.deleteAllDocuments();
      
      if (documents.length > 0) {
        await index.addDocuments(documents);
      }

      console.log(`✅ Reindexed ${documents.length} deliveries`);
    } catch (error) {
      console.error('❌ Failed to reindex deliveries:', error);
      throw error;
    }
  }
}

export const deliveryIndexService = new DeliveryIndexService();

