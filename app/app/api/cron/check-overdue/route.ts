import { NextRequest, NextResponse } from 'next/server';
import { invoiceService } from '@/lib/services/invoice.service';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const count = await invoiceService.checkAndMarkOverdue();

    console.log(`[Cron] Marked ${count} invoice(s) as overdue`);

    return NextResponse.json({
      success: true,
      message: `Marked ${count} invoice(s) as overdue`,
      count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Error checking overdue invoices:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check overdue invoices',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

