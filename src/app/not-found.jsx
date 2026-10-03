"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
          404
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or may
          have been moved.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard">
            <Button>
              <Home size={16} />
              Go to Dashboard
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Advanced Tech Tracker
        </p>
      </div>
    </main>
  );
}
