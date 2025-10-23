import { NextRequest } from 'next/server';
import { deliveryService } from '@/lib/services/delivery.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { CreateDeliverySchema, DeliveryQuerySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = DeliveryQuerySchema.parse(queryParams);

    const result = await deliveryService.listDeliveries(validatedParams);

    return ApiResponseBuilder.successWithPagination(
      result.deliveries,
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

    console.error('Error fetching deliveries:', error);
    return ApiResponseBuilder.internalError('Failed to fetch deliveries');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = CreateDeliverySchema.parse(body);

    const delivery = await deliveryService.createDelivery({
      orderId: validatedData.orderId,
      deliveryDate: validatedData.deliveryDate,
      items: validatedData.items as any,
      notes: validatedData.notes,
    });

    return ApiResponseBuilder.success(delivery, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error creating delivery:', error);
    return ApiResponseBuilder.internalError('Failed to create delivery');
  }
}

