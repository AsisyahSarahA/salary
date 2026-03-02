import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar kiri */}
      <Sidebar />   

      {/* Area kanan */}
      <div className="flex-1 flex flex-col">
        {/* Navbar atas */}
        <Navbar />

        {/* Konten halaman */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}