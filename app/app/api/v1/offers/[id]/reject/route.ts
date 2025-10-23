import { NextRequest } from 'next/server';
import { offerService } from '@/lib/services/offer.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';
import { z } from 'zod';

const RejectSchema = z.object({
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
    const { reason } = RejectSchema.parse(body);

    const offer = await offerService.rejectOffer(id, reason);

    return ApiResponseBuilder.success({
      message: 'Offer rejected successfully',
      offer,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error rejecting offer:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to reject offer');
  }
}

