import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Jus Chick-Hen",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
