import fs from "node:fs/promises";
import path from "node:path";

function storageRoot() {
  const configuredPath = process.env.LOCAL_STORAGE_DIR || "storage";

  if (path.isAbsolute(configuredPath)) {
    return configuredPath;
  }

  return path.join(/*turbopackIgnore: true*/ process.cwd(), configuredPath);
}

function resolveKey(key) {
  const root = storageRoot();
  const target = path.resolve(root, key);

  if (!target.startsWith(root)) {
    throw new Error("Invalid storage key");
  }

  return target;
}

export const localStorageAdapter = {
  async put(key, buffer) {
    const target = resolveKey(key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, buffer);
  },

  async get(key) {
    return fs.readFile(resolveKey(key));
  },

  async remove(key) {
    await fs.rm(resolveKey(key), { force: true });
  },
};
