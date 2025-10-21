import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const conversionData = [
  {
    stage: "New Leads",
    count: 150,
    conversion: 85,
    color: "bg-blue-500"
  },
  {
    stage: "Qualified",
    count: 128,
    conversion: 70,
    color: "bg-green-500"
  },
  {
    stage: "Proposal",
    count: 89,
    conversion: 45,
    color: "bg-yellow-500"
  },
  {
    stage: "Negotiation",
    count: 40,
    conversion: 25,
    color: "bg-orange-500"
  },
  {
    stage: "Closed Won",
    count: 10,
    conversion: 100,
    color: "bg-green-600"
  }
];

export function TableLeadConversion() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Conversion</CardTitle>
        <CardDescription>Conversion rates by stage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversionData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.stage}</span>
                <span className="text-muted-foreground">{item.count} leads</span>
              </div>
              <Progress value={item.conversion} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.conversion}% conversion</span>
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
