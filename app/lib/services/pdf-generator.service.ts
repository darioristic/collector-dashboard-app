import PDFDocument from 'pdfkit';
import type { Invoice, Company } from '@prisma/client';

interface InvoiceWithRelations extends Invoice {
  company: Company;
  customer: Company;
}

export class PDFGeneratorService {
  async generateInvoicePDF(invoice: InvoiceWithRelations): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const pageWidth = doc.page.width - 100;
        let yPosition = 50;

        doc.fontSize(24).text(this.getInvoiceTypeName(invoice.type), 50, yPosition);
        yPosition += 40;

        doc.fontSize(14).fillColor('#666666')
          .text(invoice.invoiceNo, 50, yPosition);
        yPosition += 30;

        const leftColumn = 50;
        const rightColumn = pageWidth / 2 + 50;

        doc.fontSize(10).fillColor('#000000')
          .font('Helvetica-Bold').text('From:', leftColumn, yPosition);
        doc.font('Helvetica').fontSize(9)
          .text(invoice.company.name, leftColumn, yPosition + 15)
          .text(invoice.company.address, leftColumn, yPosition + 28)
          .text(`${invoice.company.city}, ${invoice.company.postalCode}`, leftColumn, yPosition + 41)
          .text(invoice.company.country, leftColumn, yPosition + 54);
        
        if (invoice.company.taxNumber) {
          doc.text(`Tax No: ${invoice.company.taxNumber}`, leftColumn, yPosition + 67);
        }
        
        if (invoice.company.email) {
          doc.text(`Email: ${invoice.company.email}`, leftColumn, yPosition + 80);
        }

        doc.font('Helvetica-Bold').fontSize(10)
          .text('To:', rightColumn, yPosition);
        doc.font('Helvetica').fontSize(9)
          .text(invoice.customer.name, rightColumn, yPosition + 15)
          .text(invoice.customer.address, rightColumn, yPosition + 28)
          .text(`${invoice.customer.city}, ${invoice.customer.postalCode}`, rightColumn, yPosition + 41)
          .text(invoice.customer.country, rightColumn, yPosition + 54);

        if (invoice.customer.taxNumber) {
          doc.text(`Tax No: ${invoice.customer.taxNumber}`, rightColumn, yPosition + 67);
        }

        if (invoice.customer.email) {
          doc.text(`Email: ${invoice.customer.email}`, rightColumn, yPosition + 80);
        }

        yPosition += 120;

        doc.fontSize(9).fillColor('#666666')
          .text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString('sr-RS')}`, leftColumn, yPosition)
          .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('sr-RS')}`, rightColumn, yPosition);

        if (invoice.paidAt) {
          doc.text(`Paid Date: ${new Date(invoice.paidAt).toLocaleDateString('sr-RS')}`, rightColumn, yPosition + 15);
        }

        yPosition += 40;

        doc.strokeColor('#000000')
          .lineWidth(1)
          .moveTo(50, yPosition)
          .lineTo(pageWidth + 50, yPosition)
          .stroke();

        yPosition += 20;

        const tableTop = yPosition;
        const col1 = leftColumn;
        const col2 = leftColumn + 200;
        const col3 = leftColumn + 300;
        const col4 = leftColumn + 380;
        const col5 = leftColumn + 460;

        doc.font('Helvetica-Bold').fontSize(9).fillColor('#000000');
        doc.text('Description', col1, tableTop);
        doc.text('Quantity', col2, tableTop);
        doc.text('Price', col3, tableTop);
        doc.text('Tax', col4, tableTop);
        doc.text('Total', col5, tableTop);

        yPosition = tableTop + 20;

        doc.strokeColor('#CCCCCC')
          .lineWidth(0.5)
          .moveTo(50, yPosition)
          .lineTo(pageWidth + 50, yPosition)
          .stroke();

        yPosition += 10;

        const items = Array.isArray(invoice.items) 
          ? invoice.items 
          : typeof invoice.items === 'string' 
            ? JSON.parse(invoice.items) 
            : [invoice.items];

        doc.font('Helvetica').fontSize(8);
        for (const item of items) {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          const itemTotal = item.quantity * item.price;
          const itemTax = itemTotal * (item.taxRate || 0) / 100;

          doc.text(item.name || item.description || 'Item', col1, yPosition, { width: 180 });
          doc.text(item.quantity.toString(), col2, yPosition);
          doc.text(`${invoice.currency} ${item.price.toFixed(2)}`, col3, yPosition);
          doc.text(`${(item.taxRate || 0)}%`, col4, yPosition);
          doc.text(`${invoice.currency} ${(itemTotal + itemTax).toFixed(2)}`, col5, yPosition);

          yPosition += 20;
        }

        yPosition += 20;

        doc.strokeColor('#000000')
          .lineWidth(1)
          .moveTo(50, yPosition)
          .lineTo(pageWidth + 50, yPosition)
          .stroke();

        yPosition += 20;

        const summaryLeft = pageWidth - 150;
        doc.font('Helvetica').fontSize(9);
        doc.text('Subtotal:', summaryLeft, yPosition);
        doc.text(`${invoice.currency} ${invoice.subtotal.toString()}`, summaryLeft + 100, yPosition, { align: 'right', width: 100 });

        yPosition += 20;
        doc.text('Tax:', summaryLeft, yPosition);
        doc.text(`${invoice.currency} ${invoice.tax.toString()}`, summaryLeft + 100, yPosition, { align: 'right', width: 100 });

        yPosition += 20;
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text('Total:', summaryLeft, yPosition);
        doc.text(`${invoice.currency} ${invoice.total.toString()}`, summaryLeft + 100, yPosition, { align: 'right', width: 100 });

        yPosition += 40;

        const statusColor = this.getStatusColor(invoice.status);
        doc.fontSize(10).fillColor(statusColor);
        doc.text(`Status: ${invoice.status}`, leftColumn, yPosition);

        if (invoice.notes) {
          yPosition += 40;
          doc.fontSize(8).fillColor('#666666')
            .text('Notes:', leftColumn, yPosition);
          doc.fillColor('#000000')
            .text(invoice.notes, leftColumn, yPosition + 15, { width: pageWidth });
        }

        doc.fontSize(7).fillColor('#999999')
          .text(
            `Generated on ${new Date().toLocaleString()}`,
            50,
            doc.page.height - 50,
            { align: 'center', width: pageWidth }
          );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private getInvoiceTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      ISSUED: 'INVOICE',
      RECEIVED: 'RECEIVED INVOICE',
      CREDIT_NOTE: 'CREDIT NOTE',
      PROFORMA: 'PROFORMA INVOICE',
    };
    return typeNames[type] || 'INVOICE';
  }

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      DRAFT: '#6B7280',
      SENT: '#3B82F6',
      PAID: '#10B981',
      OVERDUE: '#F59E0B',
      CANCELLED: '#EF4444',
    };
    return colors[status] || '#000000';
  }
}

export const pdfGeneratorService = new PDFGeneratorService();

