import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";

let r2Client: S3Client | null = null;

function getR2Client(config: {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return r2Client;
}

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
  }
): Promise<string> {
  const client = getR2Client(config);

  // Sanitize filename - remove special chars, keep extension
  const sanitizedOriginalName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const extension = sanitizedOriginalName.split(".").pop() || "";
  const baseName = sanitizedOriginalName.replace(/\.[^.]+$/, "");
  const uniqueKey = `events/${nanoid(10)}-${baseName}${extension ? "." + extension : ""}`;

  const upload = new Upload({
    client,
    params: {
      Bucket: config.bucketName,
      Key: uniqueKey,
      Body: fileBuffer,
      ContentType: contentType,
    },
  });

  await upload.done();

  const publicUrl = `${config.publicUrl}/${uniqueKey}`;
  return publicUrl;
}