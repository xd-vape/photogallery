import { localStorageAdapter } from "@/lib/storage/local";
import { s3StorageAdapter } from "@/lib/storage/s3";

export function getStorage() {
  if (process.env.STORAGE_DRIVER === "s3") {
    return s3StorageAdapter;
  }

  return localStorageAdapter;
}
