import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CategoriesGrid,
  type CategoryCard,
} from "@/components/categories-grid";
import { SearchInput } from "@/components/search-input";

const categories: CategoryCard[] = [
  {
    title: "Eaton",
    description: "Protection, control, and distribution systems.",
    href: "/categories/eaton",
    logo: "/images/partners/Eaton-logo.png",
  },
  {
    title: "Teknoware",
    description: "Emergency lighting and safety systems.",
    href: "/categories/teknoware",
    logo: "/images/partners/teknoware-logo.png",
  },
  {
    title: "OBO Bettermann",
    description: "Cable management and lightning protection.",
    href: "/categories/obo",
    logo: "/images/partners/obo-logo.png",
  },
  {
    title: "Indelec",
    description: "Surge protection and power safety.",
    href: "/categories/indelec",
    logo: "/images/partners/Indelec-logo.png",
  },
  {
    title: "Degson",
    description: "Terminal blocks and wiring accessories.",
    href: "/categories/degson",
    logo: "/images/partners/degson-logo.png",
  },
  {
    title: "Relpol",
    description: "Industrial relays and automation control.",
    href: "/categories/relpol",
    logo: "/images/partners/Logo-Relpol.png",
  },
  {
    title: "TEM",
    description: "Switchgear and protection devices.",
    href: "/categories/tem",
    logo: "/images/partners/Tem-logo.png",
  },
  {
    title: "Eaton Industrial",
    description: "Breakers, panels, and power distribution.",
    href: "/categories/eaton",
    logo: "/images/partners/Eaton-logo.png",
  },
  
  {
    title: "OBO Systems",
    description: "Cable routing and grounding solutions.",
    href: "/categories/obo",
    logo: "/images/partners/obo-logo.png",
  },
];

export default function CategoriesPage() {
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
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Browse Brands for B2B Procurement
        </h1>

        <div className="mt-4 max-w-md">
          <SearchInput placeholder="Search brands" />
        </div>

        <CategoriesGrid categories={categories} />
      </div>
    </section>
  );
}
