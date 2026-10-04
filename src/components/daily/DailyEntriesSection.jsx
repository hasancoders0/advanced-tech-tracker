"use client";

import { useEffect, useMemo, useState } from "react";
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
import WorkforceEntryTable from "@/components/workforce/WorkforceEntryTable";
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

function getDateKey(value) {
  const date = value instanceof Date ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialWorkflow() {
  return {
    work: {
      status: "draft",
      lastSavedAt: "4:39 AM",
      lastSavedBy: CURRENT_USER.name,
    },
    sales: {
      status: "draft",
      lastSavedAt: "4:39 AM",
      lastSavedBy: CURRENT_USER.name,
    },
    day: {
      status: "draft",
      submittedAt: "",
      submittedBy: "",
      revisionHistory: [],
    },
  };
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DailyEntriesSection({
  activeTab,
  selectedDate,
  onDateChange,
  onTotalsChange,
  onSalesTotalsChange,
}) {
  const { showToast } = useToast();

  const [showEntries, setShowEntries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");

  const [workflowByDate, setWorkflowByDate] = useState(() => {
    const todayKey = getDateKey(new Date());
    return {
      [todayKey]: getInitialWorkflow(),
    };
  });

  const dateKey = useMemo(() => getDateKey(selectedDate), [selectedDate]);

  const workflow = workflowByDate[dateKey] || getInitialWorkflow();

  const isWorkTab = activeTab === "work";
  const activeSection = isWorkTab ? "work" : "sales";
  const activeWorkflow = workflow[activeSection];

  const isSubmitted = workflow.day.status === "submitted";
  const isRevision = workflow.day.status === "revision";
  const revisionHistory = workflow.day.revisionHistory || [];

  useEffect(() => {
    setWorkflowByDate((current) => {
      if (current[dateKey]) {
        return current;
      }

      return {
        ...current,
        [dateKey]: getInitialWorkflow(),
      };
    });
  }, [dateKey]);

  function updateWorkflow(updater) {
    setWorkflowByDate((current) => {
      const existing = current[dateKey] || getInitialWorkflow();
      const next = updater(existing);

      return {
        ...current,
        [dateKey]: next,
      };
    });
  }

  async function handleSaveDraft() {
    if (isSubmitted) {
      showToast({
        type: "error",
        message: "This day has already been submitted and is locked.",
      });
      return;
    }

    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const savedTime = getCurrentTime();

    updateWorkflow((current) => ({
      ...current,
      [activeSection]: {
        ...current[activeSection],
        status: "draft",
        lastSavedAt: savedTime,
        lastSavedBy: CURRENT_USER.name,
      },
    }));

    setSaving(false);

    showToast({
      type: "success",
      message: isWorkTab
        ? "Workforce entries saved as draft."
        : "Sales entries saved as draft.",
    });
  }

  async function handleFinalSubmit() {
    if (isSubmitted) {
      return;
    }

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const submittedTime = getCurrentTime();

    updateWorkflow((current) => ({
      ...current,
      work: {
        ...current.work,
        status: "locked",
      },
      sales: {
        ...current.sales,
        status: "locked",
      },
      day: {
        status: "submitted",
        submittedAt: submittedTime,
        submittedBy: SUBMITTER.name,
      },
    }));

    setSubmitting(false);
    setShowEntries(true);

    showToast({
      type: "success",
      message: "Work and sales have been finally submitted for the day.",
    });
  }

  function handleReopen() {
    const reason = revisionReason.trim();

    if (!reason) {
      showToast({
        type: "error",
        message: "Please enter a revision reason before reopening the day.",
      });
      return;
    }

    const revisionTime = getCurrentTime();

    updateWorkflow((current) => {
      const existingHistory = current.day.revisionHistory || [];

      return {
        ...current,
        work: {
          ...current.work,
          status: "revision",
        },
        sales: {
          ...current.sales,
          status: "revision",
        },
        day: {
          ...current.day,
          status: "revision",
          revisionHistory: [
            ...existingHistory,
            {
              id: `revision-${Date.now()}`,
              reason,
              requestedAt: revisionTime,
              requestedBy: CURRENT_USER.name,
            },
          ],
        },
      };
    });

    setRevisionReason("");
    setRevisionOpen(false);

    showToast({
      type: "success",
      message: "Day reopened for work and sales revision.",
    });
  }

  const activeStatusConfig = {
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
    locked: {
      label: "LOCKED",
      className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      icon: LockKeyhole,
    },
  };

  const activeStatus =
    activeStatusConfig[activeWorkflow.status] || activeStatusConfig.draft;

  const ActiveStatusIcon = activeStatus.icon;

  return (
    <section className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200">
        <div className="flex flex-col gap-4 px-3 py-3 sm:px-4 lg:px-5">
          {/* =====================================================
              WORK / SALES SAVE HEADER
          ===================================================== */}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || isSubmitted}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Draft"}
              </button>

              <div className="flex min-w-0 items-center gap-2 text-xs">
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />

                <span className="truncate text-slate-500">
                  Last {isWorkTab ? "work" : "sales"} saved{" "}
                  {activeWorkflow.lastSavedAt} by{" "}
                  <span className="font-medium text-slate-700">
                    {activeWorkflow.lastSavedBy}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold ${activeStatus.className}`}
              >
                <ActiveStatusIcon size={14} />
                {activeStatus.label}
              </div>

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={15} />
                  {submitting ? "Submitting..." : "Final Submit Day"}
                </button>
              )}
            </div>
          </div>

          {/* =====================================================
              DATE + FINAL SUBMISSION INFORMATION
          ===================================================== */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <DailyDateNavigator
                selectedDate={selectedDate}
                onDateChange={onDateChange}
              />
            </div>

            <div className="flex min-w-0 items-center gap-2">
              {isSubmitted ? (
                <>
                  <ShieldCheck
                    size={16}
                    className="shrink-0 text-emerald-600"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Final Submission
                    </p>
                    <p className="truncate text-xs font-medium text-slate-700">
                      {workflow.day.submittedAt} by {workflow.day.submittedBy}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Clock3 size={16} className="shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Final Submission
                    </p>
                    <p className="text-xs font-medium text-slate-600">
                      Work and sales can still be updated.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =====================================================
              REVISION HISTORY
          ===================================================== */}
          {revisionHistory.length > 0 && (
            <div className="rounded-lg border border-orange-100 bg-orange-50/40 px-3 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileEdit size={15} className="text-orange-600" />
                  <p className="text-xs font-semibold text-orange-800">
                    Revision History
                  </p>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-orange-700 ring-1 ring-orange-100">
                  {revisionHistory.length}{" "}
                  {revisionHistory.length === 1 ? "revision" : "revisions"}
                </span>
              </div>

              <div className="space-y-2">
                {revisionHistory.map((revision, index) => (
                  <div
                    key={revision.id}
                    className="rounded-lg border border-orange-100 bg-white px-3 py-2.5"
                  >
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800">
                          Revision {index + 1}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">
                          {revision.reason}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-[10px] font-medium text-slate-500">
                          {revision.requestedAt}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          by {revision.requestedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================
              FINAL SUBMITTED / REVISION
          ===================================================== */}
          {isSubmitted && (
            <div className="flex flex-col gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <LockKeyhole size={15} className="shrink-0 text-emerald-600" />
                <p className="text-xs text-emerald-800">
                  Work and sales for this day have been finally submitted and
                  are locked.
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

          {isRevision && !revisionOpen && (
            <div className="flex flex-col gap-2 rounded-lg border border-orange-100 bg-orange-50/50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <FileEdit size={15} className="shrink-0 text-orange-600" />
                <p className="text-xs text-orange-800">
                  This day is currently open for revision. Work and sales can be
                  edited and saved again.
                </p>
              </div>
              <span className="inline-flex h-7 shrink-0 items-center rounded-lg bg-white px-2.5 text-[10px] font-semibold text-orange-700 ring-1 ring-orange-100">
                REVISION OPEN
              </span>
            </div>
          )}

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
                    placeholder="Example: Correct workforce hours or sales information."
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
          WORKFORCE TOOLBAR ONLY
      ===================================================== */}
      {isWorkTab && (
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
      )}

      {/* =====================================================
          WORK / SALES CONTENT
      ===================================================== */}
      <div className="min-w-0 overflow-visible">
        {isWorkTab ? (
          <WorkforceEntryTable
            selectedDate={selectedDate}
            onTotalsChange={onTotalsChange}
            entriesVisible={showEntries}
            readOnly={isSubmitted}
            lastEditedBy={workflow.work.lastSavedBy}
            lastEditedAt={workflow.work.lastSavedAt}
          />
        ) : (
          <SalesEntryTable
            selectedDate={selectedDate}
            entriesVisible={showEntries}
            readOnly={isSubmitted}
            onSalesTotalsChange={onSalesTotalsChange}
          />
        )}
      </div>
    </section>
  );
}
