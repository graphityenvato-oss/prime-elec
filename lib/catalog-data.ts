export type SubcategoryItem = {
  title: string;
  subtitle?: string;
  image?: string;
};

export type BrandCategory = {
  title: string;
  subtitle: string;
  image?: string;
  slug: string;
  subcategories?: SubcategoryItem[];
};

export type BrandCatalog = {
  key: string;
  name: string;
  logo: string;
  categories: BrandCategory[];
};

export const brandCatalog: BrandCatalog[] = [
  {
    key: "eaton",
    name: "Eaton",
    logo: "/images/partners/Eaton-logo.png",
    categories: [
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
          {
            title: "Emergency Luminaires",
            subtitle: "Backup lighting units.",
          },
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
        image: "/images/categ/5093533_PG1_min.webp",
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
  {
    key: "teknoware",
    name: "Teknoware",
    logo: "/images/partners/teknoware-logo.png",
    categories: [
      {
        title: "Emergency Lighting",
        subtitle: "Exit signs and emergency luminaires.",
        slug: "emergency-lighting",
        subcategories: [
          { title: "Exit Signs" },
          { title: "Emergency Luminaires" },
          { title: "Central Monitoring" },
        ],
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
  {
    key: "obo",
    name: "OBO Bettermann",
    logo: "/images/partners/obo-logo.png",
    categories: [
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
  {
    key: "indelec",
    name: "Indelec",
    logo: "/images/partners/Indelec-logo.png",
    categories: [
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
  {
    key: "degson",
    name: "Degson",
    logo: "/images/partners/degson-logo.png",
    categories: [
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
  {
    key: "relpol",
    name: "Relpol",
    logo: "/images/partners/Logo-Relpol.png",
    categories: [
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
  {
    key: "tem",
    name: "TEM",
    logo: "/images/partners/Tem-logo.png",
    categories: [
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
      {
        title: "Motor Protection",
        subtitle: "Motor starters and overload protection.",
        slug: "motor-protection",
      },
      {
        title: "Power Quality",
        subtitle: "Harmonic filters and power factor correction.",
        slug: "power-quality",
      },
      {
        title: "Enclosures",
        subtitle: "Metal and polycarbonate enclosures.",
        slug: "enclosures",
      },
      {
        title: "Energy Storage",
        subtitle: "Battery systems and energy storage solutions.",
        slug: "energy-storage",
      },
      {
        title: "Industrial Networking",
        subtitle: "Industrial Ethernet and connectivity gear.",
        slug: "industrial-networking",
      },
      {
        title: "Safety Controls",
        subtitle: "Safety relays, switches, and monitoring.",
        slug: "safety-controls",
      },
      {
        title: "Meters & Sensors",
        subtitle: "Measurement, sensing, and instrumentation.",
        slug: "meters-sensors",
      },
    ],
  },
];

export type MainCategory = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  brands: BrandCatalog[];
};

export const getMainCategories = (): MainCategory[] => {
  const index = new Map<string, MainCategory>();

  brandCatalog.forEach((brand) => {
    brand.categories.forEach((category) => {
      const existing = index.get(category.slug);
      if (!existing) {
        index.set(category.slug, {
          slug: category.slug,
          title: category.title,
          description: category.subtitle,
          image: category.image,
          brands: [brand],
        });
      } else if (!existing.brands.find((item) => item.key === brand.key)) {
        existing.brands.push(brand);
      }
    });
  });

  return Array.from(index.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
};

export const getMainCategoryBySlug = (slug: string) =>
  getMainCategories().find((category) => category.slug === slug);

export const getBrandByKey = (key: string) =>
  brandCatalog.find((brand) => brand.key === key);

export const getBrandCategory = (brandKey: string, categorySlug: string) => {
  const brand = getBrandByKey(brandKey);
  if (!brand) return null;
  const category = brand.categories.find((item) => item.slug === categorySlug);
  if (!category) return null;
  return { brand, category };
};
