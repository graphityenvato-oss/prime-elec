import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SearchInput } from "@/components/search-input";
import { StockFilterAside } from "@/components/stock-filter-aside";
import { StockProducts } from "@/components/stock-products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const stockProducts = [
  {
    image: "/images/products/MCCB-Seriess.png",
    title: "MCCB Series",
    partNumber: "MCCB-420X",
    description: "Compact molded case breaker for industrial panels.",
    inStock: true,
  },
  {
    image: "/images/products/Switchgear.png",
    title: "Switchgear Unit",
    partNumber: "SWG-9000",
    description: "Switchgear assembly for distribution systems.",
    inStock: true,
  },
  {
    image: "/images/products/Terminal-Blockss.png",
    title: "Terminal Blocks",
    partNumber: "TBX-220",
    description: "High-density terminal blocks for control wiring.",
    inStock: false,
  },
  {
    image: "/images/products/Emergency-Lighting.png",
    title: "Emergency Lighting",
    partNumber: "EL-120",
    description: "Emergency lighting fixture with backup battery.",
    inStock: true,
  },
  {
    image: "/images/products/Control-Relays.png",
    title: "Control Relays",
    partNumber: "CR-88",
    description: "Control relay module for automation cabinets.",
    inStock: true,
  },
  {
    image: "/images/products/Cable-Trayss.png",
    title: "Cable Trays",
    partNumber: "CT-300",
    description: "Cable tray system for heavy-duty routing.",
    inStock: true,
  },
  {
    image: "/images/products/Surge-Protectionn.png",
    title: "Surge Protection",
    partNumber: "SP-220",
    description: "Surge protection module for sensitive systems.",
    inStock: true,
  },
  {
    image: "/images/products/Control-Relays.png",
    title: "Control Relay Pro",
    partNumber: "CR-110",
    description: "Control relay with high switching capacity.",
    inStock: false,
  },
  {
    image: "/images/products/Switchgear.png",
    title: "Switchgear Pro",
    partNumber: "SG-1200",
    description: "Switchgear unit for distribution rooms.",
    inStock: true,
  },
  {
    image: "/images/products/Terminal-Blockss.png",
    title: "Terminal Blocks X",
    partNumber: "TBX-450",
    description: "Terminal blocks for panel wiring.",
    inStock: true,
  },
  {
    image: "/images/products/Emergency-Lighting.png",
    title: "Emergency Lighting X",
    partNumber: "EL-240",
    description: "Emergency lighting with extended backup.",
    inStock: true,
  },
  {
    image: "/images/products/Cable-Trayss.png",
    title: "Cable Tray XL",
    partNumber: "CT-520",
    description: "Cable tray section for long runs.",
    inStock: false,
  },
  {
    image: "/images/products/MCCB-Seriess.png",
    title: "MCCB Series XL",
    partNumber: "MCCB-530X",
    description: "High-capacity breaker for power distribution.",
    inStock: true,
  },
  {
    image: "/images/products/Surge-Protectionn.png",
    title: "Surge Protection Max",
    partNumber: "SP-300",
    description: "Surge protection module for critical loads.",
    inStock: true,
  },
  {
    image: "/images/products/Terminal-Blockss.png",
    title: "Terminal Blocks Pro",
    partNumber: "TBX-600",
    description: "Multi-level terminal blocks for dense panels.",
    inStock: false,
  },
  {
    image: "/images/products/Switchgear.png",
    title: "Switchgear Prime",
    partNumber: "SWG-7800",
    description: "Switchgear lineup for industrial facilities.",
    inStock: true,
  },
  {
    image: "/images/products/Control-Relays.png",
    title: "Control Relay Plus",
    partNumber: "CR-150",
    description: "Control relay with diagnostics.",
    inStock: true,
  },
  {
    image: "/images/products/Cable-Trayss.png",
    title: "Cable Tray Pro",
    partNumber: "CT-640",
    description: "Cable tray section for overhead runs.",
    inStock: true,
  },
];

export default function StockPage() {
  return (
    <section className="py-10 sm:py-14">
      <Breadcrumb className="text-foreground/70">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Stock</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
        Stock Products
      </h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <StockFilterAside />
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              placeholder="Search stock products"
              className="w-full"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-full px-4 text-sm sm:w-56"
                >
                  Filter
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Newest</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <StockProducts products={stockProducts} perPage={12} />
        </div>
      </div>
    </section>
  );
}
