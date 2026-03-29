import { NextResponse } from "next/server";
import { createDeviceCode, cleanupExpiredCodes } from "@/lib/device-auth";

export async function POST() {
  try {
    // Fire-and-forget cleanup
    cleanupExpiredCodes().catch(() => {});

    const { code } = await createDeviceCode();
    return NextResponse.json({ code, expiresIn: 600 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create device code" },
      { status: 500 },
    );
  }
}
