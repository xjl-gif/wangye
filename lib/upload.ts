import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export function isAllowedImageType(mime: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(mime);
}

function extFromName(originalName: string): string {
  const ext = path.extname(originalName).slice(0, 20) || ".bin";
  return ext.match(/^\.[a-zA-Z0-9]+$/) ? ext : ".bin";
}

/** 返回可公开访问的完整 URL（Vercel Blob）或本站路径（本地 public/uploads） */
export async function saveUploadedImage(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  const filename = `${randomUUID()}${extFromName(originalName)}`;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const blob = await put(filename, buffer, {
      access: "public",
      token,
    });
    return blob.url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const fsPath = path.join(UPLOAD_DIR, filename);
  await writeFile(fsPath, buffer);
  return `/uploads/${filename}`;
}
