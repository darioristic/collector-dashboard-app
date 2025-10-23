import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { CreateInvoiceSchema, InvoiceQuerySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';
import type { InvoiceType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = InvoiceQuerySchema.parse(queryParams);

    const result = await invoiceService.listInvoices(validatedParams);

    return ApiResponseBuilder.successWithPagination(
      result.invoices,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
      }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error fetching invoices:', error);
    return ApiResponseBuilder.internalError('Failed to fetch invoices');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = CreateInvoiceSchema.parse(body);

    const invoice = await invoiceService.createInvoice({
      companyId: validatedData.companyId,
      customerId: validatedData.customerId,
      deliveryId: validatedData.deliveryId,
      items: validatedData.items as any,
      subtotal: validatedData.subtotal,
      tax: validatedData.tax,
      total: validatedData.total,
      currency: validatedData.currency,
      type: validatedData.type as InvoiceType,
      issueDate: validatedData.issueDate,
      dueDate: validatedData.dueDate,
      notes: validatedData.notes,
    });

    return ApiResponseBuilder.success(invoice, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error creating invoice:', error);
    return ApiResponseBuilder.internalError('Failed to create invoice');
  }
}

