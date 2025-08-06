// components/dashboard/user/header.tsx
"use client";
import {
  Bell,
  Search,
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Menu,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <header className="sticky top-0 z-30 w-full border-b border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-white to-purple-50 dark:from-slate-900 dark:to-slate-800 shadow-sm backdrop-blur-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex-1 max-w-md">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    className="w-full pl-10 pr-3 py-2 border border-purple-200 dark:border-purple-800 rounded-lg leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-white"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500 dark:text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // If no session, don't render the user dropdown
  if (!session) {
    return (
      <header className="sticky top-0 z-30 w-full border-b border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-white to-purple-50 dark:from-slate-900 dark:to-slate-800 shadow-sm backdrop-blur-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex-1 max-w-md">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    className="w-full pl-10 pr-3 py-2 border border-purple-200 dark:border-purple-800 rounded-lg leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-white"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/api/auth/signin")}
                className="text-slate-700 dark:text-slate-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-white to-purple-50 dark:from-slate-900 dark:to-slate-800 shadow-sm backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex-1 max-w-md">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  className="w-full pl-10 pr-3 py-2 border border-purple-200 dark:border-purple-800 rounded-lg leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-white"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white">
                3
              </Badge>
            </Button>
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-violet-200 dark:from-purple-900/30 dark:to-violet-800/50 text-purple-800 dark:text-purple-200">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white dark:bg-slate-800 border border-purple-100 dark:border-purple-900/50 shadow-lg w-56"
                >
                  <DropdownMenuLabel className="text-slate-900 dark:text-white">
                    {session.user?.name || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-900/50" />
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/user/profile")}
                    className="text-slate-700 dark:text-slate-300 focus:bg-purple-50 dark:focus:bg-purple-900/20"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/user/settings")}
                    className="text-slate-700 dark:text-slate-300 focus:bg-purple-50 dark:focus:bg-purple-900/20"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-100 dark:bg-purple-900/50" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-slate-700 dark:text-slate-300 focus:bg-purple-50 dark:focus:bg-purple-900/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-purple-100 dark:border-purple-900/50 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                className="w-full pl-10 pr-3 py-2 border border-purple-200 dark:border-purple-800 rounded-lg leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-slate-900 dark:text-white"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
