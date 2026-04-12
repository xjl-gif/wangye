import { stringifyGallery } from "@/lib/gallery";
import { prisma } from "@/lib/prisma";
import {
  isAllowedImageType,
  saveUploadedImage,
  UPLOAD_MAX_BYTES,
} from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const honeypot = form.get("website");
    if (typeof honeypot === "string" && honeypot.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const title = String(form.get("title") ?? "").trim();
    const summary = String(form.get("summary") ?? "").trim();
    const category = String(form.get("category") ?? "").trim() || null;
    const region = String(form.get("region") ?? "").trim() || null;
    const submitterName = String(form.get("submitterName") ?? "").trim() || null;
    const submitterContact = String(form.get("submitterContact") ?? "").trim() || null;

    if (!title || !summary) {
      return NextResponse.json({ error: "请填写标题与简介" }, { status: 400 });
    }

    const rawFiles = form.getAll("images");
    const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0);

    const urls: string[] = [];
    for (const file of files) {
      if (file.size > UPLOAD_MAX_BYTES) {
        return NextResponse.json({ error: "单张图片不超过 5MB" }, { status: 400 });
      }
      if (!isAllowedImageType(file.type)) {
        return NextResponse.json({ error: "仅支持 JPEG、PNG、WebP、GIF" }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      urls.push(await saveUploadedImage(buf, file.name));
    }

    const coverImageUrl = urls[0] ?? null;
    const galleryImages =
      urls.length > 1 ? stringifyGallery(urls.slice(1)) : stringifyGallery([]);

    await prisma.heritageItem.create({
      data: {
        title,
        summary,
        category,
        region,
        coverImageUrl,
        galleryImages,
        source: "submission",
        status: "pending",
        submitterName,
        submitterContact,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("submit failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "服务器内部错误，请稍后重试",
      },
      { status: 500 }
    );
  }
}
