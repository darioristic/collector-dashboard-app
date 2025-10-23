# Invoice Auto-Overdue Cron Setup

## Overview
Automatsko označavanje faktura kao overdue kada pređu due date.

## Setup Options

### Option 1: Vercel Cron Jobs (Production)

1. Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue",
      "schedule": "0 0 * * *"
    }
  ]
}
```

2. Add `CRON_SECRET` to environment variables in Vercel dashboard

3. Schedule runs daily at midnight (UTC)

### Option 2: Local Cron (Development/Self-Hosted)

1. Add to crontab:
```bash
# Run every day at midnight
0 0 * * * cd /path/to/app && bun run scripts/check-overdue-invoices.ts >> /var/log/invoice-cron.log 2>&1
```

2. Or use package.json script:
```bash
bun run check-overdue
```

### Option 3: Manual API Call

Call the API endpoint manually:
```bash
curl -X GET https://your-domain.com/api/cron/check-overdue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Environment Variables

Add to `.env.local`:
```env
CRON_SECRET=your-secure-random-secret-here
```

## How It Works

1. Cron job runs at scheduled time
2. Finds all invoices with:
   - status = 'SENT'
   - dueDate < today
3. Updates status to 'OVERDUE'
4. Returns count of updated invoices

## Testing

```bash
# Test locally
bun run scripts/check-overdue-invoices.ts

# Test API endpoint
curl -X GET http://localhost:3000/api/cron/check-overdue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring

Check logs for:
- Number of invoices marked as overdue
- Any errors during execution
- Timestamp of last run

## Alternative: Database Trigger

For real-time checking, you can also use a Postgres function:
```sql
CREATE OR REPLACE FUNCTION check_overdue_invoices()
RETURNS trigger AS $$
BEGIN
  UPDATE invoices
  SET status = 'OVERDUE'
  WHERE status = 'SENT'
    AND "dueDate" < CURRENT_DATE;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_overdue_daily
  AFTER INSERT ON invoices
  EXECUTE FUNCTION check_overdue_invoices();
```

