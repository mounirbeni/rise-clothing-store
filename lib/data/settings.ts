import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const existing = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return existing;
  return prisma.storeSettings.create({ data: { id: "singleton" } });
}

export async function listShippingZones() {
  return prisma.shippingZone.findMany({ orderBy: { createdAt: "asc" } });
}

export async function listTaxRates() {
  return prisma.taxRate.findMany({ orderBy: { createdAt: "asc" } });
}
