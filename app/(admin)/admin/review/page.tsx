import {
  approveSubmission,
  rejectSubmission,
} from "@/lib/actions-heritage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage() {
  const pending = await prisma.heritageItem.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl font-bold text-[var(--accent-strong)]">
        待审核投稿
      </h1>
      <p className="mb-6 text-sm text-[var(--muted)]">
        通过后条目将出现在前台名录；拒绝后仅保留记录。
      </p>

      <ul className="flex flex-col gap-6">
        {pending.length === 0 ? (
          <li className="text-[var(--muted)]">暂无待审核投稿。</li>
        ) : (
          pending.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <h2 className="font-serif text-lg font-semibold">{item.title}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                {item.category && <span>{item.category}</span>}
                {item.region && <span>{item.region}</span>}
                {item.submitterName && <span>投稿人：{item.submitterName}</span>}
                {item.submitterContact && <span>联系方式：{item.submitterContact}</span>}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
                {item.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={approveSubmission}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
                  >
                    通过
                  </button>
                </form>
                <form action={rejectSubmission}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
                  >
                    拒绝
                  </button>
                </form>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
