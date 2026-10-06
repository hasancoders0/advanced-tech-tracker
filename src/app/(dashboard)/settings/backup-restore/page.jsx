"use client";

import {
  AlertTriangle,
  Download,
  HardDrive,
  Upload,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";

export default function BackupRestorePage() {
  return (
    <div className="space-y-5">

      <PageHeader
        title="Backup & Restore"
        description="Protect application data with manual backups and restore tools."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <HardDrive size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Create Backup
                </h2>

                <p className="text-xs text-slate-400">
                  Download a copy of your application data.
                </p>
              </div>

            </div>
          </div>

          <div className="p-5">

            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs font-medium text-slate-500">
                Last Backup
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                No backup available
              </p>

            </div>

            <div className="mt-4">
              <Button className="w-full sm:w-auto">
                <Download size={16} />
                Download Backup
              </Button>
            </div>

          </div>

        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Upload size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800">
                  Restore Backup
                </h2>

                <p className="text-xs text-slate-400">
                  Restore data from a previous backup.
                </p>
              </div>

            </div>
          </div>

          <div className="p-5">

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-slate-400">

              <Upload
                size={20}
                className="text-slate-400"
              />

              <span className="mt-2 text-sm font-medium text-slate-700">
                Choose backup file
              </span>

              <span className="mt-1 text-xs text-slate-400">
                JSON or supported backup file
              </span>

              <input
                type="file"
                className="hidden"
              />

            </label>

          </div>

        </section>

      </div>

      <section className="rounded-xl border border-red-200 bg-white shadow-sm">

        <div className="flex items-start gap-3 p-5">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <AlertTriangle size={17} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Restore Warning
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Restoring a backup may replace existing application
              data. The final restore action will require confirmation.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
