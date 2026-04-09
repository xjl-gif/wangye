import { HeritageForm } from "@/components/HeritageForm";

export const metadata = {
  title: "新建条目 · 非遗数字馆",
};

export default function AdminNewHeritagePage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold text-[var(--accent-strong)]">
        新建条目
      </h1>
      <HeritageForm mode="create" />
    </div>
  );
}
