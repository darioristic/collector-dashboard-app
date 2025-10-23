import { NextRequest } from 'next/server';
import { offerService } from '@/lib/services/offer.service';
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
    const offer = await offerService.approveOffer(id);

    return ApiResponseBuilder.success({
      message: 'Offer approved successfully',
      offer,
    });
  } catch (error: any) {
    console.error('Error approving offer:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to approve offer');
  }
}

