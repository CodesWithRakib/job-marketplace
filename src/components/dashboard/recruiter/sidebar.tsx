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
} from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard/recruiter", icon: BarChart3 },
  { name: "Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
  {
    name: "Applications",
    href: "/dashboard/recruiter/applications",
    icon: FileText,
  },
  { name: "Profile", href: "/dashboard/recruiter/profile", icon: User },
  { name: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-indigo-600">
            JobMarket Recruiter
          </h1>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link
            href="/api/auth/signout"
            className="group block w-full flex-shrink-0"
          >
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Sign out
                </p>
              </div>
              <LogOut className="ml-auto h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
