import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateInvoiceSchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    const invoice = await invoiceService.getInvoice(id);

    if (!invoice) {
      return ApiResponseBuilder.notFound('Invoice');
    }

    return ApiResponseBuilder.success(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return ApiResponseBuilder.internalError('Failed to fetch invoice');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateInvoiceSchema.parse(body);

    const invoice = await invoiceService.updateInvoice(id, validatedData);

    return ApiResponseBuilder.success(invoice);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error updating invoice:', error);
    return ApiResponseBuilder.internalError('Failed to update invoice');
  }
}

