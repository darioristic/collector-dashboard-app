import { NextRequest } from 'next/server';
import { relationshipService } from '@/lib/services/relationship.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { RelationshipQuerySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = RelationshipQuerySchema.parse(queryParams);

    const result = await relationshipService.listRelationships(validatedParams);

    return ApiResponseBuilder.successWithPagination(
      result.relationships,
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

    console.error('Error fetching relationships:', error);
    return ApiResponseBuilder.internalError('Failed to fetch relationships');
  }
}

