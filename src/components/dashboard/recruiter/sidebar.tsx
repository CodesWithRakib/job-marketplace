// components/dashboard/recruiter/sidebar.tsx
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  FileText,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  PlusCircle,
  Users,
  Calendar,
  Mail,
  Building,
  CreditCard,
  PieChart,
  Share2,
  LifeBuoy,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// const navigation = [
//   { name: "Dashboard", href: "/dashboard/recruiter", icon: BarChart3 },
//   { name: "Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
//   {
//     name: "Applications",
//     href: "/dashboard/recruiter/applications",
//     icon: FileText,
//   },
//   { name: "Profile", href: "/dashboard/recruiter/profile", icon: User },
//   { name: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
// ];

const navigation = [
  { name: "Dashboard", href: "/dashboard/recruiter", icon: BarChart3 },
  { name: "Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
  {
    name: "Post New Job",
    href: "/dashboard/recruiter/jobs/new",
    icon: PlusCircle,
  },
  {
    name: "Applications",
    href: "/dashboard/recruiter/applications",
    icon: FileText,
  },
  {
    name: "Candidate Pool",
    href: "/dashboard/recruiter/candidates",
    icon: Users,
  },
  {
    name: "Interviews",
    href: "/dashboard/recruiter/interviews",
    icon: Calendar,
    children: [
      { name: "Schedule", href: "/dashboard/recruiter/interviews/schedule" },
      { name: "Upcoming", href: "/dashboard/recruiter/interviews/upcoming" },
      { name: "History", href: "/dashboard/recruiter/interviews/history" },
    ],
  },
  {
    name: "Messages",
    href: "/dashboard/recruiter/messages",
    icon: Mail,
  },
  {
    name: "Company Profile",
    href: "/dashboard/recruiter/company",
    icon: Building,
  },
  { name: "Profile", href: "/dashboard/recruiter/profile", icon: User },
  {
    name: "Billing & Plans",
    href: "/dashboard/recruiter/billing",
    icon: CreditCard,
  },
  { name: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
  {
    name: "Reports & Analytics",
    href: "/dashboard/recruiter/analytics",
    icon: PieChart,
  },
  {
    name: "Talent Network",
    href: "/dashboard/recruiter/network",
    icon: Share2,
  },
  {
    name: "Help Center",
    href: "/dashboard/recruiter/help",
    icon: LifeBuoy,
  },
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
          "bg-gradient-to-b from-white to-green-50 dark:from-slate-900 dark:to-green-900/20 border-r border-green-100 dark:border-green-900/50",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-green-100 dark:border-green-900/50">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  Recruiter Portal
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
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 text-green-700 dark:text-green-300 shadow-sm"
                        : "text-slate-600 hover:bg-green-50 dark:text-slate-300 dark:hover:bg-green-900/20 hover:text-slate-900 dark:hover:text-white",
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                    )}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400 group-hover:text-green-500 dark:text-slate-500 dark:group-hover:text-green-400",
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
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-green-100 dark:border-green-900/30 shadow-sm">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Recruiter Tip
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    Update your job postings regularly to attract more qualified
                    candidates.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle and user section */}
          <div className="p-4 border-t border-green-100 dark:border-green-900/50">
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
              className="group flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-green-500 dark:text-slate-500 dark:group-hover:text-green-400" />
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
