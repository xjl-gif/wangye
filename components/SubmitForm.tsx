"use client";

import { useState } from "react";

export function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/submit", { method: "POST", body: fd });
      const data = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok) {
        setStatus("err");
        setMessage(data.error ?? "提交失败");
        return;
      }
      setStatus("ok");
      setMessage("提交成功，请等待管理员审核。");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
      setMessage("网络错误，请稍后重试");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {message && (
        <p
          className={
            status === "ok"
              ? "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
              : "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          }
        >
          {message}
        </p>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">标题</span>
        <input
          name="title"
          required
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">简介</span>
        <textarea
          name="summary"
          required
          rows={6}
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">分类</span>
        <input
          name="category"
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">地区</span>
        <input
          name="region"
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">投稿人（选填）</span>
        <input
          name="submitterName"
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">联系方式（选填）</span>
        <input
          name="submitterContact"
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">图片（可多选，单张不超过 5MB）</span>
        <input
          type="file"
          name="images"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-strong)] disabled:opacity-50"
      >
        {status === "loading" ? "提交中…" : "提交审核"}
      </button>
    </form>
  );
}
