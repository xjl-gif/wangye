import { SubmitForm } from "@/components/SubmitForm";

export const metadata = {
  title: "我要投稿 · 非遗数字馆",
};

export default function SubmitPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[var(--accent-strong)]">
          我要投稿
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          填写非遗项目信息并上传图片。提交后进入待审核，通过后将在「非遗名录」中展示。
        </p>
      </div>
      <SubmitForm />
    </main>
  );
}
