import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { INVOICE_EVENTS } from '../events/types';
import { pdfGeneratorService } from './pdf-generator.service';
import { qrGeneratorService } from './qr-generator.service';
import type { Invoice, InvoiceStatus, InvoiceType, Company, Delivery, Order, Prisma } from '@prisma/client';

interface InvoiceWithRelations extends Invoice {
  company: Company;
  customer: Company;
  delivery?: Delivery & {
    order?: Order;
  };
}

export class InvoiceService {
  private generateInvoiceNo(type: InvoiceType): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const prefix = type === 'ISSUED' ? 'INV' : type === 'RECEIVED' ? 'REC' : type === 'CREDIT_NOTE' ? 'CN' : 'PRO';
    return `${prefix}-${timestamp}-${random}`;
  }

  async createInvoice(data: Omit<Prisma.InvoiceCreateInput, 'invoiceNo' | 'company' | 'customer' | 'delivery'> & { 
    companyId: string; 
    customerId: string;
    deliveryId?: string;
    type: InvoiceType;
  }): Promise<Invoice> {
    const invoiceNo = this.generateInvoiceNo(data.type);
    
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        currency: data.currency || 'EUR',
        type: data.type,
        status: 'DRAFT',
        issueDate: data.issueDate || new Date(),
        dueDate: data.dueDate,
        notes: data.notes,
        company: {
          connect: { id: data.companyId },
        },
        customer: {
          connect: { id: data.customerId },
        },
        ...(data.deliveryId && {
          delivery: {
            connect: { id: data.deliveryId },
          },
        }),
      },
      include: {
        company: true,
        customer: true,
        delivery: true,
      },
    });

    await eventPublisher.publishAndStore(
      INVOICE_EVENTS.CREATED,
      INVOICE_EVENTS.CREATED,
      invoice.id,
      'Invoice',
      {
        invoiceId: invoice.id,
        invoiceNo: invoice.invoiceNo,
        companyId: invoice.companyId,
        customerId: invoice.customerId,
        deliveryId: invoice.deliveryId,
        type: invoice.type,
        total: invoice.total.toString(),
        currency: invoice.currency,
      }
    );

    return invoice;
  }

  async createFromDelivery(deliveryId: string, dueDate: Date): Promise<Invoice> {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        order: {
          include: {
            company: true,
            customer: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (delivery.status !== 'SIGNED') {
      throw new Error('Only signed deliveries can have invoices created');
    }

    const order = delivery.order;

    return this.createInvoice({
      companyId: order.companyId,
      customerId: order.customerId,
      deliveryId: delivery.id,
      items: order.items as Prisma.InputJsonValue,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      currency: order.currency,
      type: 'ISSUED',
      dueDate,
      notes: `Created from delivery ${delivery.deliveryNo}`,
    });
  }

  async createFromOrder(orderId: string, dueDate: Date): Promise<Invoice> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        company: true,
        customer: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'CANCELLED') {
      throw new Error('Cannot create invoice from cancelled order');
    }

    return this.createInvoice({
      companyId: order.companyId,
      customerId: order.customerId,
      items: order.items as Prisma.InputJsonValue,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      currency: order.currency,
      type: 'ISSUED',
      dueDate,
      notes: `Created from order ${order.orderNo}`,
    });
  }

  async updateInvoice(id: string, data: Partial<Omit<Prisma.InvoiceUpdateInput, 'company' | 'customer' | 'delivery'>>): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
      where: { id },
      data,
      include: {
        company: true,
        customer: true,
        delivery: true,
      },
    });

    await eventPublisher.publishAndStore(
      INVOICE_EVENTS.UPDATED,
      INVOICE_EVENTS.UPDATED,
      invoice.id,
      'Invoice',
      {
        invoiceId: invoice.id,
        invoiceNo: invoice.invoiceNo,
        updatedFields: Object.keys(data),
      }
    );

    return invoice;
  }

  async getInvoice(id: string): Promise<InvoiceWithRelations | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
        customer: true,
        delivery: {
          include: {
            order: true,
          },
        },
      },
    });
  }

  async listInvoices(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    customerId?: string;
    type?: InvoiceType;
    status?: InvoiceStatus;
  }): Promise<{ invoices: Invoice[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, companyId, customerId, type, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {
      ...(companyId && { companyId }),
      ...(customerId && { customerId }),
      ...(type && { type }),
      ...(status && { status }),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
          delivery: {
            select: {
              id: true,
              deliveryNo: true,
            },
          },
        },
        orderBy: {
          issueDate: 'desc',
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      invoices,
      total,
      page,
      limit,
    };
  }

  async sendInvoice(id: string): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'SENT' },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      INVOICE_EVENTS.SENT,
      INVOICE_EVENTS.SENT,
      invoice.id,
      'Invoice',
      {
        invoiceId: invoice.id,
        invoiceNo: invoice.invoiceNo,
        customerId: invoice.customerId,
        customerEmail: invoice.customer.email,
      }
    );

    return invoice;
  }

  async markAsUnpaid(id: string): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { 
        status: 'SENT',
        paidAt: null,
      },
      include: {
        company: true,
        customer: true,
      },
    });

    await eventPublisher.publishAndStore(
      INVOICE_EVENTS.UPDATED,
      INVOICE_EVENTS.UPDATED,
      invoice.id,
      'Invoice',
      {
        invoiceId: invoice.id,
        invoiceNo: invoice.invoiceNo,
        status: 'SENT',
        action: 'marked_as_unpaid',
      }
    );

    return invoice;
  }

  async cancelInvoice(id: string, reason?: string): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
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
      INVOICE_EVENTS.CANCELLED,
      INVOICE_EVENTS.CANCELLED,
      invoice.id,
      'Invoice',
      {
        invoiceId: invoice.id,
        invoiceNo: invoice.invoiceNo,
        reason,
      }
    );

    return invoice;
  }

  async checkAndMarkOverdue(): Promise<number> {
    const overdueInvoices = await prisma.invoice.updateMany({
      where: {
        status: 'SENT',
        dueDate: {
          lt: new Date(),
        },
      },
      data: {
        status: 'OVERDUE',
      },
    });

    return overdueInvoices.count;
  }

  async bulkSendInvoices(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.invoice.update({
            where: { id, status: 'DRAFT' },
            data: { status: 'SENT' },
          });

          await eventPublisher.publishAndStore(
            INVOICE_EVENTS.SENT,
            INVOICE_EVENTS.SENT,
            id,
            'Invoice',
            { invoiceId: id, bulk: true }
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

  async bulkPayInvoices(ids: string[]): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.invoice.update({
            where: { id, status: { in: ['SENT', 'OVERDUE'] } },
            data: { status: 'PAID', paidAt: new Date() },
          });

          await eventPublisher.publishAndStore(
            INVOICE_EVENTS.PAID,
            INVOICE_EVENTS.PAID,
            id,
            'Invoice',
            { invoiceId: id, bulk: true }
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

  async bulkCancelInvoices(ids: string[], reason?: string): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        try {
          await tx.invoice.update({
            where: { id },
            data: { status: 'CANCELLED', notes: reason },
          });

          await eventPublisher.publishAndStore(
            INVOICE_EVENTS.CANCELLED,
            INVOICE_EVENTS.CANCELLED,
            id,
            'Invoice',
            { invoiceId: id, reason, bulk: true }
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

  async generatePDF(id: string): Promise<Buffer> {
    const invoice = await this.getInvoice(id);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return pdfGeneratorService.generateInvoicePDF(invoice as any);
  }

  async generateQRCode(id: string, format: 'base64' | 'buffer' = 'base64'): Promise<string | Buffer> {
    const invoice = await this.getInvoice(id);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return qrGeneratorService.generateInvoiceQR(invoice, format);
  }

  async generatePaymentQR(id: string, iban?: string, bic?: string): Promise<string> {
    const invoice = await this.getInvoice(id);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return qrGeneratorService.generatePaymentQR(invoice, iban, bic);
  }
}

export const invoiceService = new InvoiceService();

