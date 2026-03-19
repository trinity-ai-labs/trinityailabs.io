import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";
import { headers } from "next/headers";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = await createCheckoutUrl(session.user.email, session.user.id);
  return NextResponse.json({ url });
}
