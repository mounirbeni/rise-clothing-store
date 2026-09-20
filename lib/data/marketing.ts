import { prisma } from "@/lib/prisma";

export async function listDiscountCodes() {
  return prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listBanners() {
  return prisma.banner.findMany({ orderBy: { position: "asc" } });
}

export async function listActiveBanners() {
  return prisma.banner.findMany({ where: { active: true }, orderBy: { position: "asc" } });
}

export async function listCampaigns() {
  return prisma.emailCampaign.findMany({ orderBy: { createdAt: "desc" } });
}
