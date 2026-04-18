import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, CheckSquare, ClipboardList, LogOut, CheckCircle } from "lucide-react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user } = useGetMe();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/login");
      }
    });
  };

  if (!user) return null;

  const isLeader = user.role === "leader";

  const leaderNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Members", href: "/members", icon: Users },
    { label: "Assign Task", href: "/assign-task", icon: CheckSquare },
  ];

  const memberNav = [
    { label: "My Updates", href: "/my-updates", icon: ClipboardList },
    { label: "My Tasks", href: "/my-tasks", icon: CheckCircle },
  ];

  const navItems = isLeader ? leaderNav : memberNav;

  return (
    <div className="flex h-screen bg-muted/40">
      <div className="w-64 border-r bg-card flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl text-primary tracking-tight">Tracker</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium truncate px-1">
              {user.name}
            </div>
            <div className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">
              {user.role}
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 border-b bg-card flex items-center px-4 md:hidden">
          <h1 className="font-bold text-lg text-primary">Tracker</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
