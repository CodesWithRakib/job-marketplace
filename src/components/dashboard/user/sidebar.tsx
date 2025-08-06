// components/dashboard/user/sidebar.tsx
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  FileText,
  Bookmark,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  HelpCircle,
  Users,
  BookOpen,
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard/user",
    icon: BarChart3,
    description: "Your job search overview and activity",
  },
  {
    name: "Job Search",
    href: "/dashboard/user/jobs",
    icon: Search,
    children: [
      { name: "Browse Jobs", href: "/dashboard/user/jobs/browse" },
      { name: "Recommended Jobs", href: "/dashboard/user/jobs/recommended" },
      { name: "Recent Views", href: "/dashboard/user/jobs/recent" },
    ],
  },
  {
    name: "Applications",
    href: "/dashboard/user/applications",
    icon: FileText,
    children: [
      { name: "All Applications", href: "/dashboard/user/applications" },
      { name: "Active", href: "/dashboard/user/applications/active" },
      {
        name: "Interview Stage",
        href: "/dashboard/user/applications/interviews",
      },
      { name: "Offers", href: "/dashboard/user/applications/offers" },
      { name: "Archived", href: "/dashboard/user/applications/archived" },
    ],
  },
  {
    name: "Saved Jobs",
    href: "/dashboard/user/saved-jobs",
    icon: Bookmark,
    children: [
      { name: "All Saved", href: "/dashboard/user/saved-jobs" },
      { name: "Recently Viewed", href: "/dashboard/user/saved-jobs/recent" },
      { name: "Applied To", href: "/dashboard/user/saved-jobs/applied" },
    ],
  },
  {
    name: "Career Resources",
    href: "/dashboard/user/resources",
    icon: BookOpen,
    children: [
      { name: "Resume Builder", href: "/dashboard/user/resources/resume" },
      {
        name: "Cover Letters",
        href: "/dashboard/user/resources/cover-letters",
      },
      { name: "Interview Prep", href: "/dashboard/user/resources/interviews" },
      {
        name: "Skills Assessment",
        href: "/dashboard/user/resources/assessments",
      },
    ],
  },
  {
    name: "Profile",
    href: "/dashboard/user/profile",
    icon: User,
    children: [
      { name: "View Profile", href: "/dashboard/user/profile" },
      { name: "Work Experience", href: "/dashboard/user/profile/experience" },
      { name: "Education", href: "/dashboard/user/profile/education" },
      { name: "Skills", href: "/dashboard/user/profile/skills" },
      { name: "Portfolio", href: "/dashboard/user/profile/portfolio" },
    ],
  },
  {
    name: "Networking",
    href: "/dashboard/user/network",
    icon: Users,
    children: [
      { name: "Connections", href: "/dashboard/user/network" },
      { name: "Followed Companies", href: "/dashboard/user/network/companies" },
      { name: "Messages", href: "/dashboard/user/network/messages" },
    ],
  },
  {
    name: "Settings",
    href: "/dashboard/user/settings",
    icon: Settings,
    children: [
      { name: "Account", href: "/dashboard/user/settings/account" },
      { name: "Privacy", href: "/dashboard/user/settings/privacy" },
      { name: "Notifications", href: "/dashboard/user/settings/notifications" },
      { name: "Email Preferences", href: "/dashboard/user/settings/email" },
    ],
  },
  {
    name: "Help Center",
    href: "/dashboard/user/help",
    icon: HelpCircle,
    description: "Get support with your job search",
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
          "bg-gradient-to-b from-white to-purple-50 dark:from-slate-900 dark:to-purple-900/20 border-r border-purple-100 dark:border-purple-900/50",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-purple-100 dark:border-purple-900/50">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">U</span>
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  User Dashboard
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
                        ? "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/20 text-purple-700 dark:text-purple-300 shadow-sm"
                        : "text-slate-600 hover:bg-purple-50 dark:text-slate-300 dark:hover:bg-purple-900/20 hover:text-slate-900 dark:hover:text-white",
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                    )}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-400 group-hover:text-purple-500 dark:text-slate-500 dark:group-hover:text-purple-400",
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
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30 shadow-sm">
                  <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    User Tip
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-300">
                    Complete your profile to increase your visibility to
                    recruiters.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle and user section */}
          <div className="p-4 border-t border-purple-100 dark:border-purple-900/50">
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
              className="group flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-purple-500 dark:text-slate-500 dark:group-hover:text-purple-400" />
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
