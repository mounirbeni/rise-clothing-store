import { NextResponse } from "next/server";
import { z } from "zod";
import { can, getSession } from "@/lib/auth";

const uploadSchema = z.object({
  filename: z.string().min(3),
  contentType: z.string().min(3),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !can(session.role, "write")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = uploadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload request", issues: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    uploadUrl: `/api/uploads/${encodeURIComponent(parsed.data.filename)}`,
    publicUrl: `/uploads/${encodeURIComponent(parsed.data.filename)}`,
    storage: "local-demo",
  });
}
