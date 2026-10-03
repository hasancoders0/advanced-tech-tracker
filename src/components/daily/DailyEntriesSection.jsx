"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileEdit,
  LockKeyhole,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";

import DailyDateNavigator from "@/components/daily/DailyDateNavigator";
import DailyWorkforceEntry from "@/components/daily/DailyWorkforceEntry";
import SalesEntryTable from "@/components/sales/SalesEntryTable";
import { useToast } from "@/components/feedback/ToastProvider";

const CURRENT_USER = {
  name: "Roberta Christie",
  role: "Editor",
};

const SUBMITTER = {
  name: "Easton Meier",
  role: "Admin",
};

export default function DailyEntriesSection({
  activeTab,
  selectedDate,
  onDateChange,
  onTotalsChange,
}) {
  const { showToast } = useToast();

  const [showEntries, setShowEntries] = useState(true);

  const [dayStatus, setDayStatus] = useState("draft");

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [lastSavedAt, setLastSavedAt] = useState("4:39 AM");

  const [lastSavedBy, setLastSavedBy] = useState(CURRENT_USER.name);

  const [submittedAt, setSubmittedAt] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");

  const [revisionOpen, setRevisionOpen] = useState(false);

  const [revisionReason, setRevisionReason] = useState("");

  /*
   * Save Draft
   */
  async function handleSaveDraft() {
    if (dayStatus === "submitted") {
      showToast({
        type: "error",
        message: "This day has already been submitted and is locked.",
      });

      return;
    }

    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const now = new Date();

    const savedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    setLastSavedAt(savedTime);
    setLastSavedBy(CURRENT_USER.name);
    setDayStatus("draft");
    setSaving(false);

    showToast({
      type: "success",
      message: "Workforce entries saved as draft.",
    });
  }

  /*
   * Submit Day
   */
  async function handleSubmitDay() {
    if (dayStatus === "submitted") {
      return;
    }

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const now = new Date();

    const submittedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    setSubmittedAt(submittedTime);
    setSubmittedBy(SUBMITTER.name);
    setDayStatus("submitted");
    setSubmitting(false);
    setShowEntries(true);

    showToast({
      type: "success",
      message: "Daily workforce entries submitted successfully.",
    });
  }

  /*
   * Reopen submitted day for revision.
   */
  function handleReopen() {
    if (!revisionReason.trim()) {
      showToast({
        type: "error",
        message: "Please enter a revision reason before reopening the day.",
      });

      return;
    }

    setDayStatus("revision");

    showToast({
      type: "success",
      message: "Day reopened for revision.",
    });

    setRevisionOpen(false);
  }

  const isSubmitted = dayStatus === "submitted";

  const statusConfig = {
    draft: {
      label: "DRAFT",
      className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      icon: Clock3,
    },

    revision: {
      label: "REVISION",
      className: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
      icon: FileEdit,
    },

    submitted: {
      label: "SUBMITTED",
      className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      icon: CheckCircle2,
    },
  };

  const currentStatus = statusConfig[dayStatus] || statusConfig.draft;

  const StatusIcon = currentStatus.icon;

  return (
    <section className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          WORKFLOW HEADER
      ===================================================== */}

      <div className="border-b border-slate-200">
        <div className="flex flex-col gap-4 px-3 py-3 sm:px-4 lg:px-5">
          {/* TOP ACTION ROW */}

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            {/* LEFT SIDE */}

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* SAVE */}

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || isSubmitted}
                className={[
                  "inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition",
                  "border border-slate-200 bg-white text-slate-700",
                  "hover:bg-slate-50 hover:border-slate-300",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              >
                <Save size={15} />

                {saving ? "Saving..." : "Save Draft"}
              </button>

              {/* SAVE META */}

              <div className="flex min-w-0 items-center gap-2 text-xs">
                {saving ? (
                  <span className="text-slate-400">Saving changes...</span>
                ) : (
                  <>
                    <CheckCircle2
                      size={14}
                      className="shrink-0 text-emerald-500"
                    />

                    <span className="truncate text-slate-500">
                      Last saved {lastSavedAt} by{" "}
                      <span className="font-medium text-slate-700">
                        {lastSavedBy}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT ACTIONS */}

            <div className="flex flex-wrap items-center gap-2">
              {/* STATUS */}

              <div
                className={[
                  "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold",
                  currentStatus.className,
                ].join(" ")}
              >
                <StatusIcon size={14} />

                {currentStatus.label}
              </div>

              {/* SUBMIT */}

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={handleSubmitDay}
                  disabled={submitting}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={15} />

                  {submitting ? "Submitting..." : "Submit Day"}
                </button>
              )}
            </div>
          </div>

          {/* =================================================
              DATE + SUBMISSION INFORMATION
          ================================================= */}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
            {/* DATE */}

            <div className="min-w-0">
              <DailyDateNavigator
                selectedDate={selectedDate}
                onDateChange={onDateChange}
              />
            </div>

            {/* SUBMISSION INFO */}

            <div className="flex min-w-0 items-center gap-2">
              {isSubmitted ? (
                <>
                  <ShieldCheck
                    size={16}
                    className="shrink-0 text-emerald-600"
                  />

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Submitted
                    </p>

                    <p className="truncate text-xs font-medium text-slate-700">
                      {submittedAt} by {submittedBy}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock3 size={16} className="shrink-0 text-slate-400" />

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Submission
                    </p>

                    <p className="text-xs font-medium text-slate-600">
                      Not submitted yet
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =================================================
              SUBMITTED / REVISION ACTION
          ================================================= */}

          {isSubmitted && (
            <div className="flex flex-col gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <LockKeyhole size={15} className="shrink-0 text-emerald-600" />

                <p className="text-xs text-emerald-800">
                  This day has been submitted and is locked for normal editing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRevisionOpen((value) => !value)}
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <FileEdit size={14} />
                Request Revision
              </button>
            </div>
          )}

          {/* =================================================
              REVISION FORM
          ================================================= */}

          {revisionOpen && (
            <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3">
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Revision Reason
                  </label>

                  <input
                    type="text"
                    value={revisionReason}
                    onChange={(event) => setRevisionReason(event.target.value)}
                    placeholder="Example: Correct Alan Rivera's worked hours."
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRevisionOpen(false)}
                    className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleReopen}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 text-xs font-semibold text-white hover:bg-orange-700"
                  >
                    <FileEdit size={14} />
                    Reopen Day
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          ENTRY VISIBILITY TOOLBAR
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            Workforce Entries
          </span>

          {isSubmitted && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              Read only
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowEntries((value) => !value)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          {showEntries ? <ChevronUp size={14} /> : <ChevronDown size={14} />}

          {showEntries ? "Hide Entries" : "Show Entries"}
        </button>
      </div>

      {/* =====================================================
          WORKFORCE / SALES CONTENT
      ===================================================== */}

      <div className="min-w-0 overflow-visible">
        {activeTab === "work" ? (
          <DailyWorkforceEntry
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            onTotalsChange={onTotalsChange}
            entriesVisible={showEntries}
            readOnly={isSubmitted}
            lastEditedBy={lastSavedBy}
            lastEditedAt={lastSavedAt}
          />
        ) : (
          <SalesEntryTable
            selectedDate={selectedDate}
            entriesVisible={showEntries}
          />
        )}
      </div>
    </section>
  );
}
