import { Header } from "@/components/header";
import { getAdminUser } from "@/lib/admin";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await getAdminUser();
  if (!adminUser) redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-8 md:flex-row md:px-6">
        <AdminSidebar />
        <div className="mx-auto w-full max-w-5xl flex-1">{children}</div>
      </main>
    </div>
  );
}
