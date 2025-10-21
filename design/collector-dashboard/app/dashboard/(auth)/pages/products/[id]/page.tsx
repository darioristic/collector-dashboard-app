import { generateMeta } from "@/lib/utils";
import ProductImageGallery from "./product-image-gallery";
import {
  CircleDollarSign,
  Edit3Icon,
  HandCoinsIcon,
  HeartIcon,
  Layers2Icon,
  ShoppingCart,
  StarIcon,
  Trash2Icon,
  TruckIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductReviewList from "./reviews";
import SubmitReviewForm from "./submit-review-form";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useId } from "react";

export async function generateMetadata() {
  return generateMeta({
    title: "Basic VPS Plan - Ubuntu 22.04 | VPS Cloud Provider",
    description:
      "Entry-level VPS with 1 vCPU, 1GB RAM, 20GB SSD storage. Perfect for small websites, development environments, and basic applications. Includes Ubuntu 22.04 LTS with full root access.",
    canonical: "/pages/products/1"
  });
}

export default function Page() {
  const dataCenterId = useId();
  const billingCycleId = useId();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-xl tracking-tight lg:text-2xl">Basic VPS Plan - Ubuntu 22.04</h1>
          <div className="text-muted-foreground inline-flex flex-col gap-2 text-sm lg:flex-row lg:gap-4">
            <div>
              <span className="text-foreground font-semibold">Provider :</span> VPS Cloud Solutions
            </div>
            <div>
              <span className="text-foreground font-semibold">Created :</span> 20 Oct, 2024
            </div>
            <div>
              <span className="text-foreground font-semibold">SKU :</span> VPS-BASIC-001
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Edit3Icon />
            <span className="hidden lg:inline">Edit</span>
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2Icon />
          </Button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-1">
          <ProductImageGallery />
        </div>
        <div className="space-y-4 xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <CircleDollarSign className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Monthly Price</span>
                <span className="text-lg font-semibold">$9.99</span>
              </div>
            </div>
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <TruckIcon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Active Instances</span>
                <span className="text-lg font-semibold">1,250</span>
              </div>
            </div>
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <Layers2Icon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Available Slots</span>
                <span className="text-lg font-semibold">50</span>
              </div>
            </div>
            <div className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4">
              <HandCoinsIcon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Uptime SLA</span>
                <span className="text-lg font-semibold">99.9%</span>
              </div>
            </div>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div className="grid items-start gap-8 xl:grid-cols-3">
                <div className="space-y-8 xl:col-span-2">
                  <div>
                    <h3 className="mb-2 font-semibold">Description:</h3>
                    <p className="text-muted-foreground">
                      Entry-level VPS with 1 vCPU, 1GB RAM, and 20GB SSD storage. Perfect for small websites, 
                      development environments, and basic applications. Includes Ubuntu 22.04 LTS with full root access, 
                      automated backups, and 24/7 monitoring.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">Key Features:</h3>
                    <ul className="text-muted-foreground list-inside list-disc">
                      <li>1 vCPU with dedicated resources</li>
                      <li>1GB DDR4 RAM</li>
                      <li>20GB NVMe SSD storage</li>
                      <li>Ubuntu 22.04 LTS (Long Term Support)</li>
                      <li>Full root access and control</li>
                      <li>99.9% uptime SLA guarantee</li>
                      <li>Automated daily backups</li>
                      <li>DDoS protection included</li>
                    </ul>
                  </div>
                </div>
                <div className="rounded-md border xl:col-span-1">
                  <Table>
                    <TableBody>
                                        <TableRow>
                    <TableCell className="font-semibold">Category</TableCell>
                    <TableCell className="text-right">VPS Plans</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Operating System</TableCell>
                    <TableCell className="text-right">Ubuntu 22.04 LTS</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">CPU</TableCell>
                    <TableCell className="text-right">1 vCPU</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">RAM</TableCell>
                    <TableCell className="text-right">1GB DDR4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Storage</TableCell>
                    <TableCell className="text-right">20GB NVMe SSD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Bandwidth</TableCell>
                    <TableCell className="text-right">1TB/month</TableCell>
                  </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="grid auto-cols-max grid-flow-row gap-8">
                <div>
                  <div className="mb-4 font-semibold">Data Centers:</div>
                  <RadioGroup defaultValue="us-east" className="flex gap-2">
                    <div>
                      <RadioGroupItem
                        value="us-east"
                        id={`${dataCenterId}-us-east`}
                        className="peer sr-only"
                        aria-label="US East"
                      />
                      <Label
                        htmlFor={`${dataCenterId}-us-east`}
                        className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-green-400 -indent-[9999px] peer-data-[state=checked]:ring">
                        US East
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="us-west"
                        id={`${dataCenterId}-us-west`}
                        className="peer sr-only"
                        aria-label="US West"
                      />
                      <Label
                        htmlFor={`${dataCenterId}-us-west`}
                        className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-indigo-400 -indent-[9999px] peer-data-[state=checked]:ring">
                        US West
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="eu-west"
                        id={`${dataCenterId}-eu-west`}
                        className="peer sr-only"
                        aria-label="EU West"
                      />
                      <Label
                        htmlFor={`${dataCenterId}-eu-west`}
                        className="border-muted hover:text-accent-foreground peer-data-[state=checked]:ring-primary [&:has([data-state=checked])]:border-primary flex size-8 cursor-pointer flex-col items-center justify-between rounded-full border bg-purple-400 -indent-[9999px] peer-data-[state=checked]:ring">
                        EU West
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <div className="mb-4 font-semibold">Billing Cycles:</div>
                  <RadioGroup defaultValue="monthly" className="flex gap-2">
                    {["monthly", "quarterly", "yearly"].map((item, key) => (
                      <div key={`${billingCycleId}-${item}`}>
                        <RadioGroupItem
                          value={item}
                          id={`${billingCycleId}-${item}`}
                          className="peer sr-only"
                          aria-label={item}
                        />
                        <Label
                          htmlFor={`${billingCycleId}-${item}`}
                          className="hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary flex size-10 cursor-pointer flex-col items-center justify-center rounded-md border text-xs uppercase">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button>
                  <ShoppingCart /> Deploy VPS Now
                </Button>
                <Button variant="outline">
                  <HeartIcon /> Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row justify-between">
              <CardTitle>Customer Reviews</CardTitle>
              <CardAction>
                <SubmitReviewForm />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 xl:grid-cols-3">
                <div className="order-last lg:order-first xl:col-span-2">
                  <ProductReviewList />
                </div>
                <div className="order-first lg:order-last xl:col-span-1">
                  <div className="overflow-hidden rounded-lg border">
                    <div className="bg-muted flex items-center gap-4 p-4">
                      <div className="flex items-center gap-1">
                        <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                        <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                        <StarIcon className="size-4 fill-orange-400 stroke-orange-400" />
                        <StarIcon className="size-4 stroke-orange-400" />
                        <StarIcon className="size-4 stroke-orange-400" />
                      </div>
                      <span className="text-muted-foreground text-sm">4.8 (156 reviews)</span>
                    </div>
                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">5 stars</span>
                        <Progress value={85} color="bg-orange-400" />
                        <span>85%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">4 stars</span>
                        <Progress value={12} color="bg-orange-600" />
                        <span>12%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">3 stars</span>
                        <Progress value={2} color="bg-yellow-300" />
                        <span>2%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">2 stars</span>
                        <Progress value={1} color="bg-yellow-600" />
                        <span>1%</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="w-20">1 star</span>
                        <Progress value={0} color="bg-red-600" />
                        <span>0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
