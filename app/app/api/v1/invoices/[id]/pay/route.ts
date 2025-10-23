import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function POST(
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
    const { paidAt } = body;
    
    const invoice = await invoiceService.payInvoice(id, paidAt ? new Date(paidAt) : undefined);

    return ApiResponseBuilder.success({
      message: 'Invoice marked as paid successfully',
      invoice,
    });
  } catch (error: any) {
    console.error('Error marking invoice as paid:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to mark invoice as paid');
  }
}

