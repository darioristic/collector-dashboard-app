import { NextRequest } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
import { ApiResponseBuilder } from '@/lib/api/response';
import { AuthMiddleware } from '@/lib/auth/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await AuthMiddleware.authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    const invoice = await invoiceService.sendInvoice(id);

    return ApiResponseBuilder.success({
      message: 'Invoice sent successfully',
      invoice,
    });
  } catch (error: any) {
    console.error('Error sending invoice:', error);
    return ApiResponseBuilder.internalError(error.message || 'Failed to send invoice');
  }
}

