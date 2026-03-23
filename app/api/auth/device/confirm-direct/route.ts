import { NextResponse } from "next/server";
import { approveDeviceCode } from "@/lib/device-auth";

// POST /api/auth/device/confirm-direct
// Called from the /desktop page with userId from the client-side session.
// The userId comes from Better Auth's useSession() which validates the session
// client-side — this avoids cookie issues with server-side session checks.
export async function POST(request: Request) {
  const body = await request.json();
  const { code, userId } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const approved = await approveDeviceCode(code, userId);

  if (!approved) {
    return NextResponse.json(
      { error: "Code is invalid, expired, or already used" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
