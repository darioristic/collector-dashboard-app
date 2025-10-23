import { NextRequest } from 'next/server';
import { contactService } from '@/lib/services/contact.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { ContactSchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticateService(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = ContactSchema.parse(body);

    const contact = await contactService.createContact({
      ...validatedData,
      company: {
        connect: { id: validatedData.companyId },
      },
    });

    return ApiResponseBuilder.success(contact, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error.code === 'P2002') {
      return ApiResponseBuilder.conflict('Contact with this email already exists');
    }

    if (error.code === 'P2003') {
      return ApiResponseBuilder.validationError([
        { field: 'companyId', message: 'Company not found' },
      ]);
    }

    console.error('Error creating contact:', error);
    return ApiResponseBuilder.internalError('Failed to create contact');
  }
}

