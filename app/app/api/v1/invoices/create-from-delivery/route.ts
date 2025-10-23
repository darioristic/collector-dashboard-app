import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';
import { z } from 'zod';

const CreateFromDeliverySchema = z.object({
  deliveryId: z.string().uuid(),
  dueDate: z.string().transform((str) => new Date(str)),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = CreateFromDeliverySchema.parse(body);

    const invoice = await invoiceService.createFromDelivery(
      validatedData.deliveryId,
      validatedData.dueDate
    );

    return ApiResponseBuilder.success(invoice, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error creating invoice from delivery:', error);
    return ApiResponseBuilder.internalError(
      error.message || 'Failed to create invoice from delivery'
    );
  }
}

