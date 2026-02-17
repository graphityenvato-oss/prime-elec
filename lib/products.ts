export type Product = {
  id: string;
  title: string;
  codeNo?: string;
  subcategory?: string;
  partNumber: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  inStock: boolean;
  brand: string;
  category: string;
  specs: { label: string; value: string }[];
};

const toProductId = (partNumber: string) =>
  partNumber
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const products: Product[] = [
  {
    id: toProductId("MCCB-420X"),
    title: "MCCB Series",
    partNumber: "MCCB-420X",
    description: "Compact molded case breaker for industrial panels.",
    longDescription:
      "MCCB-420X is designed for industrial distribution boards with high breaking capacity, reliable thermal protection, and modular accessories.",
    image: "/images/products/MCCB-Seriess.png",
    images: [
      "/images/products/MCCB-Seriess.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Eaton",
    category: "Power Distribution",
    specs: [
      { label: "Rated Current", value: "250A" },
      { label: "Breaking Capacity", value: "36kA" },
      { label: "Mounting", value: "Panel / DIN" },
      { label: "Voltage", value: "415V" },
    ],
  },
  {
    id: toProductId("SWG-9000"),
    title: "Switchgear Unit",
    partNumber: "SWG-9000",
    description: "Switchgear assembly for distribution systems.",
    longDescription:
      "SWG-9000 is a modular switchgear unit engineered for fast maintenance access and reliable load management in LV systems.",
    image: "/images/products/Switchgear.png",
    images: [
      "/images/products/Switchgear.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "TEM",
    category: "Switchgear",
    specs: [
      { label: "Configuration", value: "Modular" },
      { label: "Ingress Rating", value: "IP54" },
      { label: "Busbar", value: "Cu 1600A" },
      { label: "Voltage", value: "415V" },
    ],
  },
  {
    id: toProductId("TBX-220"),
    title: "Terminal Blocks",
    partNumber: "TBX-220",
    description: "High-density terminal blocks for control wiring.",
    longDescription:
      "TBX-220 provides secure wiring with vibration-resistant clamps and clear labeling channels for fast maintenance.",
    image: "/images/products/Terminal-Blockss.png",
    images: [
      "/images/products/Terminal-Blockss.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: false,
    brand: "Degson",
    category: "Industrial Automation",
    specs: [
      { label: "Pitch", value: "5.08mm" },
      { label: "Current", value: "24A" },
      { label: "Wire Size", value: "0.2-4mm²" },
      { label: "Mounting", value: "DIN Rail" },
    ],
  },
  {
    id: toProductId("EL-120"),
    title: "Emergency Lighting",
    partNumber: "EL-120",
    description: "Emergency lighting fixture with backup battery.",
    longDescription:
      "EL-120 delivers dependable emergency illumination with long-life LED modules and fast recharge capability.",
    image: "/images/products/Emergency-Lighting.png",
    images: [
      "/images/products/Emergency-Lighting.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Teknoware",
    category: "Lighting & Safety",
    specs: [
      { label: "Battery Backup", value: "3 hours" },
      { label: "Ingress Rating", value: "IP65" },
      { label: "Mounting", value: "Ceiling / Wall" },
      { label: "Lumen Output", value: "450 lm" },
    ],
  },
  {
    id: toProductId("CR-88"),
    title: "Control Relays",
    partNumber: "CR-88",
    description: "Control relay module for automation cabinets.",
    longDescription:
      "CR-88 provides fast switching with low coil consumption and clear status indication for panel builders.",
    image: "/images/products/Control-Relays.png",
    images: [
      "/images/products/Control-Relays.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Relpol",
    category: "Control Devices",
    specs: [
      { label: "Coil Voltage", value: "24V DC" },
      { label: "Contacts", value: "2 CO" },
      { label: "Switching Current", value: "8A" },
      { label: "Mounting", value: "Plug-in" },
    ],
  },
  {
    id: toProductId("CT-300"),
    title: "Cable Trays",
    partNumber: "CT-300",
    description: "Cable tray system for heavy-duty routing.",
    longDescription:
      "CT-300 is engineered for industrial cable routing with fast assembly and corrosion-resistant finishes.",
    image: "../Categories/images/5093533_PG1.png",
    images: [
      "../Categories/images/5093533_PG1.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "OBO Bettermann",
    category: "Cable Management",
    specs: [
      { label: "Width", value: "300mm" },
      { label: "Finish", value: "Hot-dip galvanized" },
      { label: "Load Class", value: "Heavy duty" },
      { label: "Length", value: "3m" },
    ],
  },
  {
    id: toProductId("SP-220"),
    title: "Surge Protection",
    partNumber: "SP-220",
    description: "Surge protection module for sensitive systems.",
    longDescription:
      "SP-220 protects critical loads with low leakage current and fast response time for industrial panels.",
    image: "/images/products/Surge-Protectionn.png",
    images: [
      "/images/products/Surge-Protectionn.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Indelec",
    category: "Surge Protection",
    specs: [
      { label: "Response Time", value: "<25 ns" },
      { label: "Max Discharge", value: "20 kA" },
      { label: "Mounting", value: "DIN Rail" },
      { label: "Voltage", value: "230V" },
    ],
  },
  {
    id: toProductId("CR-110"),
    title: "Control Relay Pro",
    partNumber: "CR-110",
    description: "Control relay with high switching capacity.",
    longDescription:
      "CR-110 improves switching reliability with reinforced contacts and socket compatibility for retrofit.",
    image: "/images/products/Control-Relays.png",
    images: [
      "/images/products/Control-Relays.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: false,
    brand: "Relpol",
    category: "Control Devices",
    specs: [
      { label: "Coil Voltage", value: "110V AC" },
      { label: "Contacts", value: "3 CO" },
      { label: "Switching Current", value: "10A" },
      { label: "Mounting", value: "Plug-in" },
    ],
  },
  {
    id: toProductId("SG-1200"),
    title: "Switchgear Pro",
    partNumber: "SG-1200",
    description: "Switchgear unit for distribution rooms.",
    longDescription:
      "SG-1200 delivers robust protection and easy front access for operational teams in medium-size plants.",
    image: "/images/products/Switchgear.png",
    images: [
      "/images/products/Switchgear.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "TEM",
    category: "Switchgear",
    specs: [
      { label: "Configuration", value: "Draw-out" },
      { label: "Ingress Rating", value: "IP54" },
      { label: "Busbar", value: "Cu 2000A" },
      { label: "Voltage", value: "415V" },
    ],
  },
  {
    id: toProductId("TBX-450"),
    title: "Terminal Blocks X",
    partNumber: "TBX-450",
    description: "Terminal blocks for panel wiring.",
    longDescription:
      "TBX-450 combines compact form factor with secure clamping for fast panel builds.",
    image: "/images/products/Terminal-Blockss.png",
    images: [
      "/images/products/Terminal-Blockss.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Degson",
    category: "Industrial Automation",
    specs: [
      { label: "Pitch", value: "5mm" },
      { label: "Current", value: "32A" },
      { label: "Wire Size", value: "0.5-6mm²" },
      { label: "Mounting", value: "DIN Rail" },
    ],
  },
  {
    id: toProductId("EL-240"),
    title: "Emergency Lighting X",
    partNumber: "EL-240",
    description: "Emergency lighting with extended backup.",
    longDescription:
      "EL-240 delivers extended autonomy with high-efficiency LED optics and quick diagnostics.",
    image: "/images/products/Emergency-Lighting.png",
    images: [
      "/images/products/Emergency-Lighting.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Teknoware",
    category: "Lighting & Safety",
    specs: [
      { label: "Battery Backup", value: "6 hours" },
      { label: "Ingress Rating", value: "IP65" },
      { label: "Mounting", value: "Ceiling / Wall" },
      { label: "Lumen Output", value: "620 lm" },
    ],
  },
  {
    id: toProductId("CT-520"),
    title: "Cable Tray XL",
    partNumber: "CT-520",
    description: "Cable tray section for long runs.",
    longDescription:
      "CT-520 offers additional span performance and a reinforced profile for heavy duty projects.",
    image: "/images/products/Cable-Trayss.png",
    images: [
      "/images/products/Cable-Trayss.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: false,
    brand: "OBO Bettermann",
    category: "Cable Management",
    specs: [
      { label: "Width", value: "520mm" },
      { label: "Finish", value: "Hot-dip galvanized" },
      { label: "Load Class", value: "Heavy duty" },
      { label: "Length", value: "3m" },
    ],
  },
  {
    id: toProductId("MCCB-530X"),
    title: "MCCB Series XL",
    partNumber: "MCCB-530X",
    description: "High-capacity breaker for power distribution.",
    longDescription:
      "MCCB-530X extends the MCCB lineup with higher interrupting ratings and configurable trip units.",
    image: "/images/products/MCCB-Seriess.png",
    images: [
      "/images/products/MCCB-Seriess.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Eaton",
    category: "Power Distribution",
    specs: [
      { label: "Rated Current", value: "400A" },
      { label: "Breaking Capacity", value: "50kA" },
      { label: "Mounting", value: "Panel / DIN" },
      { label: "Voltage", value: "415V" },
    ],
  },
  {
    id: toProductId("SP-300"),
    title: "Surge Protection Max",
    partNumber: "SP-300",
    description: "Surge protection module for critical loads.",
    longDescription:
      "SP-300 extends protection with higher discharge capability for mission-critical equipment.",
    image: "/images/products/Surge-Protectionn.png",
    images: [
      "/images/products/Surge-Protectionn.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Indelec",
    category: "Surge Protection",
    specs: [
      { label: "Response Time", value: "<20 ns" },
      { label: "Max Discharge", value: "40 kA" },
      { label: "Mounting", value: "DIN Rail" },
      { label: "Voltage", value: "230V" },
    ],
  },
  {
    id: toProductId("TBX-600"),
    title: "Terminal Blocks Pro",
    partNumber: "TBX-600",
    description: "Multi-level terminal blocks for dense panels.",
    longDescription:
      "TBX-600 offers multi-level wiring for compact enclosures with clear labeling and jumpers.",
    image: "/images/products/Terminal-Blockss.png",
    images: [
      "/images/products/Terminal-Blockss.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: false,
    brand: "Degson",
    category: "Industrial Automation",
    specs: [
      { label: "Pitch", value: "6mm" },
      { label: "Current", value: "41A" },
      { label: "Wire Size", value: "0.5-10mm²" },
      { label: "Mounting", value: "DIN Rail" },
    ],
  },
  {
    id: toProductId("SWG-7800"),
    title: "Switchgear Prime",
    partNumber: "SWG-7800",
    description: "Switchgear lineup for industrial facilities.",
    longDescription:
      "SWG-7800 delivers high performance switching with modular add-ons and front-access service panels.",
    image: "/images/products/Switchgear.png",
    images: [
      "/images/products/Switchgear.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "TEM",
    category: "Switchgear",
    specs: [
      { label: "Configuration", value: "Fixed" },
      { label: "Ingress Rating", value: "IP54" },
      { label: "Busbar", value: "Cu 2500A" },
      { label: "Voltage", value: "415V" },
    ],
  },
  {
    id: toProductId("CR-150"),
    title: "Control Relay Plus",
    partNumber: "CR-150",
    description: "Control relay with diagnostics.",
    longDescription:
      "CR-150 adds diagnostics and LED indicators for fast maintenance in automation panels.",
    image: "/images/products/Control-Relays.png",
    images: [
      "/images/products/Control-Relays.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "Relpol",
    category: "Control Devices",
    specs: [
      { label: "Coil Voltage", value: "24V DC" },
      { label: "Contacts", value: "2 CO" },
      { label: "Switching Current", value: "10A" },
      { label: "Mounting", value: "Plug-in" },
    ],
  },
  {
    id: toProductId("CT-640"),
    title: "Cable Tray Pro",
    partNumber: "CT-640",
    description: "Cable tray section for overhead runs.",
    longDescription:
      "CT-640 provides high load performance for overhead cable routing with reinforced ribs.",
    image: "../Categories/images/5093533_PG1.png",
    images: [
      "../Categories/images/5093533_PG1.png",
      "/images/placeholder/imageholder.webp",
      "/images/placeholder/imageholder.webp",
    ],
    inStock: true,
    brand: "OBO Bettermann",
    category: "Cable Management",
    specs: [
      { label: "Width", value: "640mm" },
      { label: "Finish", value: "Hot-dip galvanized" },
      { label: "Load Class", value: "Heavy duty" },
      { label: "Length", value: "3m" },
    ],
  },
];

export const getProductById = (id: string) =>
  products.find((product) => product.id === id);
