import { NextRequest } from 'next/server';
import { contactService } from '@/lib/services/contact.service';
import { ApiResponseBuilder } from '@/lib/api/response';
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
    const contact = await contactService.getContact(id);

    if (!contact) {
      return ApiResponseBuilder.notFound('Contact');
    }

    return ApiResponseBuilder.success(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return ApiResponseBuilder.internalError('Failed to fetch contact');
  }
}

