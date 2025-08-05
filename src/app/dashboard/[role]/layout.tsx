// app/dashboard/[role]/layout.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  Briefcase,
  Users,
  MessageSquare,
  Bookmark,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface DashboardLayoutProps {
  children: ReactNode;
  params: { role: string };
}

export default function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get user data from Redux store
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // Use role from params
  const role = params.role;

  // Role display name
  const roleDisplayName = useMemo(() => {
    switch (role) {
      case "admin":
        return "Admin";
      case "recruiter":
        return "Recruiter";
      case "user":
        return "Job Seeker";
      default:
        return "User";
    }
  }, [role]);

  // Role checks
  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const isUser = user?.role === "user";

  // Authentication and authorization check
  useEffect(() => {
    if (status === "loading") return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // If user's role doesn't match the URL role and they're not an admin
    if (user && user.role !== role && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [isAuthenticated, status, router, role, user, isAdmin]);

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthenticated || (user && user.role !== role && !isAdmin)) {
    return null;
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Navigation items based on role
  const navigationItems = useMemo(() => {
    const baseItems = [
      { name: "Dashboard", href: `/dashboard/${role}`, icon: Home },
    ];

    if (role === "admin") {
      return [
        ...baseItems,
        { name: "Users", href: `/dashboard/${role}/users`, icon: Users },
        { name: "Jobs", href: `/dashboard/${role}/jobs`, icon: Briefcase },
        {
          name: "Messages",
          href: `/dashboard/${role}/messages`,
          icon: MessageSquare,
        },
      ];
    }

    if (role === "recruiter") {
      return [
        ...baseItems,
        {
          name: "Post Job",
          href: `/dashboard/${role}/post-job`,
          icon: Briefcase,
        },
        {
          name: "Applications",
          href: `/dashboard/${role}/applications`,
          icon: FileText,
        },
        {
          name: "Messages",
          href: `/dashboard/${role}/messages`,
          icon: MessageSquare,
        },
      ];
    }

    if (role === "user") {
      return [
        ...baseItems,
        { name: "Find Jobs", href: `/dashboard/${role}/jobs`, icon: Briefcase },
        {
          name: "My Applications",
          href: `/dashboard/${role}/applications`,
          icon: FileText,
        },
        {
          name: "Saved Jobs",
          href: `/dashboard/${role}/saved-jobs`,
          icon: Bookmark,
        },
        {
          name: "Messages",
          href: `/dashboard/${role}/messages`,
          icon: MessageSquare,
        },
        { name: "Profile", href: `/dashboard/${role}/profile`, icon: User },
      ];
    }

    return baseItems;
  }, [role]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Job Marketplace</h1>
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-6 px-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-2"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-medium text-gray-800">
                {roleDisplayName} Dashboard
              </h2>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                      aria-label="User menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.image || ""}
                          alt={user?.email || "User avatar"}
                        />
                        <AvatarFallback>
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block text-sm font-medium truncate max-w-[120px]">
                        {user?.name || user?.email || "User"}
                      </span>
                      <span className="hidden md:inline-block text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {roleDisplayName}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${role}/profile`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${role}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
