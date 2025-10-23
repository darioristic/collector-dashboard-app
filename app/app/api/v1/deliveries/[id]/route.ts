import { NextRequest } from 'next/server';
import { deliveryService } from '@/lib/services/delivery.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateDeliverySchema } from '@/lib/validation/schemas';
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
    const delivery = await deliveryService.getDelivery(id);

    if (!delivery) {
      return ApiResponseBuilder.notFound('Delivery');
    }

    return ApiResponseBuilder.success(delivery);
  } catch (error) {
    console.error('Error fetching delivery:', error);
    return ApiResponseBuilder.internalError('Failed to fetch delivery');
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
    const validatedData = UpdateDeliverySchema.parse(body);

    const delivery = await deliveryService.updateDelivery(id, validatedData);

    return ApiResponseBuilder.success(delivery);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error updating delivery:', error);
    return ApiResponseBuilder.internalError('Failed to update delivery');
  }
}

