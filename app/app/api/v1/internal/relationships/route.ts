import { NextRequest } from 'next/server';
import { relationshipService } from '@/lib/services/relationship.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { RelationshipSchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticateService(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = RelationshipSchema.parse(body);

    if (validatedData.sourceCompanyId === validatedData.targetCompanyId) {
      return ApiResponseBuilder.validationError([
        { field: 'targetCompanyId', message: 'Company cannot have a relationship with itself' },
      ]);
    }

    const relationship = await relationshipService.createRelationship({
      relationType: validatedData.relationType,
      status: validatedData.status,
      sourceCompany: {
        connect: { id: validatedData.sourceCompanyId },
      },
      targetCompany: {
        connect: { id: validatedData.targetCompanyId },
      },
    });

    return ApiResponseBuilder.success(relationship, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error.code === 'P2002') {
      return ApiResponseBuilder.conflict('This relationship already exists');
    }

    if (error.code === 'P2003') {
      return ApiResponseBuilder.validationError([
        { field: 'companyId', message: 'One or both companies not found' },
      ]);
    }

    console.error('Error creating relationship:', error);
    return ApiResponseBuilder.internalError('Failed to create relationship');
  }
}

