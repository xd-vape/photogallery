import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for S3 storage.`);
  }

  return value;
}

function client() {
  return new S3Client({
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || "auto",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
    credentials: {
      accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY"),
    },
  });
}

async function streamToBuffer(body) {
  if (!body) {
    return Buffer.alloc(0);
  }

  const chunks = [];

  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export const s3StorageAdapter = {
  async put(key, buffer) {
    await client().send(
      new PutObjectCommand({
        Bucket: requiredEnv("S3_BUCKET"),
        Key: key,
        Body: buffer,
      })
    );
  },

  async get(key) {
    const response = await client().send(
      new GetObjectCommand({
        Bucket: requiredEnv("S3_BUCKET"),
        Key: key,
      })
    );

    return streamToBuffer(response.Body);
  },

  async remove(key) {
    await client().send(
      new DeleteObjectCommand({
        Bucket: requiredEnv("S3_BUCKET"),
        Key: key,
      })
    );
  },
};
