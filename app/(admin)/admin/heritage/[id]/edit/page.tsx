import { HeritageForm } from "@/components/HeritageForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditHeritagePage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.heritageItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-[var(--accent-strong)]">
        编辑条目
      </h1>
      <HeritageForm mode="edit" item={item} />
    </div>
  );
}
