import { NextResponse } from "next/server";
import { z } from "zod";
import { products } from "@/lib/rise-data";
import { can, getSession } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["Hoodies", "Training", "Outerwear", "Accessories"]),
  price: z.number().positive(),
  color: z.string().min(2),
  stock: z.number().int().nonnegative(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = (url.searchParams.get("q") || "").toLowerCase();

  return NextResponse.json({
    data: products.filter((product) => {
      const categoryMatch = !category || product.category === category;
      const searchMatch = !search || `${product.name} ${product.color} ${product.category}`.toLowerCase().includes(search);
      return categoryMatch && searchMatch;
    }),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product", issues: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ data: parsed.data, status: "created" }, { status: 201 });
}
