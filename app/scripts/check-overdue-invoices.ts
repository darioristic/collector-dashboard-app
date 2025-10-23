import { invoiceService } from '../lib/services/invoice.service';

async function checkOverdueInvoices() {
  try {
    console.log('[Overdue Check] Starting overdue invoice check...');
    
    const count = await invoiceService.checkAndMarkOverdue();
    
    console.log(`[Overdue Check] Successfully marked ${count} invoice(s) as overdue`);
    
    return count;
  } catch (error) {
    console.error('[Overdue Check] Error checking overdue invoices:', error);
    throw error;
  }
}

if (require.main === module) {
  checkOverdueInvoices()
    .then((count) => {
      console.log(`[Overdue Check] Done. Total overdue: ${count}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Overdue Check] Failed:', error);
      process.exit(1);
    });
}

export { checkOverdueInvoices };

