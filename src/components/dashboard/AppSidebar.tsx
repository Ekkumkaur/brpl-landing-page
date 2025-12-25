import { Home, User, Users, Calendar, Settings, Activity, Trophy } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"

const userItems = [
  { title: "Overview", url: "/dashboard/user", icon: Home },
  { title: "My Profile", url: "/dashboard/user/profile", icon: User },
  { title: "My Stats", url: "/dashboard/user/stats", icon: Activity },
  { title: "Schedule", url: "/dashboard/user/schedule", icon: Calendar },
  { title: "Settings", url: "/dashboard/user/settings", icon: Settings },
]

const coachItems = [
  { title: "Overview", url: "/dashboard/coach", icon: Home },
  { title: "Players", url: "/dashboard/coach/players", icon: Users },
  { title: "Teams", url: "/dashboard/coach/teams", icon: Trophy },
  { title: "Schedule", url: "/dashboard/coach/schedule", icon: Calendar },
  { title: "Settings", url: "/dashboard/coach/settings", icon: Settings },
]

export function AppSidebar({ role }: { role: 'user' | 'coach' }) {
  const location = useLocation();
  const items = role === 'user' ? userItems : coachItems

  const handleLogout = () => {
      try {
        localStorage.removeItem("auth");
      } catch {}
      window.location.href = "/login";
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200 z-30" variant="sidebar">
       <SidebarHeader className="p-4 border-b border-gray-100 bg-white">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#263574] flex items-center justify-center text-white font-bold shadow-sm">
              {role === 'user' ? 'P' : 'C'}
            </div>
            <span className="font-bold text-[#263574] text-lg">BRPL {role === 'user' ? 'Player' : 'Coach'}</span>
         </div>
       </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-semibold px-4 mt-4 mb-2 uppercase text-xs tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={`w-full transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#263574] text-white shadow-md hover:bg-[#1f2b5e] hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-[#263574]'
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-md">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#263574]'}`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-100 bg-white">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
