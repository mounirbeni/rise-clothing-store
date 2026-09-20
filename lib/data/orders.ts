import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const orderInclude = {
  items: true,
  user: true,
};

export type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export async function listOrders(filters: { status?: string | null; q?: string | null } = {}) {
  const where: Prisma.OrderWhereInput = {};
  if (filters.status && filters.status !== "All") {
    where.status = filters.status as Prisma.OrderWhereInput["status"];
  }
  if (filters.q) {
    where.OR = [
      { orderNumber: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, include: orderInclude });
}

export async function nextOrderNumber() {
  const count = await prisma.order.count();
  return `RSE-${1040 + count + 1}`;
}

export async function abandonedCartInsights() {
  const stale = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const [abandoned, pendingCount] = await Promise.all([
    prisma.order.findMany({
      where: { status: "pending", createdAt: { lt: stale } },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.order.count({ where: { status: "pending" } }),
  ]);

  return { abandoned, pendingCount };
}
