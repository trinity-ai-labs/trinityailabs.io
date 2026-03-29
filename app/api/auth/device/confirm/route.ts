import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { approveDeviceCode } from "@/lib/device-auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { code } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const approved = await approveDeviceCode(code, session.user.id);

  if (!approved) {
    return NextResponse.json(
      { error: "Code is invalid, expired, or already used" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
