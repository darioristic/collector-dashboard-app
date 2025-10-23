import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    activity: "New lead added: John Doe from Tech Corp",
    time: "2 hours ago",
    type: "lead"
  },
  {
    id: 2,
    activity: "Follow-up scheduled: Sarah Smith",
    time: "4 hours ago",
    type: "followup"
  },
  {
    id: 3,
    activity: "Deal closed: Project Alpha ($25K)",
    time: "1 day ago",
    type: "deal"
  },
  {
    id: 4,
    activity: "Proposal sent: Marketing Plus",
    time: "2 days ago",
    type: "proposal"
  }
];

const getActivityColor = (type: string) => {
  switch (type) {
    case "lead":
      return "bg-green-100 text-green-800";
    case "followup":
      return "bg-blue-100 text-blue-800";
    case "deal":
      return "bg-purple-100 text-purple-800";
    case "proposal":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TableLeadActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest activities in the CRM system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`h-2 w-2 rounded-full ${getActivityColor(activity.type)}`} />
              <div className="flex-1">
                <p className="text-sm">{activity.activity}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
