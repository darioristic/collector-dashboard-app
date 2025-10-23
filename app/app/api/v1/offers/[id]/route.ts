import { NextRequest } from 'next/server';
import { offerService } from '@/lib/services/offer.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateOfferSchema } from '@/lib/validation/schemas';
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
    const offer = await offerService.getOffer(id);

    if (!offer) {
      return ApiResponseBuilder.notFound('Offer');
    }

    return ApiResponseBuilder.success(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    return ApiResponseBuilder.internalError('Failed to fetch offer');
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
    const validatedData = UpdateOfferSchema.parse(body);

    const offer = await offerService.updateOffer(id, validatedData);

    return ApiResponseBuilder.success(offer);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error updating offer:', error);
    return ApiResponseBuilder.internalError('Failed to update offer');
  }
}

