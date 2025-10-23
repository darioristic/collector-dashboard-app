import { NextRequest } from 'next/server';
import { contactService } from '@/lib/services/contact.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { ContactQuerySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = ContactQuerySchema.parse(queryParams);

    const result = await contactService.listContacts(validatedParams);

    return ApiResponseBuilder.successWithPagination(
      result.contacts,
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

    console.error('Error fetching contacts:', error);
    return ApiResponseBuilder.internalError('Failed to fetch contacts');
  }
}

