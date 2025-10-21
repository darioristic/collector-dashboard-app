import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Finance Reports",
    description: "Generate and view financial reports and analytics.",
    canonical: "/dashboard/finance/reports"
  });
}

export default function ReportsPage() {
  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Finance Reports</h1>
      </div>
      
      <div className="grid gap-4">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Financial Reports</h2>
          <p className="text-muted-foreground">
            Generate and view comprehensive financial reports and analytics.
          </p>
        </div>
      </div>
    </>
  );
}
