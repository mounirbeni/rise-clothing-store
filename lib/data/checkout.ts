import { prisma } from "@/lib/prisma";
import { nextOrderNumber } from "@/lib/data/orders";

export type CheckoutItemInput = { productId: string; size: string; quantity: number };
export type ShippingInput = {
  name: string;
  line1: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};

const FLAT_SHIPPING = 1200;
const FREE_SHIPPING_OVER = 15000;
const TAX_RATE = 0.08;

export async function priceCart(items: CheckoutItemInput[], discountCode?: string | null) {
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
    include: { variants: true },
  });

  const lines = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const variant = product.variants.find((v) => v.size === item.size);
    if (!variant) throw new Error(`Size ${item.size} unavailable for ${product.name}`);
    if (variant.stock < item.quantity) throw new Error(`${product.name} (${item.size}) is out of stock`);
    return { product, variant, quantity: item.quantity };
  });

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  let discountAmount = 0;
  let appliedCode: string | null = null;
  if (discountCode) {
    const discount = await prisma.discountCode.findUnique({ where: { code: discountCode.toUpperCase() } });
    const now = new Date();
    if (discount && discount.active && discount.startsAt <= now && (!discount.endsAt || discount.endsAt >= now)) {
      discountAmount = Math.round((subtotal * discount.percentOff) / 100);
      appliedCode = discount.code;
    }
  }

  const shipping = subtotal - discountAmount >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
  const tax = Math.round((subtotal - discountAmount) * TAX_RATE);
  const total = subtotal - discountAmount + shipping + tax;

  return { lines, subtotal, discountAmount, appliedCode, shipping, tax, total };
}

export async function createOrder(params: {
  items: CheckoutItemInput[];
  email: string;
  userId?: string | null;
  shipping: ShippingInput;
  discountCode?: string | null;
  stripeSession?: string | null;
  status?: "pending" | "paid";
}) {
  const priced = await priceCart(params.items, params.discountCode);

  const order = await prisma.$transaction(async (tx) => {
    for (const line of priced.lines) {
      await tx.productVariant.update({
        where: { id: line.variant.id },
        data: { stock: { decrement: line.quantity } },
      });
    }
    if (priced.appliedCode) {
      await tx.discountCode.update({ where: { code: priced.appliedCode }, data: { timesUsed: { increment: 1 } } });
    }

    return tx.order.create({
      data: {
        orderNumber: await nextOrderNumber(),
        email: params.email,
        userId: params.userId ?? undefined,
        status: params.status ?? "paid",
        subtotal: priced.subtotal,
        shipping: priced.shipping,
        tax: priced.tax,
        discountAmount: priced.discountAmount,
        discountCode: priced.appliedCode,
        total: priced.total,
        stripeSession: params.stripeSession ?? undefined,
        shippingName: params.shipping.name,
        shippingLine1: params.shipping.line1,
        shippingCity: params.shipping.city,
        shippingRegion: params.shipping.region,
        shippingPostal: params.shipping.postal,
        shippingCountry: params.shipping.country,
        items: {
          create: priced.lines.map((line) => ({
            productId: line.product.id,
            name: line.product.name,
            size: line.variant.size,
            quantity: line.quantity,
            unitPrice: line.product.price,
          })),
        },
      },
      include: { items: true },
    });
  });

  return order;
}
