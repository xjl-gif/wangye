import { LoginForm } from "./login-form";

export const metadata = {
  title: "登录 · 非遗数字馆",
};

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <LoginForm />
    </main>
  );
}
