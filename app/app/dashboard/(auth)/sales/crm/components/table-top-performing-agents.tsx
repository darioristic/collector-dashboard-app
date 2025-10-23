import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const topAgents = [
  {
    id: 1,
    name: "Alex Johnson",
    deals: 12,
    revenue: "$125,000",
    avatar: "/avatars/01.png"
  },
  {
    id: 2,
    name: "Maria Garcia",
    deals: 10,
    revenue: "$98,000",
    avatar: "/avatars/02.png"
  },
  {
    id: 3,
    name: "David Chen",
    deals: 8,
    revenue: "$87,000",
    avatar: "/avatars/03.png"
  },
  {
    id: 4,
    name: "Emma Wilson",
    deals: 7,
    revenue: "$76,000",
    avatar: "/avatars/04.png"
  }
];

export function TableTopPerformingAgents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Agents</CardTitle>
        <CardDescription>Best sales agents this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topAgents.map((agent) => (
            <div key={agent.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback>{agent.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{agent.name}</p>
                <p className="text-sm text-muted-foreground">{agent.deals} deals</p>
              </div>
              <div className="text-sm font-medium">{agent.revenue}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
