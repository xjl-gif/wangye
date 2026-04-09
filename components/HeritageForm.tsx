"use client";

import {
  createHeritageItem,
  updateHeritageItem,
} from "@/lib/actions-heritage";
import { parseGallery } from "@/lib/gallery";
import { useState } from "react";

type Item = {
  id: string;
  title: string;
  summary: string;
  category: string | null;
  region: string | null;
  coverImageUrl: string | null;
  galleryImages: string;
  status: string;
};

type Props =
  | { mode: "create" }
  | { mode: "edit"; item: Item };

export function HeritageForm(props: Props) {
  const initial =
    props.mode === "edit" ? parseGallery(props.item.galleryImages) : [];

  const [coverUrl, setCoverUrl] = useState<string | null>(
    props.mode === "edit" ? props.item.coverImageUrl : null
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultPublished =
    props.mode === "edit" ? props.item.status === "published" : true;

  async function uploadOne(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await r.json()) as { url?: string; error?: string };
      if (!r.ok) {
        throw new Error(data.error ?? "上传失败");
      }
      return data.url as string;
    } finally {
      setUploading(false);
    }
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadOne(f);
      setCoverUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    }
    e.target.value = "";
  }

  async function onGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const next: string[] = [...galleryUrls];
    for (const f of Array.from(files)) {
      try {
        next.push(await uploadOne(f));
      } catch (err) {
        setError(err instanceof Error ? err.message : "上传失败");
      }
    }
    setGalleryUrls(next);
    e.target.value = "";
  }

  function removeGallery(url: string) {
    setGalleryUrls((g) => g.filter((u) => u !== url));
  }

  return (
    <form
      className="flex max-w-xl flex-col gap-4"
      action={
        props.mode === "create"
          ? createHeritageItem
          : updateHeritageItem.bind(null, props.item.id)
      }
    >
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">标题</span>
        <input
          name="title"
          required
          defaultValue={props.mode === "edit" ? props.item.title : ""}
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">简介</span>
        <textarea
          name="summary"
          required
          rows={6}
          defaultValue={props.mode === "edit" ? props.item.summary : ""}
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">分类</span>
        <input
          name="category"
          defaultValue={props.mode === "edit" ? props.item.category ?? "" : ""}
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">地区</span>
        <input
          name="region"
          defaultValue={props.mode === "edit" ? props.item.region ?? "" : ""}
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">封面图</span>
        <input type="hidden" name="coverImageUrl" value={coverUrl ?? ""} />
        {coverUrl && (
          <div className="relative max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" className="rounded-md border border-[var(--border)]" />
            <button
              type="button"
              className="mt-2 text-sm text-red-700"
              onClick={() => setCoverUrl(null)}
            >
              移除封面
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onCoverChange}
          disabled={uploading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">图集（可多选）</span>
        <input type="hidden" name="galleryImages" value={JSON.stringify(galleryUrls)} />
        <div className="flex flex-wrap gap-2">
          {galleryUrls.map((url) => (
            <div key={url} className="relative max-w-[80px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-20 w-20 rounded object-cover" />
              <button
                type="button"
                className="mt-1 text-xs text-red-700"
                onClick={() => removeGallery(url)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onGalleryChange}
          disabled={uploading}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="publish"
          defaultChecked={defaultPublished}
        />
        <span className="text-sm">立即发布（否则保存为草稿）</span>
      </label>

      <button
        type="submit"
        disabled={uploading}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-strong)] disabled:opacity-50"
      >
        {uploading ? "上传中…" : "保存"}
      </button>
    </form>
  );
}
