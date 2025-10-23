import { NextRequest } from 'next/server';
import { contactService } from '@/lib/services/contact.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateContactSchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.authenticateService(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateContactSchema.parse(body);

    const contact = await contactService.updateContact(id, validatedData);

    return ApiResponseBuilder.success(contact);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error.code === 'P2025') {
      return ApiResponseBuilder.notFound('Contact');
    }

    if (error.code === 'P2002') {
      return ApiResponseBuilder.conflict('Contact with this email already exists');
    }

    console.error('Error updating contact:', error);
    return ApiResponseBuilder.internalError('Failed to update contact');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.authenticateService(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    const contact = await contactService.deleteContact(id);

    return ApiResponseBuilder.success({ message: 'Contact deleted successfully', contact });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return ApiResponseBuilder.notFound('Contact');
    }

    console.error('Error deleting contact:', error);
    return ApiResponseBuilder.internalError('Failed to delete contact');
  }
}

