import { NextRequest } from 'next/server';
import { companyService } from '@/lib/services/company.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { CompanySchema } from '@/lib/validation/schemas';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticateService(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const validatedData = CompanySchema.parse(body);

    const company = await companyService.createCompany(validatedData);

    return ApiResponseBuilder.success(company, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return ApiResponseBuilder.validationError(error.errors);
    }

    if (error.code === 'P2002') {
      return ApiResponseBuilder.conflict('Company with this tax number already exists');
    }

    console.error('Error creating company:', error);
    return ApiResponseBuilder.internalError('Failed to create company');
  }
}

