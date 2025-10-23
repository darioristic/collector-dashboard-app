import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
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
    const order = await orderService.fulfillOrder(id);

    return ApiResponseBuilder.success({
      message: 'Order fulfilled successfully',
      order,
    });
  } catch (error: any) {
    console.error('Error fulfilling order:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to fulfill order');
  }
}

