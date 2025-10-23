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
    const offer = await offerService.sendOffer(id);

    return ApiResponseBuilder.success({
      message: 'Offer sent successfully',
      offer,
    });
  } catch (error: any) {
    console.error('Error sending offer:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to send offer');
  }
}

