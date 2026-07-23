import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getServerEnv } from "../config/server-env";

function client() {
  const environment = getServerEnv();

  return new S3Client({
    endpoint: environment.S3_ENDPOINT || undefined,

    region: environment.S3_REGION,

    forcePathStyle: environment.S3_FORCE_PATH_STYLE !== "false",

    credentials: {
      accessKeyId: environment.S3_ACCESS_KEY_ID,

      secretAccessKey: environment.S3_SECRET_ACCESS_KEY,
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
    const environment = getServerEnv();

    await client().send(
      new PutObjectCommand({
        Bucket: environment.S3_BUCKET,
        Key: key,
        Body: buffer,
      }),
    );
  },

  async get(key) {
    const environment = getServerEnv();

    const response = await client().send(
      new GetObjectCommand({
        Bucket: environment.S3_BUCKET,
        Key: key,
      }),
    );

    return streamToBuffer(response.Body);
  },

  async remove(key) {
    const environment = getServerEnv();

    await client().send(
      new DeleteObjectCommand({
        Bucket: environment.S3_BUCKET,
        Key: key,
      }),
    );
  },
};
