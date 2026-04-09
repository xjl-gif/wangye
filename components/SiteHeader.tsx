import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--header-bg)]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-[var(--accent-strong)]"
        >
          非遗数字馆
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            首页
          </Link>
          <Link href="/heritage" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            非遗名录
          </Link>
          <Link href="/submit" className="text-[var(--muted)] hover:text-[var(--foreground)]">
            我要投稿
          </Link>
          <Link
            href="/admin"
            className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            管理
          </Link>
        </nav>
      </div>
    </header>
  );
}
