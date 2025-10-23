import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Finance Transactions",
    description: "View and manage all financial transactions in your dashboard.",
    canonical: "/dashboard/finance/transactions"
  });
}

export default function TransactionsPage() {
  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Finance Transactions</h1>
      </div>
      
      <div className="grid gap-4">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
          <p className="text-muted-foreground">
            View and manage all your financial transactions here.
          </p>
        </div>
      </div>
    </>
  );
}
