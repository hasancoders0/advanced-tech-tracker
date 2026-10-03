"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ToastProvider } from "@/components/feedback/ToastProvider";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f4f8fc]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:pl-[245px]">
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="min-w-0">
            <div className="mx-auto w-full max-w-[1600px] p-3 sm:p-5 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
