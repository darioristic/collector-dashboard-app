import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const count = await invoiceService.checkAndMarkOverdue();

    return ApiResponseBuilder.success({
      message: `Marked ${count} invoice(s) as overdue`,
      count,
    });
  } catch (error: any) {
    console.error('Error checking overdue invoices:', error);
    return ApiResponseBuilder.internalError('Failed to check overdue invoices');
  }
}

