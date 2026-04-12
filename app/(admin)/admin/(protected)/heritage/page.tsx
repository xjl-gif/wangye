import { deleteHeritageItemAction } from "@/lib/actions-heritage";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  draft: "草稿",
  published: "已发布",
  pending: "待审核",
  rejected: "已拒绝",
};

export default async function AdminHeritageListPage() {
  const items = await prisma.heritageItem.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-[var(--accent-strong)]">
          条目管理
        </h1>
        <Link
          href="/admin/heritage/new"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
        >
          新建条目
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--header-bg)]">
            <tr>
              <th className="px-4 py-3 font-medium">标题</th>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">来源</th>
              <th className="px-4 py-3 font-medium">更新</th>
              <th className="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  暂无条目
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium">{item.title}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {statusLabel[item.status] ?? item.status}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {item.source === "submission" ? "投稿" : "后台"}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {item.updatedAt.toLocaleString("zh-CN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/heritage/${item.id}/edit`}
                        className="text-[var(--accent)] hover:underline"
                      >
                        编辑
                      </Link>
                      <form action={deleteHeritageItemAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-red-700 hover:underline">
                          删除
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
