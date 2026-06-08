import { nanoid } from "nanoid";

export async function uploadToR2Storage(
  fileBuffer: Uint8Array,
  fileName: string,
  contentType: string,
  bucket: any,
  publicUrl: string
): Promise<string> {
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = sanitized.split(".").pop() || "";
  const base = sanitized.replace(/\.[^.]+$/, "");
  const key = `events/${nanoid(10)}-${base}${ext ? "." + ext : ""}`;

  await bucket.put(key, fileBuffer, {
    httpMetadata: { contentType },
  });

  return `${publicUrl}/${key}`;
}
