import { NextRequest } from 'next/server';
import { deliveryService } from '@/lib/services/delivery.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';
import { z } from 'zod';

const SignSchema = z.object({
  signedBy: z.string().min(1, 'Signer name is required'),
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
    const body = await request.json();
    const { signedBy } = SignSchema.parse(body);

    const delivery = await deliveryService.signDelivery(id, signedBy);

    return ApiResponseBuilder.success({
      message: 'Delivery signed successfully',
      delivery,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error signing delivery:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to sign delivery');
  }
}

