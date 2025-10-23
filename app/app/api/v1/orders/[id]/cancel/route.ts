import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
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

    const order = await orderService.cancelOrder(id, reason);

    return ApiResponseBuilder.success({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error cancelling order:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to cancel order');
  }
}

