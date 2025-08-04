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
import { User, Settings, LogOut, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated, isAdmin, isRecruiter, isUser } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract role from pathname
  const role = useMemo(() => {
    const segments = pathname.split("/");
    if (segments.length >= 3 && segments[1] === "dashboard") {
      return segments[2];
    }
    return null;
  }, [pathname]);

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

  // Authentication and authorization check
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // If no role in URL, redirect to user's role dashboard
    if (!role && user) {
      router.push(`/dashboard/${user.role}`);
      return;
    }

    if (role && user && user.role !== role && !isAdmin) {
      router.push("/unauthorized");
    }
  }, [isAuthenticated, isLoading, router, role, user, isAdmin]);

  // Loading state
  if (isLoading) {
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
  if (!isAuthenticated || (role && user && user.role !== role && !isAdmin)) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top header */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <h1 className="ml-2 md:ml-0 text-xl font-bold text-gray-800">
              Job Marketplace
            </h1>
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
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu (shown when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md z-20">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {role === "admin" && (
              <>
                <Link
                  href="/dashboard/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Users
                </Link>
                <Link
                  href="/dashboard/admin/jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
              </>
            )}
            {role === "recruiter" && (
              <>
                <Link
                  href="/dashboard/recruiter"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/recruiter/post-job"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Post Job
                </Link>
                <Link
                  href="/dashboard/recruiter/applications"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Applications
                </Link>
                <Link
                  href="/dashboard/recruiter/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            )}
            {role === "user" && (
              <>
                <Link
                  href="/dashboard/user"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/user/jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  href="/dashboard/user/applications"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Applications
                </Link>
                <Link
                  href="/dashboard/user/saved-jobs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Saved Jobs
                </Link>
                <Link
                  href="/dashboard/user/messages"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/dashboard/user/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
