import { PrismaClient, Role } from "@prisma/client";
import { customers, orders, products } from "../lib/rise-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.discountCode.deleteMany();

  const owner = await prisma.user.create({
    data: {
      email: "owner@rise.test",
      name: "RISE Owner",
      role: Role.owner,
      passwordHash: "demo-password-hash",
    },
  });

  await prisma.user.createMany({
    data: customers.map((customer) => ({
      email: customer.email,
      name: customer.name,
      role: Role.customer,
      tags: customer.tags,
      notes: `${customer.orders} orders, ${customer.lifetimeValue} lifetime value`,
    })),
    skipDuplicates: true,
  });

  for (const product of products) {
    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        category: product.category,
        collection: product.collection,
        color: product.color,
        price: product.price * 100,
        compareAt: product.compareAt ? product.compareAt * 100 : null,
        status: product.status,
        images: {
          create: product.images.map((url, position) => ({
            url,
            alt: product.name,
            position,
          })),
        },
        variants: {
          create: product.sizes.map((size, index) => ({
            size,
            sku: `${product.id.toUpperCase()}-${size}`,
            stock: Math.max(4, Math.floor(product.stock / product.sizes.length) - index),
          })),
        },
        reviews: {
          create: {
            rating: Math.round(product.rating),
            title: "Earned a place in rotation",
            body: "Dense fabric, sharp fit, and reliable after repeated sessions.",
            author: "Verified RISE customer",
          },
        },
      },
    });
  }

  const hoodie = await prisma.product.findFirstOrThrow({ where: { slug: "discipline-hoodie" } });
  const shell = await prisma.product.findFirstOrThrow({ where: { slug: "motion-training-shell" } });

  await prisma.order.create({
    data: {
      orderNumber: orders[0].id,
      email: "maya@example.com",
      userId: owner.id,
      status: "fulfilled",
      subtotal: 26000,
      shipping: 0,
      tax: 2110,
      total: 28110,
      trackingNumber: orders[0].tracking,
      items: {
        create: [
          { productId: hoodie.id, name: hoodie.name, size: "M", quantity: 1, unitPrice: hoodie.price },
          { productId: shell.id, name: shell.name, size: "M", quantity: 1, unitPrice: shell.price },
        ],
      },
    },
  });

  await prisma.discountCode.create({
    data: {
      code: "RISE15",
      description: "Launch promotional code for the More Than Yesterday campaign.",
      percentOff: 15,
    },
  });
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
