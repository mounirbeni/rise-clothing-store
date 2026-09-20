import { NextResponse } from "next/server";
import { can, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function toCsv(rows: Record<string, string | number>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))].join("\n");
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = Number(url.searchParams.get("days") ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const rows = orders.map((order) => ({
    orderNumber: order.orderNumber,
    email: order.email,
    status: order.status,
    items: order.items.length,
    subtotal: (order.subtotal / 100).toFixed(2),
    shipping: (order.shipping / 100).toFixed(2),
    tax: (order.tax / 100).toFixed(2),
    total: (order.total / 100).toFixed(2),
    createdAt: order.createdAt.toISOString(),
  }));

  const csv = toCsv(rows);

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv",
      "content-disposition": `attachment; filename="rise-orders-${days}d.csv"`,
    },
  });
}
