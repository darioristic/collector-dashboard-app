import { NextRequest } from 'next/server';
import { relationshipService } from '@/lib/services/relationship.service';
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
    const relationship = await relationshipService.getRelationship(id);

    if (!relationship) {
      return ApiResponseBuilder.notFound('Relationship');
    }

    return ApiResponseBuilder.success(relationship);
  } catch (error) {
    console.error('Error fetching relationship:', error);
    return ApiResponseBuilder.internalError('Failed to fetch relationship');
  }
}

