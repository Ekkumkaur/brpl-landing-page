import { useNavigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function DashboardLayout({ children, role }: { children: React.ReactNode, role: 'user' | 'coach' }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth")
    } catch {}
    navigate("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc]">
        <AppSidebar role={role} />
        <main className="flex-1 w-full">
          <div className="p-4 border-b bg-white flex items-center gap-4 sticky top-0 z-10 shadow-sm">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-[#263574]">
              {role === 'user' ? 'Player Dashboard' : 'Coach Dashboard'}
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
