import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.heritageItem.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
        <p className="font-serif text-xl font-semibold text-[var(--accent-strong)]">
          传承 · 记录 · 分享
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          非物质文化遗产数字馆
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          浏览各地非遗项目，了解技艺与故事；您也可以投稿分享身边的非遗，经审核后展示。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/heritage"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-[var(--accent-strong)]"
          >
            浏览名录
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]"
          >
            我要投稿
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold text-[var(--accent-strong)]">
          最新条目
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <li className="col-span-full text-[var(--muted)]">暂无已发布内容。</li>
          ) : (
            featured.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/heritage/${item.id}`}
                  className="block h-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-[var(--accent)] hover:shadow-md"
                >
                  <span className="font-medium text-[var(--foreground)]">{item.title}</span>
                  {item.category && (
                    <span className="text-xs text-[var(--muted)]"> · {item.category}</span>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{item.summary}</p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
