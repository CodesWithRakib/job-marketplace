// app/dashboard/recruiter/layout.tsx
import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/recruiter/sidebar";
import { Header } from "@/components/dashboard/recruiter/header";

export default function RecruiterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
