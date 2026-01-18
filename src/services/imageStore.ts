import { getDB } from "./db";

export async function saveImage(key: string, file: Blob) {
  const db = await getDB();
  const tx = db.transaction("images", "readwrite");
  tx.objectStore("images").put(file, key);
}

export async function loadImage(key: string): Promise<Blob | null> {
  const db = await getDB();
  const tx = db.transaction("images", "readonly");

  return new Promise((resolve, reject) => {
    const req = tx.objectStore("images").get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}
