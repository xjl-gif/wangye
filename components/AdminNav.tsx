"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (pathname === "/admin/login") return null;
  if (status === "loading") return null;
  if (!session?.user) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
      <nav className="flex flex-wrap gap-4 text-sm">
        <Link href="/admin/heritage" className="font-medium text-[var(--accent-strong)]">
          条目管理
        </Link>
        <Link
          href="/admin/review"
          className="text-[var(--muted)] hover:text-[var(--accent)]"
        >
          待审核
        </Link>
        <Link href="/" className="text-[var(--muted)] hover:text-[var(--accent)]">
          返回前台
        </Link>
      </nav>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-[var(--muted)] underline hover:text-[var(--foreground)]"
      >
        退出（{session.user.email}）
      </button>
    </div>
  );
}
