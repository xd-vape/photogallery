import { localStorageAdapter } from "@/lib/storage/local";
import { s3StorageAdapter } from "@/lib/storage/s3";
import { getServerEnv } from "../config/server-env";

export function getStorage() {
  const environment = getServerEnv();

  switch (environment.STORAGE_DRIVER) {
    case "local":
      return localStorageAdapter;

    case "s3":
      return s3StorageAdapter;

    default:
      throw new Error(
        `Unsupported storage driver: ${environment.STORAGE_DRIVER}`,
      );
  }
}
