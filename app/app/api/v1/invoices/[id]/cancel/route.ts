import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';
import { z } from 'zod';

const CancelSchema = z.object({
  reason: z.string().optional(),
});

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
    const body = await request.json().catch(() => ({}));
    const { reason } = CancelSchema.parse(body);

    const invoice = await invoiceService.cancelInvoice(id, reason);

    return ApiResponseBuilder.success({
      message: 'Invoice cancelled successfully',
      invoice,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error cancelling invoice:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to cancel invoice');
  }
}

