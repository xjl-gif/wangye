"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function normalizeAuthError(error?: string | null) {
  if (!error) return "登录失败，请稍后重试";
  const lower = error.toLowerCase();
  if (
    lower.includes("credentials") ||
    lower.includes("credentialssignin") ||
    lower.includes("callbackrouteerror") ||
    lower.includes("accessdenied")
  ) {
    return "邮箱或密码错误";
  }
  if (lower.includes("bad request")) {
    return "请求无效，请刷新页面后重试";
  }
  return `登录失败：${error}`;
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setPending(false);

      if (!res) {
        setError("登录失败：服务器未返回结果");
        return;
      }

      if (res.error) {
        setError(normalizeAuthError(res.error));
        return;
      }

      if (res.ok) {
        router.push("/admin/heritage");
        router.refresh();
        return;
      }

      setError("登录失败，请重试");
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? `登录失败：${err.message}` : "登录失败，请稍后重试");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm"
    >
      <h1 className="font-serif text-xl font-semibold text-[var(--accent-strong)]">
        管理员登录
      </h1>
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">邮箱</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">密码</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-[var(--border)] px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-strong)] disabled:opacity-50"
      >
        {pending ? "登录中…" : "登录"}
      </button>
    </form>
  );
}
