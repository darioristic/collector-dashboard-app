import { promises as fs } from "fs";
import path from "path";
import { generateMeta } from "@/lib/utils";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import VPSProductsDataTable from "./vps-products-data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function generateMetadata() {
  return generateMeta({
    title: "VPS Cloud Provider Products",
    description:
      "A comprehensive list of VPS cloud provider products and services. Built with Tailwind CSS, shadcn/ui and Next.js.",
    canonical: "/pages/orders"
  });
}

async function getVPSProducts() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/dashboard/(auth)/pages/orders/data.json")
  );

  return JSON.parse(data.toString());
}

export default async function Page() {
  const vpsProducts = await getVPSProducts();

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">VPS Cloud Provider Products</h1>
        <Button asChild>
          <Link href="#">
            <PlusCircledIcon /> Deploy New VPS
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">All VPS Plans</TabsTrigger>
          <TabsTrigger value="completed">Active Instances</TabsTrigger>
          <TabsTrigger value="processed">Managed Services</TabsTrigger>
          <TabsTrigger value="returned">GPU VPS</TabsTrigger>
          <TabsTrigger value="canceled">Add-on Services</TabsTrigger>
        </TabsList>
        <VPSProductsDataTable data={vpsProducts} />
      </Tabs>
    </div>
  );
}
