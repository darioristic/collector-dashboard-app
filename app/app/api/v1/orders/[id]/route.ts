import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateOrderSchema } from '@/lib/validation/schemas';
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
    const order = await orderService.getOrder(id);

    if (!order) {
      return ApiResponseBuilder.notFound('Order');
    }

    return ApiResponseBuilder.success(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return ApiResponseBuilder.internalError('Failed to fetch order');
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
    const validatedData = UpdateOrderSchema.parse(body);

    const order = await orderService.updateOrder(id, validatedData);

    return ApiResponseBuilder.success(order);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error updating order:', error);
    return ApiResponseBuilder.internalError('Failed to update order');
  }
}

