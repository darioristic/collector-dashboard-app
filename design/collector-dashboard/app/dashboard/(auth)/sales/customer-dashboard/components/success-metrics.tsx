import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getInitials } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const customers = [
  { name: "John Smith", avatar: `https://bundui-images.netlify.app/avatars/08.png` },
  { name: "Sarah Johnson", avatar: `https://bundui-images.netlify.app/avatars/09.png` },
  { name: "Mike Brown", avatar: `https://bundui-images.netlify.app/avatars/03.png` },
  { name: "Lisa Taylor", avatar: `https://bundui-images.netlify.app/avatars/04.png` },
  { name: "David Anderson", avatar: `https://bundui-images.netlify.app/avatars/05.png` },
  { name: "Emma Thomas", avatar: `https://bundui-images.netlify.app/avatars/06.png` }
];

export function SuccessMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Top Customers</CardDescription>
        <CardTitle className="font-display text-2xl lg:text-3xl">2,847</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm font-bold">VIP Customers</p>
        <div className="flex -space-x-4">
          <TooltipProvider>
            {customers.map((customer, key) => (
              <Tooltip key={key}>
                <TooltipTrigger>
                  <Avatar className="border-card size-12 border-4 hover:z-10">
                    <AvatarImage src={customer.avatar} alt="shadcn ui kit" />
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{customer.name}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <p className="mt-8 mb-2 text-sm font-bold">Customer Metrics</p>
        <div className="divide-y *:py-3">
          <div className="flex justify-between text-sm">
            <span>Avg. Customer Rating</span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="size-4 text-green-600" />
              4.8 / 5.0
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Customer Retention</span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="size-4 text-green-600" />
              94.2%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avg. Customer Value</span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="size-4 text-green-600" /> $1,847
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
