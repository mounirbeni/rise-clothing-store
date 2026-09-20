import { slugify } from "./format";

export type ProductCategory = "Hoodies" | "Training" | "Outerwear" | "Accessories";

export type RiseProduct = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  compareAt?: number;
  color: string;
  sizes: string[];
  stock: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  features: string[];
  collection: string;
  status: "active" | "draft" | "archived";
};

const baseProducts = [
  {
    id: "rise-discipline-hoodie",
    name: "Discipline Hoodie",
    category: "Hoodies",
    price: 118,
    color: "Washed black",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 84,
    rating: 4.9,
    reviews: 128,
    images: ["/images/product-hoodie.jpeg", "/images/campaign.jpeg"],
    description:
      "A heavyweight training hoodie with a compact fleece handfeel, dropped shoulder, and structured hood for pre-session focus and cold commutes.",
    features: ["460 GSM brushed fleece", "Hidden phone pocket", "Ribbed side panels", "Pre-shrunk garment wash"],
    collection: "More Than Yesterday",
    status: "active",
  },
  {
    id: "rise-motion-training-shell",
    name: "Motion Training Shell",
    category: "Training",
    price: 142,
    color: "Graphite",
    sizes: ["S", "M", "L", "XL"],
    stock: 51,
    rating: 4.8,
    reviews: 92,
    images: ["/images/training.jpeg", "/images/hero.jpeg"],
    description:
      "A matte performance shell cut for interval work, warmups, and all-weather sessions with vented panels and quiet stretch.",
    features: ["Water-resistant finish", "Two-way stretch", "Laser-cut ventilation", "Packable back pocket"],
    collection: "Training System",
    status: "active",
  },
  {
    id: "rise-summit-layer",
    name: "Summit Layer",
    category: "Outerwear",
    price: 168,
    compareAt: 198,
    color: "Off black",
    sizes: ["XS", "S", "M", "L"],
    stock: 27,
    rating: 4.7,
    reviews: 77,
    images: ["/images/campaign.jpeg", "/images/training.jpeg"],
    description:
      "Thermal outerwear with a clean front, bonded seams, and compact insulation for travel, recovery, and low-light miles.",
    features: ["Bonded seam construction", "Recycled insulation", "Storm flap zipper", "Adjustable hem"],
    collection: "Field Unit",
    status: "active",
  },
  {
    id: "rise-recovery-kit",
    name: "RISE Recovery Kit",
    category: "Accessories",
    price: 64,
    color: "Black / white",
    sizes: ["OS"],
    stock: 140,
    rating: 4.6,
    reviews: 43,
    images: ["/images/packaging.jpeg", "/images/product-hoodie.jpeg"],
    description:
      "A compact recovery kit with towel, bands, and grip accessories designed for training bags and hotel-room mobility sessions.",
    features: ["Performance towel", "Two resistance bands", "Textured grip set", "Reusable hard case"],
    collection: "Recovery",
    status: "active",
  },
  {
    id: "rise-apex-training-tight",
    name: "Apex Training Tight",
    category: "Training",
    price: 96,
    color: "Deep black",
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 66,
    rating: 4.8,
    reviews: 61,
    images: ["/images/hero.jpeg", "/images/training.jpeg"],
    description:
      "High-compression training tight with a locked-in waistband, abrasion-resistant panels, and reflective RISE marks.",
    features: ["Compression knit", "Internal drawcord", "Side phone pocket", "Reflective branding"],
    collection: "Training System",
    status: "active",
  },
  {
    id: "rise-blackout-cap",
    name: "Blackout Run Cap",
    category: "Accessories",
    price: 48,
    color: "Matte black",
    sizes: ["OS"],
    stock: 118,
    rating: 4.5,
    reviews: 36,
    images: ["/images/packaging.jpeg", "/images/campaign.jpeg"],
    description:
      "A low-profile cap with fast-dry panels, tonal embroidery, and a short brim for training in sun, rain, or city light.",
    features: ["Fast-dry nylon", "Adjustable rear clip", "Tonal embroidery", "Sweat-wicking band"],
    collection: "Recovery",
    status: "active",
  },
] satisfies Omit<RiseProduct, "slug">[];

export const products: RiseProduct[] = baseProducts.map((product) => ({
  ...product,
  slug: slugify(product.name),
}));

export const categories: ProductCategory[] = ["Hoodies", "Training", "Outerwear", "Accessories"];

export const customers = [
  {
    id: "cus_001",
    name: "Maya Chen",
    email: "maya@example.com",
    role: "customer",
    lifetimeValue: 842,
    orders: 6,
    tags: ["VIP", "Training"],
    address: "184 Mercer St, New York, NY",
  },
  {
    id: "cus_002",
    name: "Jordan Ellis",
    email: "jordan@example.com",
    role: "customer",
    lifetimeValue: 428,
    orders: 3,
    tags: ["Outerwear"],
    address: "922 Pine Ave, Seattle, WA",
  },
  {
    id: "cus_003",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "customer",
    lifetimeValue: 1294,
    orders: 9,
    tags: ["VIP", "Wholesale lead"],
    address: "44 Lake Shore Dr, Chicago, IL",
  },
];

export const orders = [
  {
    id: "RSE-1048",
    customer: "Maya Chen",
    total: 260,
    status: "Fulfilled",
    payment: "Paid",
    items: "Discipline Hoodie, Motion Training Shell",
    tracking: "1Z84RSE1048",
    date: "Sep 18, 2026",
  },
  {
    id: "RSE-1047",
    customer: "Jordan Ellis",
    total: 168,
    status: "In fulfillment",
    payment: "Paid",
    items: "Summit Layer",
    tracking: "Pending",
    date: "Sep 18, 2026",
  },
  {
    id: "RSE-1046",
    customer: "Sam Rivera",
    total: 326,
    status: "Refund requested",
    payment: "Review",
    items: "Apex Training Tight, Recovery Kit, Blackout Run Cap",
    tracking: "1Z84RSE1046",
    date: "Sep 17, 2026",
  },
];

export const adminMetrics = [
  { label: "Revenue", value: "$48.2K", delta: "+18.4%" },
  { label: "Orders", value: "386", delta: "+9.1%" },
  { label: "Customers", value: "12.8K", delta: "+6.8%" },
  { label: "Conversion", value: "4.7%", delta: "+1.2%" },
];

export const activity = [
  "Owner approved More Than Yesterday banner",
  "Staff updated inventory for Summit Layer",
  "Stripe webhook marked RSE-1048 paid",
  "Abandoned cart email draft generated for 214 shoppers",
  "Shipping zone Canada West tax table revised",
];

export const journalPosts = [
  {
    title: "Training In The Dead Space",
    excerpt: "How RISE designs layers for the hour before effort turns visible.",
    date: "Sep 12, 2026",
  },
  {
    title: "Why Monochrome Wins",
    excerpt: "A stricter palette makes silhouette, proportion, and durability impossible to hide.",
    date: "Sep 04, 2026",
  },
  {
    title: "The Recovery Pack List",
    excerpt: "Five objects that keep travel days from stealing tomorrow's session.",
    date: "Aug 29, 2026",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function relatedProducts(product: RiseProduct) {
  return products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(products.filter((item) => item.id !== product.id && item.category !== product.category))
    .slice(0, 4);
}
