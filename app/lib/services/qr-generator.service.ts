import * as QRCode from 'qrcode';
import type { Invoice, Company } from '../../node_modules/.prisma/client';

interface InvoiceWithRelations extends Invoice {
  company: Company;
  customer: Company;
}

export class QRGeneratorService {
  async generateInvoiceQR(invoice: InvoiceWithRelations, format: 'base64' | 'buffer' = 'base64'): Promise<string | Buffer> {
    const qrData = this.buildEInvoiceData(invoice);

    if (format === 'buffer') {
      return await QRCode.toBuffer(qrData, {
        errorCorrectionLevel: 'M',
        type: 'png',
        width: 300,
        margin: 1,
      });
    }

    return await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 1,
    });
  }

  private buildEInvoiceData(invoice: InvoiceWithRelations): string {
    const data = {
      invoiceNo: invoice.invoiceNo,
      issuer: {
        name: invoice.company.name,
        taxNo: invoice.company.taxNumber,
        address: invoice.company.address,
        city: invoice.company.city,
        country: invoice.company.country,
      },
      customer: {
        name: invoice.customer.name,
        taxNo: invoice.customer.taxNumber,
        address: invoice.customer.address,
        city: invoice.customer.city,
        country: invoice.customer.country,
      },
      invoiceDate: invoice.issueDate.toISOString().split('T')[0],
      dueDate: invoice.dueDate.toISOString().split('T')[0],
      total: invoice.total.toString(),
      currency: invoice.currency,
      type: invoice.type,
      status: invoice.status,
    };

    return JSON.stringify(data);
  }

  async generatePaymentQR(
    invoice: InvoiceWithRelations,
    iban?: string,
    bic?: string
  ): Promise<string> {
    const sepaData = this.buildSEPAQRData(invoice, iban, bic);

    return await QRCode.toDataURL(sepaData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 1,
    });
  }

  private buildSEPAQRData(
    invoice: InvoiceWithRelations,
    iban?: string,
    bic?: string
  ): string {
    const amount = invoice.total.toString();
    const reference = invoice.invoiceNo;
    const creditorName = invoice.company.name;

    const sepaLines = [
      'BCD',
      '002',
      '1',
      'SCT',
      bic || '',
      creditorName,
      iban || '',
      `EUR${amount}`,
      '',
      reference,
      `Invoice ${reference}`,
      '',
    ];

    return sepaLines.join('\n');
  }
}

export const qrGeneratorService = new QRGeneratorService();

