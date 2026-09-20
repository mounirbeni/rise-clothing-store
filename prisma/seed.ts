import { PrismaClient, Role, type Product } from "@prisma/client";
import { hashPassword } from "../lib/auth";
import { slugify } from "../lib/format";

const prisma = new PrismaClient();

type ProductSeed = {
  name: string;
  category: string;
  price: number;
  compareAt?: number | null;
  color: string;
  featured: boolean;
  sizes: { size: string; stock: number }[];
  image: string;
  description: string;
};

const APPAREL_SIZES = [
  { size: "XS", stock: 14 },
  { size: "S", stock: 22 },
  { size: "M", stock: 28 },
  { size: "L", stock: 20 },
  { size: "XL", stock: 10 },
];
const THREE_SIZES = [
  { size: "S", stock: 24 },
  { size: "M", stock: 30 },
  { size: "L", stock: 18 },
];
const ONE_SIZE = [{ size: "OS", stock: 60 }];

const products: ProductSeed[] = [
  {
    name: "RISE Performance Cap", category: "Accessories", price: 3800, color: "Matte black", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-baseball-cap.jpeg",
    description: "A low-profile six-panel cap in structured cotton twill with a tonal embroidered R mark and an adjustable rear strap built for training in any weather.",
  },
  {
    name: "RISE Knit Beanie", category: "Accessories", price: 3200, color: "Black", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-beanie.jpeg",
    description: "A ribbed-knit beanie with a folded cuff and woven R patch, cut close for cold-weather sessions and early starts.",
  },
  {
    name: "RISE Compression Tee", category: "Training", price: 5800, color: "Black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-compression-shirt.jpeg",
    description: "A second-skin compression tee in four-way stretch fabric that supports muscle recovery and moves cleanly under any training layer.",
  },
  {
    name: "RISE Cropped Hoodie", category: "Hoodies", price: 9800, color: "Washed black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-cropped-hoodie.jpeg",
    description: "A cropped-length hoodie in brushed fleece with a relaxed hood and dropped shoulder, built for studio sessions and everyday layering.",
  },
  {
    name: "RISE Gym Backpack", category: "Accessories", price: 8800, color: "Black", featured: true,
    sizes: ONE_SIZE, image: "/images/products/rise-gym-backpack.jpeg",
    description: "A structured training backpack with a ventilated shoe compartment, padded laptop sleeve, and water-resistant shell for gym-to-office days.",
  },
  {
    name: "RISE Duffel Bag", category: "Accessories", price: 7800, color: "Black", featured: true,
    sizes: ONE_SIZE, image: "/images/products/rise-gym-duffel-bag.jpeg",
    description: "A heavy-canvas duffel with a separate wet/dry compartment and reinforced carry handles, sized for a full training kit.",
  },
  {
    name: "RISE Performance Towel", category: "Accessories", price: 2400, color: "Black / white", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-gym-towel.jpeg",
    description: "A quick-dry microfiber towel with a woven R mark, compact enough for a gym bag and absorbent enough for a full session.",
  },
  {
    name: "RISE Lifting Belt", category: "Accessories", price: 6800, color: "Black", featured: false,
    sizes: THREE_SIZES, image: "/images/products/rise-lifting-belt.jpeg",
    description: "A contoured leather lifting belt with a double-prong buckle for consistent core bracing through heavy compound lifts.",
  },
  {
    name: "RISE Lifting Straps", category: "Accessories", price: 2200, color: "Black", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-lifting-straps.jpeg",
    description: "Cotton-reinforced lifting straps with a padded wrist loop, built to hold grip through pulls, rows, and deadlifts.",
  },
  {
    name: "RISE Training Joggers", category: "Training", price: 8200, color: "Black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-mens-joggers.jpeg",
    description: "Tapered training joggers in a brushed technical knit with zip pockets and an internal drawcord for interval work and travel days.",
  },
  {
    name: "RISE Pullover Hoodie", category: "Hoodies", price: 10800, color: "Black", featured: true,
    sizes: APPAREL_SIZES, image: "/images/products/rise-mens-pullover-hoodie.jpeg",
    description: "The signature RISE pullover in heavyweight fleece with a structured hood, kangaroo pocket, and tonal R chest mark.",
  },
  {
    name: "RISE Training Tee", category: "Training", price: 4200, color: "Black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-mens-training-tee.jpeg",
    description: "A lightweight training tee in breathable jersey with a dropped hem and reflective back print for low-light sessions.",
  },
  {
    name: "RISE Resistance Bands Set", category: "Accessories", price: 3400, color: "Black / white", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-resistance-bands.jpeg",
    description: "A three-tension resistance band set with a woven carry pouch, built for warmups, mobility work, and travel training.",
  },
  {
    name: "RISE Shaker Bottle", category: "Accessories", price: 1800, color: "Black / white", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-shaker-bottle.jpeg",
    description: "A 700ml shaker bottle with a wire whisk ball and leakproof flip lid, marked with the RISE wordmark.",
  },
  {
    name: "RISE Training Gloves", category: "Accessories", price: 3600, color: "Black", featured: false,
    sizes: THREE_SIZES, image: "/images/products/rise-training-gloves.jpeg",
    description: "Textured grip gloves with a breathable mesh back and wrist strap, built for lifting sessions and mixed training.",
  },
  {
    name: "RISE Training Jacket", category: "Outerwear", price: 14800, compareAt: 17800, color: "Off black", featured: true,
    sizes: APPAREL_SIZES, image: "/images/products/rise-training-jacket.jpeg",
    description: "A water-resistant training jacket with taped seams, a packable hood, and vented side panels for interval work in any weather.",
  },
  {
    name: "RISE Training Socks", category: "Accessories", price: 1600, color: "Black", featured: false,
    sizes: THREE_SIZES, image: "/images/products/rise-training-socks.jpeg",
    description: "Cushioned crew socks in a compression knit with arch support, built to hold up through daily training blocks.",
  },
  {
    name: "RISE Water Bottle", category: "Accessories", price: 2800, color: "Matte black", featured: false,
    sizes: ONE_SIZE, image: "/images/products/rise-water-bottle.jpeg",
    description: "An insulated stainless steel bottle that holds temperature through a full session, finished with the tonal R mark.",
  },
  {
    name: "RISE Women's Leggings", category: "Training", price: 7800, color: "Black", featured: true,
    sizes: APPAREL_SIZES, image: "/images/products/rise-womens-leggings.jpeg",
    description: "High-rise leggings in compressive four-way stretch with a hidden waistband pocket, built for lifting through to studio work.",
  },
  {
    name: "RISE Women's Quarter-Zip", category: "Training", price: 9200, color: "Charcoal", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-womens-quarter-zip.jpeg",
    description: "A fitted quarter-zip pullover in brushed technical fleece, cut close for warmups and cool-weather training days.",
  },
  {
    name: "RISE Women's Racerback Tank", category: "Training", price: 3800, color: "Black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-womens-racerback-tank.jpeg",
    description: "A racerback training tank in lightweight jersey with a relaxed drape and full range of motion for lifting and cardio work.",
  },
  {
    name: "RISE Women's Sports Bra", category: "Training", price: 4600, color: "Black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-womens-sports-bra.jpeg",
    description: "A medium-support sports bra in compressive stretch fabric with a racerback cut, built for high-output training sessions.",
  },
  {
    name: "RISE Women's Training Shorts", category: "Training", price: 5200, color: "Black", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-womens-training-shorts.jpeg",
    description: "Lined training shorts with a compressive inner short and side pocket, cut for lifting, conditioning, and studio classes.",
  },
  {
    name: "RISE Women's Training Tee", category: "Training", price: 4000, color: "Off white", featured: false,
    sizes: APPAREL_SIZES, image: "/images/products/rise-womens-training-tee.jpeg",
    description: "A relaxed-fit training tee in soft-washed jersey with a dropped shoulder and tonal chest mark for daily rotation.",
  },
];

const reviewBank: [number, string, string, string][] = [
  [5, "Exactly what I needed", "Quality is solid and it fits true to size.", "Maya C."],
  [5, "In constant rotation", "Wears well through repeated training sessions.", "Jordan E."],
  [4, "Great everyday piece", "Comfortable and holds up in the wash.", "Sam R."],
  [5, "Worth it", "Fabric feels heavier than the price suggests.", "Priya N."],
];

const customers = [
  { name: "Maya Chen", email: "maya@example.com", tags: ["VIP", "Training"] },
  { name: "Jordan Ellis", email: "jordan@example.com", tags: ["Outerwear"] },
  { name: "Sam Rivera", email: "sam@example.com", tags: ["VIP", "Wholesale lead"] },
  { name: "Priya Nair", email: "priya@example.com", tags: ["Training"] },
  { name: "Alex Torres", email: "alex@example.com", tags: [] },
  { name: "Devon Kim", email: "devon@example.com", tags: ["Outerwear", "Frequent buyer"] },
];

const addressBook: Record<string, { line1: string; city: string; region: string; postal: string }> = {
  "maya@example.com": { line1: "184 Mercer St", city: "New York", region: "NY", postal: "10012" },
  "jordan@example.com": { line1: "922 Pine Ave", city: "Seattle", region: "WA", postal: "98101" },
  "sam@example.com": { line1: "44 Lake Shore Dr", city: "Chicago", region: "IL", postal: "60601" },
  "priya@example.com": { line1: "12 Harbor Way", city: "Austin", region: "TX", postal: "73301" },
  "alex@example.com": { line1: "310 Sunset Blvd", city: "Los Angeles", region: "CA", postal: "90028" },
  "devon@example.com": { line1: "77 Beacon St", city: "Boston", region: "MA", postal: "02108" },
};

async function main() {
  console.log("Resetting database...");
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.emailCampaign.deleteMany();
  await prisma.shippingZone.deleteMany();
  await prisma.taxRate.deleteMany();
  await prisma.storeSettings.deleteMany();
  await prisma.staffInvite.deleteMany();

  console.log("Creating staff accounts...");
  const demoPassword = hashPassword("password");
  const [owner, admin, staff] = await Promise.all([
    prisma.user.create({ data: { email: "owner@rise.test", name: "RISE Owner", role: Role.owner, passwordHash: demoPassword } }),
    prisma.user.create({ data: { email: "admin@rise.test", name: "RISE Admin", role: Role.admin, passwordHash: demoPassword } }),
    prisma.user.create({ data: { email: "staff@rise.test", name: "RISE Staff", role: Role.staff, passwordHash: demoPassword } }),
  ]);
  void staff;

  console.log("Creating customers...");
  const customerUsers = [];
  for (const customer of customers) {
    const user = await prisma.user.create({
      data: {
        email: customer.email,
        name: customer.name,
        role: Role.customer,
        tags: customer.tags,
        passwordHash: hashPassword("password"),
      },
    });
    const address = addressBook[customer.email];
    if (address) {
      await prisma.address.create({
        data: {
          userId: user.id,
          label: "Home",
          fullName: customer.name,
          line1: address.line1,
          city: address.city,
          region: address.region,
          postal: address.postal,
          country: "United States",
          isDefault: true,
        },
      });
    }
    customerUsers.push(user);
  }

  console.log("Creating products...");
  const createdProducts: Product[] = [];
  for (const [index, product] of products.entries()) {
    const slug = slugify(product.name);
    const review = index % 3 === 0 ? reviewBank[index % reviewBank.length] : null;
    const created = await prisma.product.create({
      data: {
        slug,
        name: product.name,
        description: product.description,
        category: product.category,
        collection: "RISE Originals",
        color: product.color,
        price: product.price,
        compareAt: product.compareAt ?? null,
        featured: product.featured,
        status: "active",
        images: {
          create: [{ url: product.image, alt: product.name, position: 0 }],
        },
        variants: {
          create: product.sizes.map((variant) => ({
            size: variant.size,
            stock: variant.stock,
            sku: `${slug.toUpperCase()}-${variant.size}`,
          })),
        },
        reviews: review
          ? { create: [{ rating: review[0], title: review[1], body: review[2], author: review[3] }] }
          : undefined,
      },
    });
    createdProducts.push(created);
  }

  const findProduct = (name: string) => createdProducts.find((p) => p.name === name)!;

  console.log("Creating orders...");
  const orderSeeds = [
    {
      customer: customerUsers[0],
      status: "fulfilled" as const,
      trackingNumber: "1Z84RSE1048",
      carrier: "UPS",
      daysAgo: 3,
      items: [
        { product: findProduct("RISE Pullover Hoodie"), size: "M", quantity: 1 },
        { product: findProduct("RISE Training Joggers"), size: "M", quantity: 1 },
      ],
    },
    {
      customer: customerUsers[1],
      status: "in_fulfillment" as const,
      trackingNumber: null,
      carrier: null,
      daysAgo: 2,
      items: [{ product: findProduct("RISE Training Jacket"), size: "M", quantity: 1 }],
    },
    {
      customer: customerUsers[2],
      status: "paid" as const,
      trackingNumber: "1Z84RSE1046",
      carrier: "USPS",
      daysAgo: 1,
      items: [
        { product: findProduct("RISE Compression Tee"), size: "M", quantity: 1 },
        { product: findProduct("RISE Shaker Bottle"), size: "OS", quantity: 1 },
        { product: findProduct("RISE Performance Cap"), size: "OS", quantity: 1 },
      ],
    },
    {
      customer: customerUsers[3],
      status: "fulfilled" as const,
      trackingNumber: "1Z84RSE1050",
      carrier: "UPS",
      daysAgo: 10,
      items: [{ product: findProduct("RISE Women's Quarter-Zip"), size: "M", quantity: 2 }],
    },
    {
      customer: customerUsers[4],
      status: "refunded" as const,
      trackingNumber: null,
      carrier: null,
      daysAgo: 15,
      items: [{ product: findProduct("RISE Women's Training Shorts"), size: "L", quantity: 1 }],
    },
    {
      customer: customerUsers[5],
      status: "fulfilled" as const,
      trackingNumber: "1Z84RSE1052",
      carrier: "FedEx",
      daysAgo: 20,
      items: [
        { product: findProduct("RISE Cropped Hoodie"), size: "L", quantity: 1 },
        { product: findProduct("RISE Training Gloves"), size: "M", quantity: 1 },
      ],
    },
    {
      customer: customerUsers[0],
      status: "pending" as const,
      trackingNumber: null,
      carrier: null,
      daysAgo: 2,
      items: [{ product: findProduct("RISE Women's Training Tee"), size: "S", quantity: 1 }],
    },
  ];

  let orderCounter = 1040;
  for (const seed of orderSeeds) {
    orderCounter += 1;
    const subtotal = seed.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 15000 ? 0 : 1200;
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shipping + tax;
    const address = addressBook[seed.customer.email];
    const createdAt = new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000);

    await prisma.order.create({
      data: {
        orderNumber: `RSE-${orderCounter}`,
        email: seed.customer.email,
        userId: seed.customer.id,
        status: seed.status,
        subtotal,
        shipping,
        tax,
        total,
        trackingNumber: seed.trackingNumber,
        carrier: seed.carrier,
        shippingName: seed.customer.name,
        shippingLine1: address?.line1 ?? "184 Mercer St",
        shippingCity: address?.city ?? "New York",
        shippingRegion: address?.region ?? "NY",
        shippingPostal: address?.postal ?? "10012",
        shippingCountry: "United States",
        createdAt,
        updatedAt: createdAt,
        items: {
          create: seed.items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
    });
  }

  console.log("Creating wishlist items...");
  await prisma.wishlistItem.createMany({
    data: [
      { userId: customerUsers[0].id, productId: findProduct("RISE Training Jacket").id },
      { userId: customerUsers[0].id, productId: findProduct("RISE Women's Training Shorts").id },
      { userId: customerUsers[1].id, productId: findProduct("RISE Pullover Hoodie").id },
      { userId: customerUsers[2].id, productId: findProduct("RISE Women's Quarter-Zip").id },
    ],
  });

  console.log("Creating discount codes...");
  await prisma.discountCode.createMany({
    data: [
      { code: "RISE15", description: "Launch promotional code for the More Than Yesterday campaign.", percentOff: 15 },
      { code: "WELCOME10", description: "New customer welcome offer.", percentOff: 10 },
      { code: "SUMMEREND", description: "End of season clearance.", percentOff: 20, active: false },
    ],
  });

  console.log("Creating banners...");
  await prisma.banner.createMany({
    data: [
      {
        title: "Essentials For The Relentless",
        subtitle: "Accessories / New drop",
        imageUrl: "/images/campaigns/essentials-drop.png",
        ctaLabel: "Shop essentials",
        ctaHref: "/shop?category=Accessories",
        active: true,
        position: 0,
      },
      {
        title: "Stronger Than Yesterday",
        subtitle: "Women's performance",
        imageUrl: "/images/campaigns/womens-performance.png",
        ctaLabel: "Explore collection",
        ctaHref: "/shop?category=Training",
        active: true,
        position: 1,
      },
      {
        title: "Push. Evolve. Rise.",
        subtitle: "Training essentials",
        imageUrl: "/images/campaigns/push-evolve-rise.png",
        ctaLabel: "Shop now",
        ctaHref: "/shop?category=Training",
        active: true,
        position: 2,
      },
      {
        title: "Discipline Builds Freedom",
        subtitle: "More than yesterday",
        imageUrl: "/images/campaigns/discipline-builds-freedom.png",
        ctaLabel: "Shop the drop",
        ctaHref: "/shop?category=Hoodies",
        active: true,
        position: 3,
      },
    ],
  });

  console.log("Creating email campaigns...");
  await prisma.emailCampaign.createMany({
    data: [
      { name: "Winter base layers", subject: "Layer up for the cold sessions", body: "Introducing the Field Unit collection for winter training.", status: "draft" },
      { name: "Welcome series", subject: "Welcome to RISE", body: "Thanks for joining. Here is 10% off your first order.", status: "sent", sentAt: new Date() },
    ],
  });

  console.log("Creating shipping zones and tax rates...");
  await prisma.shippingZone.createMany({
    data: [
      { name: "United States", countries: ["United States"], rate: 1200, freeOver: 15000 },
      { name: "Canada", countries: ["Canada"], rate: 1800, freeOver: 20000 },
      { name: "European Union", countries: ["Germany", "France", "Netherlands", "Spain"], rate: 2400, freeOver: 25000 },
    ],
  });
  await prisma.taxRate.createMany({
    data: [
      { region: "New York", rate: 8.875 },
      { region: "California", rate: 7.25 },
      { region: "Texas", rate: 6.25 },
    ],
  });

  console.log("Creating store settings...");
  await prisma.storeSettings.create({
    data: { id: "singleton", brandName: "RISE", supportEmail: "support@rise.test" },
  });

  void owner;
  void admin;
  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
