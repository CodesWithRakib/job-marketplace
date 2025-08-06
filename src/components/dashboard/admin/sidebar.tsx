// components/dashboard/admin/sidebar.tsx
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/dashboard/admin", icon: BarChart3 },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
  {
    name: "Applications",
    href: "/dashboard/admin/applications",
    icon: FileText,
  },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen flex-shrink-0 transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-r border-blue-100 dark:border-blue-900/50",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-blue-900/50">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  Admin Panel
                </span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                        : "text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-blue-900/20 hover:text-slate-900 dark:hover:text-white",
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                    )}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 group-hover:text-blue-500 dark:text-slate-500 dark:group-hover:text-blue-400",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                  </Link>
                );
              })}
            </nav>

            {!isCollapsed && (
              <div className="px-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 shadow-sm">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Admin Tip
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Monitor platform metrics regularly to ensure optimal
                    performance.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle and user section */}
          <div className="p-4 border-t border-blue-100 dark:border-blue-900/50">
            {!isCollapsed && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Theme
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            <Link
              href="/api/auth/signout"
              className="group flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-blue-500 dark:text-slate-500 dark:group-hover:text-blue-400" />
              {!isCollapsed && (
                <span className="text-sm font-medium">Sign out</span>
              )}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
