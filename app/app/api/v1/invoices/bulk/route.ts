import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';
import { z } from 'zod';

const BulkActionSchema = z.object({
  ids: z.array(z.string().uuid()).min(1, 'At least one ID is required'),
  action: z.enum(['send', 'pay', 'cancel']),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const { ids, action, reason } = BulkActionSchema.parse(body);

    let result;

    switch (action) {
      case 'send':
        result = await invoiceService.bulkSendInvoices(ids);
        break;
      case 'pay':
        result = await invoiceService.bulkPayInvoices(ids);
        break;
      case 'cancel':
        result = await invoiceService.bulkCancelInvoices(ids, reason);
        break;
      default:
        return ApiResponseBuilder.error('INVALID_ACTION', 'Invalid bulk action', 400);
    }

    return ApiResponseBuilder.success({
      action,
      result,
      message: `Bulk ${action} completed: ${result.success} succeeded, ${result.failed} failed`,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error performing bulk action:', error);
    return ApiResponseBuilder.internalError('Failed to perform bulk action');
  }
}

