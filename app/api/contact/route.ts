import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  orderNumber: z.string().max(40).optional(),
  message: z.string().min(5).max(2000),
});

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message", issues: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ status: "received" }, { status: 201 });
}
