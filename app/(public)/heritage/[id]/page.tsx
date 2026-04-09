import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseGallery } from "@/lib/gallery";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function HeritageDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.heritageItem.findFirst({
    where: { id, status: "published" },
  });

  if (!item) notFound();

  const gallery = parseGallery(item.galleryImages);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <Link href="/heritage" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
        ← 返回名录
      </Link>

      <article>
        <h1 className="font-serif text-3xl font-bold text-[var(--accent-strong)]">{item.title}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
          {item.category && <span>{item.category}</span>}
          {item.region && <span>{item.region}</span>}
        </div>
        <div className="prose prose-stone mt-6 max-w-none whitespace-pre-wrap text-[var(--foreground)]">
          {item.summary}
        </div>

        {item.coverImageUrl && (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.coverImageUrl}
              alt=""
              className="max-h-[480px] w-full rounded-lg object-cover"
            />
          </figure>
        )}

        {gallery.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((url) => (
              <div key={url} className="overflow-hidden rounded-lg border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
