import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";

const VALID_CATEGORIES = [
  "try-trinity",
  "question",
  "partnership",
  "enterprise",
  "feedback",
] as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { category, name, email, company, message } = body;

  if (
    !category ||
    !VALID_CATEGORIES.includes(category) ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  await sendContactFormEmail({
    category,
    name: name.trim(),
    email: email.trim(),
    company: typeof company === "string" ? company.trim() : undefined,
    message: message.trim(),
  });

  return NextResponse.json({ ok: true });
}
