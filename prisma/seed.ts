import { PrismaClient, Role, type Product } from "@prisma/client";
import { hashPassword } from "../lib/auth";
import { slugify } from "../lib/format";

const prisma = new PrismaClient();

const IMAGES = {
  hero: "/images/hero.jpeg",
  campaign: "/images/campaign.jpeg",
  hoodie: "/images/product-hoodie.jpeg",
  training: "/images/training.jpeg",
  packaging: "/images/packaging.jpeg",
};

const products = [
  {
    name: "Discipline Hoodie",
    category: "Hoodies",
    collection: "More Than Yesterday",
    price: 11800,
    compareAt: null as number | null,
    color: "Washed black",
    featured: true,
    sizes: [
      { size: "XS", stock: 18 },
      { size: "S", stock: 26 },
      { size: "M", stock: 30 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 12 },
    ],
    images: [IMAGES.hoodie, IMAGES.campaign],
    description:
      "A heavyweight training hoodie with a compact fleece handfeel, dropped shoulder, and structured hood for pre-session focus and cold commutes.",
    reviews: [
      { rating: 5, title: "Earned a place in rotation", body: "Dense fabric, sharp fit, and reliable after repeated sessions.", author: "Maya C." },
      { rating: 5, title: "Heavy and warm", body: "Exactly the weight I wanted for fall training mornings.", author: "Jordan E." },
      { rating: 4, title: "Runs slightly boxy", body: "Great quality, sized down and it fit perfectly.", author: "Sam R." },
    ],
  },
  {
    name: "Motion Training Shell",
    category: "Training",
    collection: "Training System",
    price: 14200,
    compareAt: null,
    color: "Graphite",
    featured: true,
    sizes: [
      { size: "S", stock: 14 },
      { size: "M", stock: 22 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 9 },
    ],
    images: [IMAGES.training, IMAGES.hero],
    description:
      "A matte performance shell cut for interval work, warmups, and all-weather sessions with vented panels and quiet stretch.",
    reviews: [
      { rating: 5, title: "Great for intervals", body: "Breathes well and the stretch panels move with you.", author: "Priya N." },
      { rating: 4, title: "Solid shell", body: "Blocks wind nicely, wish it came in more colors.", author: "Alex T." },
    ],
  },
  {
    name: "Summit Layer",
    category: "Outerwear",
    collection: "Field Unit",
    price: 16800,
    compareAt: 19800,
    color: "Off black",
    featured: true,
    sizes: [
      { size: "XS", stock: 8 },
      { size: "S", stock: 14 },
      { size: "M", stock: 16 },
      { size: "L", stock: 10 },
    ],
    images: [IMAGES.campaign, IMAGES.training],
    description:
      "Thermal outerwear with a clean front, bonded seams, and compact insulation for travel, recovery, and low-light miles.",
    reviews: [
      { rating: 5, title: "Perfect travel jacket", body: "Packs down small and kept me warm through a cold layover.", author: "Devon K." },
    ],
  },
  {
    name: "RISE Recovery Kit",
    category: "Accessories",
    collection: "Recovery",
    price: 6400,
    compareAt: null,
    color: "Black / white",
    featured: false,
    sizes: [{ size: "OS", stock: 60 }],
    images: [IMAGES.packaging, IMAGES.hoodie],
    description:
      "A compact recovery kit with towel, bands, and grip accessories designed for training bags and hotel-room mobility sessions.",
    reviews: [
      { rating: 4, title: "Handy for travel", body: "Good bands, towel is a bit small but overall useful.", author: "Maya C." },
    ],
  },
  {
    name: "Apex Training Tight",
    category: "Training",
    collection: "Training System",
    price: 9600,
    compareAt: null,
    color: "Deep black",
    featured: false,
    sizes: [
      { size: "XS", stock: 20 },
      { size: "S", stock: 24 },
      { size: "M", stock: 26 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 10 },
    ],
    images: [IMAGES.hero, IMAGES.training],
    description:
      "High-compression training tight with a locked-in waistband, abrasion-resistant panels, and reflective RISE marks.",
    reviews: [
      { rating: 5, title: "Locked in fit", body: "No slipping during sprints, waistband stays put.", author: "Jordan E." },
      { rating: 5, title: "Great compression", body: "Comfortable for long training blocks.", author: "Sam R." },
    ],
  },
  {
    name: "Blackout Run Cap",
    category: "Accessories",
    collection: "Recovery",
    price: 4800,
    compareAt: null,
    color: "Matte black",
    featured: false,
    sizes: [{ size: "OS", stock: 45 }],
    images: [IMAGES.packaging, IMAGES.campaign],
    description:
      "A low-profile cap with fast-dry panels, tonal embroidery, and a short brim for training in sun, rain, or city light.",
    reviews: [{ rating: 4, title: "Good everyday cap", body: "Dries quickly after rain runs.", author: "Alex T." }],
  },
  {
    name: "Ascend Half-Zip",
    category: "Training",
    collection: "Training System",
    price: 10800,
    compareAt: null,
    color: "Charcoal",
    featured: false,
    sizes: [
      { size: "S", stock: 16 },
      { size: "M", stock: 20 },
      { size: "L", stock: 14 },
      { size: "XL", stock: 8 },
    ],
    images: [IMAGES.training, IMAGES.hoodie],
    description: "A midweight half-zip with brushed interior fleece for warmups and cooldowns between sets.",
    reviews: [{ rating: 5, title: "Lives in my gym bag", body: "Perfect warmup layer, breathable zip panel.", author: "Priya N." }],
  },
  {
    name: "Overcast Windbreaker",
    category: "Outerwear",
    collection: "Field Unit",
    price: 13200,
    compareAt: null,
    color: "Storm grey",
    featured: false,
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 14 },
    ],
    images: [IMAGES.campaign, IMAGES.hero],
    description: "Packable windbreaker with taped seams built for unpredictable weather on long runs.",
    reviews: [{ rating: 4, title: "Great packable shell", body: "Fits in a small pocket, blocks wind well.", author: "Devon K." }],
  },
  {
    name: "Foundation Crewneck",
    category: "Hoodies",
    collection: "More Than Yesterday",
    price: 8800,
    compareAt: null,
    color: "Off white",
    featured: false,
    sizes: [
      { size: "XS", stock: 14 },
      { size: "S", stock: 20 },
      { size: "M", stock: 24 },
      { size: "L", stock: 16 },
      { size: "XL", stock: 8 },
    ],
    images: [IMAGES.hoodie, IMAGES.hero],
    description: "A midweight crewneck with a clean chest mark, built for daily wear before and after training.",
    reviews: [{ rating: 5, title: "Simple and heavy", body: "Exactly the weight and fit I look for in a crew.", author: "Maya C." }],
  },
  {
    name: "Grip Training Gloves",
    category: "Accessories",
    collection: "Training System",
    price: 3800,
    compareAt: null,
    color: "Black",
    featured: false,
    sizes: [
      { size: "S", stock: 20 },
      { size: "M", stock: 26 },
      { size: "L", stock: 18 },
    ],
    images: [IMAGES.packaging, IMAGES.training],
    description: "Textured grip gloves with breathable mesh backing for lifting and mixed training sessions.",
    reviews: [],
  },
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
  for (const product of products) {
    const slug = slugify(product.name);
    const created = await prisma.product.create({
      data: {
        slug,
        name: product.name,
        description: product.description,
        category: product.category,
        collection: product.collection,
        color: product.color,
        price: product.price,
        compareAt: product.compareAt,
        featured: product.featured,
        status: "active",
        images: {
          create: product.images.map((url, position) => ({ url, alt: product.name, position })),
        },
        variants: {
          create: product.sizes.map((variant) => ({
            size: variant.size,
            stock: variant.stock,
            sku: `${slug.toUpperCase()}-${variant.size}`,
          })),
        },
        reviews: {
          create: product.reviews.map((review) => ({
            rating: review.rating,
            title: review.title,
            body: review.body,
            author: review.author,
          })),
        },
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
        { product: findProduct("Discipline Hoodie"), size: "M", quantity: 1 },
        { product: findProduct("Motion Training Shell"), size: "M", quantity: 1 },
      ],
    },
    {
      customer: customerUsers[1],
      status: "in_fulfillment" as const,
      trackingNumber: null,
      carrier: null,
      daysAgo: 2,
      items: [{ product: findProduct("Summit Layer"), size: "M", quantity: 1 }],
    },
    {
      customer: customerUsers[2],
      status: "paid" as const,
      trackingNumber: "1Z84RSE1046",
      carrier: "USPS",
      daysAgo: 1,
      items: [
        { product: findProduct("Apex Training Tight"), size: "M", quantity: 1 },
        { product: findProduct("RISE Recovery Kit"), size: "OS", quantity: 1 },
        { product: findProduct("Blackout Run Cap"), size: "OS", quantity: 1 },
      ],
    },
    {
      customer: customerUsers[3],
      status: "fulfilled" as const,
      trackingNumber: "1Z84RSE1050",
      carrier: "UPS",
      daysAgo: 10,
      items: [{ product: findProduct("Ascend Half-Zip"), size: "M", quantity: 2 }],
    },
    {
      customer: customerUsers[4],
      status: "refunded" as const,
      trackingNumber: null,
      carrier: null,
      daysAgo: 15,
      items: [{ product: findProduct("Overcast Windbreaker"), size: "L", quantity: 1 }],
    },
    {
      customer: customerUsers[5],
      status: "fulfilled" as const,
      trackingNumber: "1Z84RSE1052",
      carrier: "FedEx",
      daysAgo: 20,
      items: [
        { product: findProduct("Foundation Crewneck"), size: "L", quantity: 1 },
        { product: findProduct("Grip Training Gloves"), size: "M", quantity: 1 },
      ],
    },
    {
      customer: customerUsers[0],
      status: "pending" as const,
      trackingNumber: null,
      carrier: null,
      daysAgo: 2,
      items: [{ product: findProduct("Foundation Crewneck"), size: "S", quantity: 1 }],
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
      { userId: customerUsers[0].id, productId: findProduct("Summit Layer").id },
      { userId: customerUsers[0].id, productId: findProduct("Overcast Windbreaker").id },
      { userId: customerUsers[1].id, productId: findProduct("Discipline Hoodie").id },
      { userId: customerUsers[2].id, productId: findProduct("Ascend Half-Zip").id },
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
      { title: "More Than Yesterday", subtitle: "Fall training collection now live", imageUrl: IMAGES.hero, ctaLabel: "Shop drop", ctaHref: "/shop", active: true, position: 0 },
      { title: "Free shipping over $150", subtitle: "Applies automatically at checkout", active: true, position: 1 },
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
