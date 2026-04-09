import { auth } from "@/auth";
import {
  isAllowedImageType,
  saveUploadedImage,
  UPLOAD_MAX_BYTES,
} from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "缺少文件" }, { status: 400 });
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json({ error: "单张图片不超过 5MB" }, { status: 400 });
  }
  if (!isAllowedImageType(file.type)) {
    return NextResponse.json({ error: "仅支持 JPEG、PNG、WebP、GIF" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const url = await saveUploadedImage(buf, file.name);
  return NextResponse.json({ url });
}
