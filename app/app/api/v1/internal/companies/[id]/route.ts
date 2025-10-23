import { NextRequest } from 'next/server';
import { companyService } from '@/lib/services/company.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { UpdateCompanySchema } from '@/lib/validation/schemas';
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
    const validatedData = UpdateCompanySchema.parse(body);

    const company = await companyService.updateCompany(id, validatedData);

    return ApiResponseBuilder.success(company);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error.code === 'P2025') {
      return ApiResponseBuilder.notFound('Company');
    }

    if (error.code === 'P2002') {
      return ApiResponseBuilder.conflict('Company with this tax number already exists');
    }

    console.error('Error updating company:', error);
    return ApiResponseBuilder.internalError('Failed to update company');
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
    const company = await companyService.deleteCompany(id);

    return ApiResponseBuilder.success({ message: 'Company deleted successfully', company });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return ApiResponseBuilder.notFound('Company');
    }

    console.error('Error deleting company:', error);
    return ApiResponseBuilder.internalError('Failed to delete company');
  }
}

