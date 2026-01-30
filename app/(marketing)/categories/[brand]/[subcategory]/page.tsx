import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { SearchInput } from "@/components/search-input";
import { HoverCard } from "@/components/hover-card";

type Subcategory = { title: string; subtitle?: string; image?: string };

const subcategoryData: Record<
  string,
  { brandName: string; title: string; items: Subcategory[] }
> = {
  "eaton/power-distribution": {
    brandName: "Eaton",
    title: "Power Distribution",
    items: [
      { title: "MCCB", image: "/images/products/MCCB-Seriess.png" },
      { title: "Switchgear", image: "/images/products/Switchgear.png" },
      { title: "Panel Boards", image: "/images/products/Control-Relays.png" },
    ],
  },
  "eaton/industrial-automation": {
    brandName: "Eaton",
    title: "Industrial Automation",
    items: [
      { title: "PLCs", image: "/images/placeholder/imageholder.webp" },
      { title: "I/O Modules", image: "/images/placeholder/imageholder.webp" },
      { title: "Sensors", image: "/images/placeholder/imageholder.webp" },
    ],
  },
  "eaton/lighting-safety": {
    brandName: "Eaton",
    title: "Lighting & Safety",
    items: [
      { title: "Exit Signs", image: "/images/placeholder/imageholder.webp" },
      {
        title: "Emergency Luminaires",
        image: "/images/placeholder/imageholder.webp",
      },
      {
        title: "Safety Accessories",
        image: "/images/placeholder/imageholder.webp",
      },
    ],
  },
  "eaton/energy-management": {
    brandName: "Eaton",
    title: "Energy Management",
    items: [
      { title: "Meters", image: "/images/placeholder/imageholder.webp" },
      { title: "Monitoring", image: "/images/placeholder/imageholder.webp" },
      {
        title: "Surge Protection",
        image: "/images/placeholder/imageholder.webp",
      },
    ],
  },
  "eaton/wiring-devices": {
    brandName: "Eaton",
    title: "Wiring Devices",
    items: [
      { title: "Switches", image: "/images/placeholder/imageholder.webp" },
      { title: "Sockets", image: "/images/placeholder/imageholder.webp" },
      { title: "Accessories", image: "/images/placeholder/imageholder.webp" },
    ],
  },
  "eaton/cables-accessories": {
    brandName: "Eaton",
    title: "Cables & Accessories",
    items: [
      {
        title: "Metal Cable Routing Ducts",
        image: "/images/placeholder/imageholder.webp",
      },
      {
        title: "Cable Trunking",
        image: "/images/placeholder/imageholder.webp",
      },
      { title: "Cable Trays", image: "/images/placeholder/imageholder.webp" },
    ],
  },
};

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ brand: string; subcategory: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.brand || !resolvedParams?.subcategory) {
    notFound();
  }

  const key = `${resolvedParams.brand.toLowerCase()}/${resolvedParams.subcategory.toLowerCase()}`;
  const data = subcategoryData[key];
  if (!data) {
    notFound();
  }

  return (
    <section className="relative left-1/2 right-1/2 w-screen -mx-[50vw] bg-white py-14 text-foreground dark:bg-[#0b1118] dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-6">
        <Breadcrumb className="text-foreground/70 dark:text-white/70">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/categories">Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/categories/${resolvedParams.brand}`}>
                  {data.brandName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {data.title}
        </h1>

        <div className="mt-4 max-w-md">
          <SearchInput placeholder="Search subcategories" />
        </div>

        <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => (
            <HoverCard
              key={item.title}
              className="h-55 p-4 text-foreground dark:text-white sm:h-50 sm:p-6"
              contentClassName="flex h-full flex-col justify-between"
            >
              <div className="h-14 w-32 sm:h-16 sm:w-36">
                <Image
                  src={item.image ?? "/images/placeholder/imageholder.webp"}
                  alt={`${item.title} product`}
                  width={180}
                  height={120}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>
              <Link
                href="/brands"
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10 sm:mt-4 sm:text-xs"
              >
                <span>View Products</span>
              </Link>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
