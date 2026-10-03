"use client";

import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Sun,
} from "lucide-react";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 h-[74px] border-b border-white/10 bg-[#080d13] text-white">
      <div className="flex h-full items-center gap-3 px-3 sm:px-5 lg:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu size={23} />
        </button>

        {/* Mobile branding */}
        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <div className="absolute inset-[2px] rotate-45 border-2 border-white" />

            <span className="relative text-[5px] font-extrabold">
              ADVANCED
            </span>
          </div>

          <span className="truncate text-base font-extrabold tracking-tight">
            TECH TRACKER
          </span>
        </div>

        {/* Desktop top navigation */}
        <nav className="hidden h-full items-center gap-9 lg:flex">
          <TopNavItem label="DAILY" active />
          <TopNavItem label="TREND" />
          <TopNavItem label="DASHBOARD" />
        </nav>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Global search */}
          <div className="hidden w-[230px] xl:block">
            <div className="flex h-11 items-center gap-3 rounded-lg bg-[#202a38] px-3 text-slate-400">
              <Search size={19} />

              <input
                type="text"
                placeholder="Search employee, job..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Bell size={22} />

            <span className="absolute right-1 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* Theme */}
          <button
            type="button"
            aria-label="Theme"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <Sun size={19} />
          </button>

          {/* User */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition hover:bg-white/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#147eea] text-sm font-bold text-white">
              T
            </div>

            <div className="hidden text-left md:block">
              <p className="text-[11px] leading-4 text-slate-400">
                Welcome,
              </p>

              <p className="text-sm font-semibold leading-4 text-white">
                Troy
              </p>
            </div>

            <ChevronDown
              size={17}
              className="hidden text-slate-400 md:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function TopNavItem({ label, active = false }) {
  return (
    <button
      type="button"
      className={[
        "relative flex h-full items-center px-2 text-sm font-bold tracking-wide",
        "transition",
        active
          ? "text-white"
          : "text-slate-300 hover:text-white",
      ].join(" ")}
    >
      {label}

      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[#0b9fe6]" />
      )}
    </button>
  );
}
