import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const previousSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000);

  const [current, previous, customerCount, orderCount, topProductRows, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: since }, status: { not: "cancelled" } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: previousSince, lt: since }, status: { not: "cancelled" } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.order.count(),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      _sum: { quantity: true, unitPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
  ]);

  const revenue = current._sum.total ?? 0;
  const previousRevenue = previous._sum.total ?? 0;
  const revenueDelta = previousRevenue ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0;

  const orders = current._count;
  const previousOrders = previous._count;
  const ordersDelta = previousOrders ? ((orders - previousOrders) / previousOrders) * 100 : 0;

  const paidOrders = await prisma.order.count({
    where: { createdAt: { gte: since }, status: { in: ["paid", "in_fulfillment", "fulfilled"] } },
  });
  const conversion = orderCount ? (paidOrders / Math.max(orderCount, 1)) * 100 : 0;

  return {
    revenue,
    revenueDelta,
    orders,
    ordersDelta,
    customerCount,
    orderCount,
    conversion,
    topProducts: topProductRows.map((row) => ({
      productId: row.productId,
      name: row.name,
      quantity: row._sum.quantity ?? 0,
      revenue: (row._sum.quantity ?? 0) * (row._sum.unitPrice ?? 0),
    })),
    recentOrders,
  };
}
