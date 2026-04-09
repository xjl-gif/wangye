import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HeritageListPage() {
  const items = await prisma.heritageItem.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <section>
        <h1 className="font-serif text-3xl font-bold text-[var(--accent-strong)]">非遗名录</h1>
        <p className="mt-2 text-[var(--muted)]">仅展示已审核发布的条目。</p>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? (
          <li className="col-span-full text-[var(--muted)]">暂无已发布内容。</li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/heritage/${item.id}`}
                className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--accent)] hover:shadow-md"
              >
                <span className="font-serif text-lg font-semibold text-[var(--foreground)]">
                  {item.title}
                </span>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  {item.category && <span>{item.category}</span>}
                  {item.region && <span>{item.region}</span>}
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                  {item.summary}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
