import crypto from "node:crypto";

const KEY_LENGTH = 64;

function scrypt(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashGalleryPassword(password) {
  if (!password) {
    return null;
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt);
  return `scrypt:${salt}:${hash.toString("hex")}`;
}

export async function verifyGalleryPassword(password, storedHash) {
  if (!password || !storedHash) {
    return false;
  }

  const [method, salt, expectedHex] = storedHash.split(":");

  if (method !== "scrypt" || !salt || !expectedHex) {
    return false;
  }

  const actual = await scrypt(password, salt);
  const expected = Buffer.from(expectedHex, "hex");

  return (
    actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
  );
}
