import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

const BUCKET = process.env.R2_BUCKET_NAME ?? "trinity-assets";
const PRESIGN_EXPIRY = 900; // 15 minutes

export async function presignUpload(
  key: string,
  contentType: string,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getClient(), command, { expiresIn: PRESIGN_EXPIRY });
}

export async function presignDownload(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(getClient(), command, { expiresIn: PRESIGN_EXPIRY });
}

export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await getClient().send(command);
}

export async function copyObject(
  sourceKey: string,
  destKey: string,
): Promise<void> {
  const command = new CopyObjectCommand({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${sourceKey}`,
    Key: destKey,
  });
  await getClient().send(command);
}

export function buildStorageKey(
  scope: "personal" | "team",
  scopeId: string,
  projectId: string,
  fileName: string,
): string {
  return `${scope}/${scopeId}/${projectId}/${fileName}`;
}
