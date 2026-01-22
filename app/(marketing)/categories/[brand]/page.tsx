import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HoverCard } from "@/components/hover-card";
import { SearchInput } from "@/components/search-input";

type BrandKey =
  | "eaton"
  | "teknoware"
  | "obo"
  | "indelec"
  | "degson"
  | "relpol"
  | "tem";

const brandData: Record<
  BrandKey,
  {
    name: string;
    logo: string;
    cards: {
      title: string;
      subtitle: string;
      image?: string;
      slug: string;
      subcategories?: { title: string; subtitle: string }[];
    }[];
  }
> = {
  eaton: {
    name: "Eaton",
    logo: "/images/partners/Eaton-logo.png",
    cards: [
      {
        title: "Power Distribution",
        subtitle: "Breakers, panels, and switchgear solutions.",
        image: "/images/products/MCCB-Seriess.png",
        slug: "power-distribution",
        subcategories: [
          { title: "MCCB", subtitle: "Compact molded case breakers." },
          { title: "Switchgear", subtitle: "LV switchgear assemblies." },
          {
            title: "Panel Boards",
            subtitle: "Distribution boards and panels.",
          },
        ],
      },
      {
        title: "Industrial Automation",
        subtitle: "Control systems and automation components.",
        image: "/images/products/Terminal-Blockss.png",
        slug: "industrial-automation",
        subcategories: [
          { title: "PLCs", subtitle: "Programmable control systems." },
          { title: "I/O Modules", subtitle: "Input/output expansion units." },
          { title: "Sensors", subtitle: "Industrial sensing devices." },
        ],
      },
      {
        title: "Lighting & Safety",
        subtitle: "Emergency lighting and protection systems.",
        image: "/images/products/Emergency-Lighting.png",
        slug: "lighting-safety",
        subcategories: [
          { title: "Exit Signs", subtitle: "Emergency exit signage." },
          { title: "Emergency Luminaires", subtitle: "Backup lighting units." },
          { title: "Safety Accessories", subtitle: "Mounting and add-ons." },
        ],
      },
      {
        title: "Energy Management",
        subtitle: "Monitoring, metering, and optimization.",
        image: "/images/products/Surge-Protectionn.png",
        slug: "energy-management",
        subcategories: [
          { title: "Meters", subtitle: "Energy metering devices." },
          { title: "Monitoring", subtitle: "Power quality analytics." },
          { title: "Surge Protection", subtitle: "Protection for equipment." },
        ],
      },
      {
        title: "Wiring Devices",
        subtitle: "Switches, outlets, and accessories.",
        image: "/images/products/Control-Relays.png",
        slug: "wiring-devices",
        subcategories: [
          { title: "Switches", subtitle: "Wall switches and controls." },
          { title: "Sockets", subtitle: "Outlets and receptacles." },
          { title: "Accessories", subtitle: "Plates and covers." },
        ],
      },
      {
        title: "Cables & Accessories",
        subtitle: "Trays, conduits, and installation hardware.",
        image: "/images/products/Cable-Trayss.png",
        slug: "cables-accessories",
        subcategories: [
          {
            title: "Metal Cable Routing Ducts",
            subtitle: "Metal trunking ducts.",
          },
          { title: "Cable Trunking", subtitle: "PVC and metal trunking." },
          { title: "Cable Trays", subtitle: "Ladder and tray systems." },
        ],
      },
    ],
  },
  teknoware: {
    name: "Teknoware",
    logo: "/images/partners/teknoware-logo.png",
    cards: [
      {
        title: "Emergency Lighting",
        subtitle: "Exit signs and emergency luminaires.",
        slug: "emergency-lighting",
      },
      {
        title: "Central Monitoring",
        subtitle: "Control and testing systems.",
        slug: "central-monitoring",
      },
      {
        title: "Battery Systems",
        subtitle: "Reliable backup power units.",
        slug: "battery-systems",
      },
      {
        title: "Industrial Fixtures",
        subtitle: "Durable lighting for harsh environments.",
        slug: "industrial-fixtures",
      },
      {
        title: "Wayfinding",
        subtitle: "Signage and guidance solutions.",
        slug: "wayfinding",
      },
      {
        title: "Maintenance Tools",
        subtitle: "Testing and diagnostics equipment.",
        slug: "maintenance-tools",
      },
    ],
  },
  obo: {
    name: "OBO Bettermann",
    logo: "/images/partners/obo-logo.png",
    cards: [
      {
        title: "Cable Management",
        subtitle: "Trays, ladders, and routing systems.",
        slug: "cable-management",
      },
      {
        title: "Surge Protection",
        subtitle: "Protect equipment and networks.",
        slug: "surge-protection",
      },
      {
        title: "Grounding",
        subtitle: "Reliable earthing solutions.",
        slug: "grounding",
      },
      {
        title: "Lightning Protection",
        subtitle: "External and internal protection.",
        slug: "lightning-protection",
      },
      {
        title: "Floor Systems",
        subtitle: "Underfloor and installation systems.",
        slug: "floor-systems",
      },
      {
        title: "Fasteners",
        subtitle: "Accessories and mounting hardware.",
        slug: "fasteners",
      },
    ],
  },
  indelec: {
    name: "Indelec",
    logo: "/images/partners/Indelec-logo.png",
    cards: [
      {
        title: "Surge Arresters",
        subtitle: "Protection for power systems.",
        slug: "surge-arresters",
      },
      {
        title: "Telecom Protection",
        subtitle: "Data and signal surge devices.",
        slug: "telecom-protection",
      },
      {
        title: "Power Safety",
        subtitle: "Coordination and equipment safety.",
        slug: "power-safety",
      },
      {
        title: "Monitoring",
        subtitle: "Surge counters and indicators.",
        slug: "monitoring",
      },
      {
        title: "Accessories",
        subtitle: "Mounting and system components.",
        slug: "accessories",
      },
      {
        title: "Industrial Kits",
        subtitle: "Preconfigured protection sets.",
        slug: "industrial-kits",
      },
    ],
  },
  degson: {
    name: "Degson",
    logo: "/images/partners/degson-logo.png",
    cards: [
      {
        title: "Terminal Blocks",
        subtitle: "Reliable wiring connections.",
        slug: "terminal-blocks",
      },
      {
        title: "Relays & Bases",
        subtitle: "Switching and control elements.",
        slug: "relays-bases",
      },
      {
        title: "Pluggable Connectors",
        subtitle: "Fast and secure connections.",
        slug: "pluggable-connectors",
      },
      {
        title: "DIN Rail Systems",
        subtitle: "Mounting and organization.",
        slug: "din-rail-systems",
      },
      {
        title: "Marker Systems",
        subtitle: "Labeling and identification.",
        slug: "marker-systems",
      },
      {
        title: "Accessories",
        subtitle: "Jumpers, end plates, and tools.",
        slug: "accessories",
      },
    ],
  },
  relpol: {
    name: "Relpol",
    logo: "/images/partners/Logo-Relpol.png",
    cards: [
      {
        title: "Industrial Relays",
        subtitle: "General purpose switching.",
        slug: "industrial-relays",
      },
      {
        title: "Time Relays",
        subtitle: "Delay and timing control.",
        slug: "time-relays",
      },
      {
        title: "Sockets & Accessories",
        subtitle: "Mounting and wiring support.",
        slug: "sockets-accessories",
      },
      {
        title: "Interface Modules",
        subtitle: "Signal conversion and isolation.",
        slug: "interface-modules",
      },
      {
        title: "Rail Relays",
        subtitle: "Compact DIN rail units.",
        slug: "rail-relays",
      },
      {
        title: "Safety Relays",
        subtitle: "Safety monitoring solutions.",
        slug: "safety-relays",
      },
    ],
  },
  tem: {
    name: "TEM",
    logo: "/images/partners/Tem-logo.png",
    cards: [
      {
        title: "Switchgear",
        subtitle: "Protection and control systems.",
        slug: "switchgear",
      },
      {
        title: "Circuit Breakers",
        subtitle: "MCB, MCCB, and accessories.",
        slug: "circuit-breakers",
      },
      {
        title: "Distribution Boards",
        subtitle: "Panel systems and enclosures.",
        slug: "distribution-boards",
      },
      {
        title: "Control Devices",
        subtitle: "Contactors and relays.",
        slug: "control-devices",
      },
      {
        title: "Metering",
        subtitle: "Monitoring and measurement.",
        slug: "metering",
      },
      {
        title: "Accessories",
        subtitle: "Busbars and wiring sets.",
        slug: "accessories",
      },
    ],
  },
};

const formatTitle = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function CategoryBrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const resolvedParams = await params;
  if (!resolvedParams?.brand) {
    notFound();
  }
  const brandParam = resolvedParams.brand;
  const key = brandParam.toLowerCase() as BrandKey;
  const data = brandData[key];
  const title = data?.name ?? formatTitle(brandParam);
  const cards = data?.cards ?? [];

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
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {title} Categories
        </h1>

        <div className="mt-4 max-w-md">
          <SearchInput placeholder="Search categories" />
        </div>

        <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <HoverCard
              key={card.title}
              className="brand-glow-card brand-glow-card--static h-60 p-4 text-foreground dark:text-white sm:h-55 sm:p-6"
            >
              <div className="brand-glow-card__content flex h-full flex-col justify-between">
                <div className="h-14 w-32 sm:h-16 sm:w-36">
                  <Image
                    src={card.image ?? "/images/placeholder/imageholder.webp"}
                    alt={`${card.title} product`}
                    width={180}
                    height={120}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="mt-2 text-sm text-foreground/70 dark:text-white/70">
                    {card.subtitle}
                  </p>
                </div>
                <Link
                  href={`/categories/${key}/${card.slug}`}
                  className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:text-white dark:border-white/30 dark:hover:border-white dark:hover:bg-white/10 sm:mt-4 sm:text-xs"
                >
                  <span>View More</span>
                </Link>
              </div>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
