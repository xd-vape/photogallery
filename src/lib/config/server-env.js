import "server-only";

import { z } from "zod";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const DEVELOPMENT_DEFAULTS = {
  DATABASE_URL:
    "postgresql://postgres:postgres@localhost:5432/photogallery?schema=public",

  BETTER_AUTH_SECRET: "development-only-change-this-photogallery-secret",

  BETTER_AUTH_URL: "http://localhost:3000",

  GALLERY_ACCESS_SECRET: "development-only-gallery-access-secret-change-this",

  STORAGE_DRIVER: "local",

  LOCAL_STORAGE_DIR: "./storage",
};

const UNSAFE_SECRET_PATTERN =
  /development-only|change-this|replace-with|example-secret/i;

let cachedEnvironment = null;

function configuredValue(name) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed || undefined;
}

function environmentValue(name, developmentFallback) {
  const configured = configuredValue(name);

  if (configured !== undefined) {
    return configured;
  }

  if (!IS_PRODUCTION) {
    return developmentFallback;
  }

  return undefined;
}

function optionalEnvironmentValue(name) {
  return configuredValue(name);
}

function isPostgresUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "postgresql:" || url.protocol === "postgres:";
  } catch {
    return false;
  }
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function addRequiredIssue(context, path, message) {
  context.addIssue({
    code: "custom",
    path: [path],
    message,
  });
}

const serverEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),

    DATABASE_URL: z
      .string()
      .min(1, "DATABASE_URL is required.")
      .refine(isPostgresUrl, "DATABASE_URL must be a PostgreSQL URL."),

    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must contain at least 32 characters."),

    BETTER_AUTH_URL: z
      .string()
      .min(1, "BETTER_AUTH_URL is required.")
      .refine(
        isHttpUrl,
        "BETTER_AUTH_URL must be an absolute HTTP or HTTPS URL.",
      ),

    GALLERY_ACCESS_SECRET: z
      .string()
      .min(32, "GALLERY_ACCESS_SECRET must contain at least 32 characters."),

    STORAGE_DRIVER: z.enum(["local", "s3"]),

    LOCAL_STORAGE_DIR: z.string().min(1).optional(),

    S3_ENDPOINT: z.string().optional(),

    S3_REGION: z.string().min(1).optional(),

    S3_BUCKET: z.string().min(1).optional(),

    S3_ACCESS_KEY_ID: z.string().min(1).optional(),

    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),

    S3_FORCE_PATH_STYLE: z.enum(["true", "false"]).optional(),
  })
  .superRefine((environment, context) => {
    if (IS_PRODUCTION) {
      if (UNSAFE_SECRET_PATTERN.test(environment.BETTER_AUTH_SECRET)) {
        addRequiredIssue(
          context,
          "BETTER_AUTH_SECRET",
          "BETTER_AUTH_SECRET still contains an unsafe placeholder.",
        );
      }

      if (UNSAFE_SECRET_PATTERN.test(environment.GALLERY_ACCESS_SECRET)) {
        addRequiredIssue(
          context,
          "GALLERY_ACCESS_SECRET",
          "GALLERY_ACCESS_SECRET still contains an unsafe placeholder.",
        );
      }
    }

    if (
      environment.STORAGE_DRIVER === "local" &&
      !environment.LOCAL_STORAGE_DIR
    ) {
      addRequiredIssue(
        context,
        "LOCAL_STORAGE_DIR",
        "LOCAL_STORAGE_DIR is required for local storage.",
      );
    }

    if (environment.STORAGE_DRIVER === "s3") {
      const requiredS3Variables = [
        "S3_REGION",
        "S3_BUCKET",
        "S3_ACCESS_KEY_ID",
        "S3_SECRET_ACCESS_KEY",
      ];

      for (const variable of requiredS3Variables) {
        if (!environment[variable]) {
          addRequiredIssue(
            context,
            variable,
            `${variable} is required for S3 storage.`,
          );
        }
      }
    }
  });

function rawServerEnvironment() {
  return {
    NODE_ENV: process.env.NODE_ENV || "development",

    DATABASE_URL: environmentValue(
      "DATABASE_URL",
      DEVELOPMENT_DEFAULTS.DATABASE_URL,
    ),

    BETTER_AUTH_SECRET: environmentValue(
      "BETTER_AUTH_SECRET",
      DEVELOPMENT_DEFAULTS.BETTER_AUTH_SECRET,
    ),

    BETTER_AUTH_URL: environmentValue(
      "BETTER_AUTH_URL",
      DEVELOPMENT_DEFAULTS.BETTER_AUTH_URL,
    ),

    GALLERY_ACCESS_SECRET: environmentValue(
      "GALLERY_ACCESS_SECRET",
      DEVELOPMENT_DEFAULTS.GALLERY_ACCESS_SECRET,
    ),

    STORAGE_DRIVER: environmentValue(
      "STORAGE_DRIVER",
      DEVELOPMENT_DEFAULTS.STORAGE_DRIVER,
    ),

    LOCAL_STORAGE_DIR: environmentValue(
      "LOCAL_STORAGE_DIR",
      DEVELOPMENT_DEFAULTS.LOCAL_STORAGE_DIR,
    ),

    S3_ENDPOINT: optionalEnvironmentValue("S3_ENDPOINT"),

    S3_REGION: optionalEnvironmentValue("S3_REGION"),

    S3_BUCKET: optionalEnvironmentValue("S3_BUCKET"),

    S3_ACCESS_KEY_ID: optionalEnvironmentValue("S3_ACCESS_KEY_ID"),

    S3_SECRET_ACCESS_KEY: optionalEnvironmentValue("S3_SECRET_ACCESS_KEY"),

    S3_FORCE_PATH_STYLE: optionalEnvironmentValue("S3_FORCE_PATH_STYLE"),
  };
}

function formatEnvironmentError(error) {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".") || "environment";

      return `- ${path}: ${issue.message}`;
    })
    .join("\n");
}

export function getServerEnv() {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const result = serverEnvironmentSchema.safeParse(rawServerEnvironment());

  if (!result.success) {
    throw new Error(
      [
        "Invalid server environment configuration:",
        formatEnvironmentError(result.error),
      ].join("\n"),
    );
  }

  cachedEnvironment = Object.freeze(result.data);

  return cachedEnvironment;
}

export function assertServerEnv() {
  getServerEnv();
}
