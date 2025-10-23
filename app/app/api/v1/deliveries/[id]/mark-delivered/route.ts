import { NextRequest } from 'next/server';
import { deliveryService } from '@/lib/services/delivery.service';
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
    const delivery = await deliveryService.markDelivered(id);

    return ApiResponseBuilder.success({
      message: 'Delivery marked as delivered successfully',
      delivery,
    });
  } catch (error: any) {
    console.error('Error marking delivery as delivered:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to mark delivery as delivered');
  }
}

