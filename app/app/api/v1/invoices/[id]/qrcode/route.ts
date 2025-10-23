import { NextRequest, NextResponse } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';
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
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'base64';
    const type = searchParams.get('type') || 'invoice';

    const invoice = await invoiceService.getInvoice(id);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (type === 'payment') {
      const iban = searchParams.get('iban') || undefined;
      const bic = searchParams.get('bic') || undefined;
      const qrCode = await invoiceService.generatePaymentQR(id, iban, bic);

      return NextResponse.json({
        success: true,
        data: {
          qrCode,
          type: 'payment',
        },
      });
    }

    if (format === 'buffer') {
      const qrBuffer = await invoiceService.generateQRCode(id, 'buffer') as Buffer;
      const uint8Array = new Uint8Array(qrBuffer);
      
      return new Response(uint8Array, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `inline; filename="qr-${invoice.invoiceNo}.png"`,
        },
      });
    }

    const qrCode = await invoiceService.generateQRCode(id, 'base64');

    return NextResponse.json({
      success: true,
      data: {
        qrCode,
        type: 'invoice',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

