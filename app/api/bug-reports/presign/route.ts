import { NextRequest, NextResponse } from "next/server";
import {
  requireAccessToken,
  AccessTokenError,
} from "@/lib/device-auth/require-access-token";
import { presignUpload } from "@/lib/r2";

/** POST — Get a presigned URL for uploading a bug report attachment. */
export async function POST(req: NextRequest) {
  let token;
  try {
    token = await requireAccessToken(req);
  } catch (err) {
    if (err instanceof AccessTokenError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    throw err;
  }

  const body = await req.json();
  const { fileName, contentType } = body as {
    fileName: string;
    contentType: string;
  };

  if (!fileName || !contentType) {
    return NextResponse.json(
      { error: "fileName and contentType are required" },
      { status: 400 },
    );
  }

  const attachmentId = crypto.randomUUID();
  const userId = token.sub ?? "";
  const key = `bug-reports/${userId}/${attachmentId}-${fileName}`;
  const url = await presignUpload(key, contentType);

  return NextResponse.json({ url, key, attachmentId });
}
