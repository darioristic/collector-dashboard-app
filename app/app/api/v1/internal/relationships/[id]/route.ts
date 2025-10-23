import { NextRequest } from 'next/server';
import { relationshipService } from '@/lib/services/relationship.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateRelationshipSchema } from '@/lib/validation/schemas';
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
    const validatedData = UpdateRelationshipSchema.parse(body);

    const relationship = await relationshipService.updateRelationship(id, validatedData);

    return ApiResponseBuilder.success(relationship);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error.code === 'P2025') {
      return ApiResponseBuilder.notFound('Relationship');
    }

    console.error('Error updating relationship:', error);
    return ApiResponseBuilder.internalError('Failed to update relationship');
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
    const relationship = await relationshipService.deleteRelationship(id);

    return ApiResponseBuilder.success({
      message: 'Relationship deleted successfully',
      relationship,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return ApiResponseBuilder.notFound('Relationship');
    }

    console.error('Error deleting relationship:', error);
    return ApiResponseBuilder.internalError('Failed to delete relationship');
  }
}

