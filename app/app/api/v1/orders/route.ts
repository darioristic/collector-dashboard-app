import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { CreateOrderSchema, OrderQuerySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = OrderQuerySchema.parse(queryParams);

    const result = await orderService.listOrders(validatedParams);

    return ApiResponseBuilder.successWithPagination(
      result.orders,
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

    console.error('Error fetching orders:', error);
    return ApiResponseBuilder.internalError('Failed to fetch orders');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = CreateOrderSchema.parse(body);

    const order = await orderService.createOrder({
      companyId: validatedData.companyId,
      customerId: validatedData.customerId,
      offerId: validatedData.offerId,
      items: validatedData.items as any,
      subtotal: validatedData.subtotal,
      tax: validatedData.tax,
      total: validatedData.total,
      currency: validatedData.currency,
      notes: validatedData.notes,
    });

    return ApiResponseBuilder.success(order, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error creating order:', error);
    return ApiResponseBuilder.internalError('Failed to create order');
  }
}

