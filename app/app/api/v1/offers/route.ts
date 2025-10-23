import { NextRequest } from 'next/server';
import { offerService } from '@/lib/services/offer.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { CreateOfferSchema, OfferQuerySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = OfferQuerySchema.parse(queryParams);

    const result = await offerService.listOffers(validatedParams);

    return ApiResponseBuilder.successWithPagination(
      result.offers,
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

    console.error('Error fetching offers:', error);
    return ApiResponseBuilder.internalError('Failed to fetch offers');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = CreateOfferSchema.parse(body);

    const offer = await offerService.createOffer({
      companyId: validatedData.companyId,
      customerId: validatedData.customerId,
      items: validatedData.items as any,
      subtotal: validatedData.subtotal,
      tax: validatedData.tax,
      total: validatedData.total,
      currency: validatedData.currency,
      validUntil: validatedData.validUntil,
      notes: validatedData.notes,
    });

    return ApiResponseBuilder.success(offer, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    console.error('Error creating offer:', error);
    return ApiResponseBuilder.internalError('Failed to create offer');
  }
}

