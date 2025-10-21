import { Award, Users, DollarSign, Star } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function SummaryCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/10 grid gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Customers</CardTitle>
          <CardDescription>
            <span className="text-green-600">+15.3% </span>from last month
          </CardDescription>
          <CardAction>
            <Users className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-display text-2xl lg:text-3xl">2,847</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Customer Revenue</CardTitle>
          <CardDescription>
            <span className="text-green-600">+8.7%</span> from last month
          </CardDescription>
          <CardAction>
            <DollarSign className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-display text-2xl lg:text-3xl">$67,892.45</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Customer Satisfaction</CardTitle>
          <CardDescription>
            <span className="text-green-600">+2.1%</span> from last month
          </CardDescription>
          <CardAction>
            <Star className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-display text-2xl lg:text-3xl">4.8/5.0</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>New Customers</CardTitle>
          <CardDescription>
            <span className="text-green-600">+12.4%</span> from last month
          </CardDescription>
          <CardAction>
            <Award className="text-muted-foreground/50 size-4 lg:size-6" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="font-display text-2xl lg:text-3xl">156</div>
        </CardContent>
      </Card>
    </div>
  );
}
