import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentLeads = [
  {
    id: 1,
    name: "John Doe",
    company: "Tech Corp",
    email: "john@techcorp.com",
    status: "Qualified",
    value: "$25,000",
    avatar: "/avatars/01.png"
  },
  {
    id: 2,
    name: "Sarah Smith",
    company: "Design Studio",
    email: "sarah@designstudio.com",
    status: "Proposal",
    value: "$15,000",
    avatar: "/avatars/02.png"
  },
  {
    id: 3,
    name: "Mike Johnson",
    company: "Marketing Plus",
    email: "mike@marketingplus.com",
    status: "New",
    value: "$8,000",
    avatar: "/avatars/03.png"
  },
  {
    id: 4,
    name: "Lisa Brown",
    company: "Consulting Group",
    email: "lisa@consulting.com",
    status: "Negotiation",
    value: "$35,000",
    avatar: "/avatars/04.png"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800";
    case "Qualified":
      return "bg-green-100 text-green-800";
    case "Proposal":
      return "bg-yellow-100 text-yellow-800";
    case "Negotiation":
      return "bg-orange-100 text-orange-800";
    case "Closed Won":
      return "bg-green-100 text-green-800";
    case "Closed Lost":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TableRecentLeads() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
        <CardDescription>Latest leads added to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={lead.avatar} alt={lead.name} />
                <AvatarFallback>{lead.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                <span className="text-sm font-medium">{lead.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
