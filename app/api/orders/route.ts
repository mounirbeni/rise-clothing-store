import { NextResponse } from "next/server";
import { can, getSession } from "@/lib/auth";
import { listOrders } from "@/lib/data/orders";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const data = await listOrders({ status: url.searchParams.get("status"), q: url.searchParams.get("q") });
  return NextResponse.json({ data });
}
