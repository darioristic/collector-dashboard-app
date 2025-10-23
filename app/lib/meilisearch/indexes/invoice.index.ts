import { meilisearchClient } from '../client';
import { prisma } from '../../prisma';

export const INVOICE_INDEX = 'invoices';

export type InvoiceDocument = {
  id: string;
  invoiceNo: string;
  companyId: string;
  companyName: string;
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  deliveryId: string | null;
  deliveryNo: string | null;
  orderNo: string | null;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  type: string;
  status: string;
  issueDate: number;
  dueDate: number;
  paidAt: number | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
};

export class InvoiceIndexService {
  async initialize(): Promise<void> {
    await meilisearchClient.createIndexIfNotExists(INVOICE_INDEX, 'id');
    await meilisearchClient.configureIndex(INVOICE_INDEX, {
      searchableAttributes: ['invoiceNo', 'orderNo', 'deliveryNo', 'companyName', 'customerName', 'customerEmail', 'notes'],
      filterableAttributes: ['companyId', 'customerId', 'deliveryId', 'type', 'status', 'currency'],
      sortableAttributes: ['total', 'issueDate', 'dueDate', 'createdAt', 'updatedAt'],
      rankingRules: [
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'issueDate:desc',
      ],
    });
  }

  async indexInvoice(invoiceId: string): Promise<void> {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          company: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
          delivery: {
            select: { 
              deliveryNo: true,
              order: {
                select: { orderNo: true }
              }
            },
          },
        },
      });

      if (!invoice) {
        console.warn(`Invoice ${invoiceId} not found for indexing`);
        return;
      }

      const document: InvoiceDocument = {
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        companyId: invoice.companyId,
        companyName: invoice.company.name,
        customerId: invoice.customerId,
        customerName: invoice.customer.name,
        customerEmail: invoice.customer.email,
        deliveryId: invoice.deliveryId,
        deliveryNo: invoice.delivery?.deliveryNo || null,
        orderNo: invoice.delivery?.order?.orderNo || null,
        subtotal: Number(invoice.subtotal),
        tax: Number(invoice.tax),
        total: Number(invoice.total),
        currency: invoice.currency,
        type: invoice.type,
        status: invoice.status,
        issueDate: new Date(invoice.issueDate).getTime(),
        dueDate: new Date(invoice.dueDate).getTime(),
        paidAt: invoice.paidAt ? new Date(invoice.paidAt).getTime() : null,
        notes: invoice.notes,
        createdAt: new Date(invoice.createdAt).getTime(),
        updatedAt: new Date(invoice.updatedAt).getTime(),
      };

      const index = await meilisearchClient.getIndex(INVOICE_INDEX);
      await index.addDocuments([document]);
      console.log(`✅ Indexed invoice: ${invoice.invoiceNo}`);
    } catch (error) {
      console.error(`❌ Failed to index invoice ${invoiceId}:`, error);
      throw error;
    }
  }

  async updateInvoice(invoiceId: string): Promise<void> {
    await this.indexInvoice(invoiceId);
  }

  async removeInvoice(invoiceId: string): Promise<void> {
    try {
      const index = await meilisearchClient.getIndex(INVOICE_INDEX);
      await index.deleteDocument(invoiceId);
      console.log(`✅ Removed invoice from index: ${invoiceId}`);
    } catch (error) {
      console.error(`❌ Failed to remove invoice ${invoiceId}:`, error);
      throw error;
    }
  }

  async search(params: {
    query?: string;
    companyId?: string;
    customerId?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
    sort?: string[];
  }): Promise<{ hits: InvoiceDocument[]; estimatedTotalHits: number }> {
    try {
      const index = await meilisearchClient.getIndex(INVOICE_INDEX);

      const filters: string[] = [];
      if (params.companyId) filters.push(`companyId = "${params.companyId}"`);
      if (params.customerId) filters.push(`customerId = "${params.customerId}"`);
      if (params.type) filters.push(`type = "${params.type}"`);
      if (params.status) filters.push(`status = "${params.status}"`);

      const result = await index.search(params.query || '', {
        filter: filters.length > 0 ? filters : undefined,
        limit: params.limit || 20,
        offset: params.offset || 0,
        sort: params.sort || ['issueDate:desc'],
      });

      return {
        hits: result.hits as InvoiceDocument[],
        estimatedTotalHits: result.estimatedTotalHits || 0,
      };
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  async reindexAll(): Promise<void> {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          company: {
            select: { id: true, name: true },
          },
          customer: {
            select: { id: true, name: true, email: true },
          },
          delivery: {
            select: { 
              deliveryNo: true,
              order: {
                select: { orderNo: true }
              }
            },
          },
        },
      });

      const documents: InvoiceDocument[] = invoices.map((invoice: typeof invoices[0]): InvoiceDocument => ({
        id: invoice.id,
        invoiceNo: invoice.invoiceNo,
        companyId: invoice.companyId,
        companyName: invoice.company.name,
        customerId: invoice.customerId,
        customerName: invoice.customer.name,
        customerEmail: invoice.customer.email,
        deliveryId: invoice.deliveryId,
        deliveryNo: invoice.delivery?.deliveryNo || null,
        orderNo: invoice.delivery?.order?.orderNo || null,
        subtotal: Number(invoice.subtotal),
        tax: Number(invoice.tax),
        total: Number(invoice.total),
        currency: invoice.currency,
        type: invoice.type,
        status: invoice.status,
        issueDate: new Date(invoice.issueDate).getTime(),
        dueDate: new Date(invoice.dueDate).getTime(),
        paidAt: invoice.paidAt ? new Date(invoice.paidAt).getTime() : null,
        notes: invoice.notes,
        createdAt: new Date(invoice.createdAt).getTime(),
        updatedAt: new Date(invoice.updatedAt).getTime(),
      }));

      const index = await meilisearchClient.getIndex(INVOICE_INDEX);
      await index.deleteAllDocuments();
      
      if (documents.length > 0) {
        await index.addDocuments(documents);
      }

      console.log(`✅ Reindexed ${documents.length} invoices`);
    } catch (error) {
      console.error('❌ Failed to reindex invoices:', error);
      throw error;
    }
  }
}

export const invoiceIndexService = new InvoiceIndexService();

