import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

// app/(dashboard)/dashboard/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-slate-900 text-white">
           

                <Sidebar />
                <Navbar />
                {/* Header, dll */}
                {children}
           
        </div>
            )
}