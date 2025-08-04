"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/admin", label: "Dashboard" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/jobs", label: "Jobs" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex h-full">
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white shadow-md h-full">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname.startsWith(item.href) && "bg-blue-100 text-blue-700"
              )}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</div>
    </div>
  );
}
