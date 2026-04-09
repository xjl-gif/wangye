"use server";

import { auth } from "@/auth";
import { parseGallery, stringifyGallery } from "@/lib/gallery";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
}

export async function createHeritageItem(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim() || null;
  const galleryRaw = String(formData.get("galleryImages") ?? "[]");
  let galleryImages = "[]";
  try {
    const urls = parseGallery(galleryRaw);
    galleryImages = stringifyGallery(urls);
  } catch {
    galleryImages = "[]";
  }
  const publish =
    formData.get("publish") === "on" || formData.get("status") === "published";

  if (!title || !summary) {
    throw new Error("标题与简介必填");
  }

  await prisma.heritageItem.create({
    data: {
      title,
      summary,
      category,
      region,
      coverImageUrl,
      galleryImages,
      source: "admin",
      status: publish ? "published" : "draft",
    },
  });

  revalidatePath("/");
  revalidatePath("/heritage");
  redirect("/admin/heritage");
}

export async function updateHeritageItem(id: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim() || null;
  const galleryRaw = String(formData.get("galleryImages") ?? "[]");
  let galleryImages = "[]";
  try {
    const urls = parseGallery(galleryRaw);
    galleryImages = stringifyGallery(urls);
  } catch {
    galleryImages = "[]";
  }
  const publish =
    formData.get("publish") === "on" || formData.get("status") === "published";

  if (!title || !summary) {
    throw new Error("标题与简介必填");
  }

  await prisma.heritageItem.update({
    where: { id },
    data: {
      title,
      summary,
      category,
      region,
      coverImageUrl,
      galleryImages,
      status: publish ? "published" : "draft",
    },
  });

  revalidatePath("/");
  revalidatePath("/heritage");
  revalidatePath(`/heritage/${id}`);
  redirect("/admin/heritage");
}

export async function deleteHeritageItem(id: string) {
  await requireAdmin();
  await prisma.heritageItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/heritage");
}

export async function deleteHeritageItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("缺少 id");
  await deleteHeritageItem(id);
}

export async function setSubmissionStatus(
  id: string,
  status: "published" | "rejected"
) {
  await requireAdmin();
  await prisma.heritageItem.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/");
  revalidatePath("/heritage");
  revalidatePath("/admin/review");
}

export async function approveSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("缺少 id");
  await setSubmissionStatus(id, "published");
}

export async function rejectSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) throw new Error("缺少 id");
  await setSubmissionStatus(id, "rejected");
}
