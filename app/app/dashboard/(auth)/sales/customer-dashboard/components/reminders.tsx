import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, CircleCheck, PlusCircleIcon } from "lucide-react";
import { AddReminderDialog } from "@/app/dashboard/(auth)/sales/customer-dashboard/components/add-reminder-dialog";

type Reminder = {
  id: number;
  note?: string;
  level?: string;
  type?: string;
  isCompleted: boolean;
  date?: string;
};

const reminders: Reminder[] = [
  {
    id: 1,
    note: "Follow up with premium customer about renewal.",
    level: "high",
    type: "Customer Follow-up",
    isCompleted: false,
    date: "Today, 14:30"
  },
  {
    id: 2,
    note: "Schedule customer satisfaction survey.",
    level: "medium",
    type: "Survey",
    isCompleted: true,
    date: "Today, 11:00"
  },
  {
    id: 3,
    note: "Review customer feedback and complaints.",
    level: "medium",
    type: "Feedback Review",
    isCompleted: false,
    date: "Tomorrow, 15:30"
  }
];

export function Reminders() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Customer Reminders</CardTitle>
        <CardAction>
          <AddReminderDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardHeader>
                <CardTitle className="flex items-center text-base font-semibold capitalize">
                  <span
                    className={cn("d-inline me-2 size-2 rounded-full", {
                      "bg-gray-400": reminder.level === "low",
                      "bg-orange-400": reminder.level === "medium",
                      "bg-red-600": reminder.level === "high"
                    })}></span>{" "}
                  {reminder.level}{" "}
                  {reminder.isCompleted ? (
                    <CircleCheck className="ms-auto me-2 size-4 text-green-600" />
                  ) : (
                    <CircleCheck className="ms-auto me-2 size-4 text-gray-400" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-muted-foreground text-sm">{reminder.date}</div>
                <div className="text-sm">{reminder.note}</div>
                <Badge variant="outline">{reminder.type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-end">
          <Button variant="link" className="text-muted-foreground hover:text-primary" asChild>
            <a href="#">
              Show the other 8 reminders <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
