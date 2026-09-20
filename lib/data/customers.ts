import { prisma } from "@/lib/prisma";

export async function listCustomers(q?: string | null) {
  return prisma.user.findMany({
    where: {
      role: "customer",
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: {
      orders: { include: { items: true } },
      addresses: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      addresses: true,
      wishlist: { include: { product: true } },
    },
  });
}

export function lifetimeValue(orders: { total: number; status: string }[]) {
  return orders
    .filter((order) => order.status !== "cancelled" && order.status !== "refunded")
    .reduce((sum, order) => sum + order.total, 0);
}

export async function listStaff() {
  return prisma.user.findMany({
    where: { role: { in: ["owner", "admin", "staff"] } },
    orderBy: { createdAt: "asc" },
  });
}
