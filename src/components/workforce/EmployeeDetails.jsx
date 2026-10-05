"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import Badge from "@/components/ui/Badge";

function InfoItem({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        {Icon ? (
          <Icon
            size={13}
            className="shrink-0 text-slate-400"
          />
        ) : null}

        <p className="truncate text-xs font-medium text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeDetails({
  employee,
  onClose,
}) {
  if (!employee) {
    return null;
  }

  const contact = employee.contact || {};
  const address = employee.address || {};
  const employment = employee.employment || {};
  const statusHistory = employee.statusHistory || [];

  const fullAddress =
    typeof employee.address === "string"
      ? employee.address
      : [
          address.street,
          address.city,
          address.state,
          address.zipCode,
        ]
          .filter(Boolean)
          .join(", ");

  const employeeStatus =
    employment.status ||
    employee.status ||
    "Unknown";

  const isActive =
    employeeStatus === "Active";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-3 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Employee details"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <UserRound size={18} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-900">
                {employee.name ||
                  employee.fullName ||
                  "Employee"}
              </h2>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                {employee.employeeCode ||
                  employee.id ||
                  "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}

        <div className="overflow-y-auto p-5">
          {/* Status */}

          <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Employment Status
              </p>

              <p className="mt-1 text-xs font-medium text-slate-700">
                {employeeStatus}
              </p>
            </div>

            <Badge
              variant={
                isActive
                  ? "success"
                  : "default"
              }
            >
              {employeeStatus}
            </Badge>
          </div>

          {/* Contact Information */}

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Mail
                size={14}
                className="text-sky-500"
              />

              <h3 className="text-xs font-semibold text-slate-800">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Email"
                value={
                  contact.email ||
                  employee.email
                }
                icon={Mail}
              />

              <InfoItem
                label="Phone"
                value={
                  contact.phone ||
                  employee.phone
                }
                icon={Phone}
              />

              <div className="sm:col-span-2">
                <InfoItem
                  label="Address"
                  value={fullAddress}
                  icon={MapPin}
                />
              </div>
            </div>
          </section>

          {/* Employment Information */}

          <section className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <BriefcaseBusiness
                size={14}
                className="text-sky-500"
              />

              <h3 className="text-xs font-semibold text-slate-800">
                Employment Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Department"
                value={
                  employment.department
                }
              />

              <InfoItem
                label="Role"
                value={
                  employment.role
                }
              />

              <InfoItem
                label="Employment Type"
                value={
                  employment.employmentType
                }
              />

              <InfoItem
                label="Hire Date"
                value={
                  employment.hireDate
                }
                icon={CalendarDays}
              />

              {employment.terminationDate ? (
                <InfoItem
                  label="Termination Date"
                  value={
                    employment.terminationDate
                  }
                  icon={CalendarDays}
                />
              ) : null}
            </div>
          </section>

          {/* Notes */}

          {employment.notes ? (
            <section className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-xs font-semibold text-slate-800">
                Notes
              </h3>

              <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                {employment.notes}
              </p>
            </section>
          ) : null}

          {/* Status History */}

          <section className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock3
                size={14}
                className="text-sky-500"
              />

              <h3 className="text-xs font-semibold text-slate-800">
                Status History
              </h3>
            </div>

            {statusHistory.length > 0 ? (
              <div className="space-y-2">
                {statusHistory
                  .slice()
                  .reverse()
                  .map((history) => {
                    const historyIsActive =
                      history.status ===
                      "Active";

                    return (
                      <div
                        key={
                          history.id ||
                          `${history.status}-${history.date}`
                        }
                        className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                historyIsActive
                                  ? "success"
                                  : "default"
                              }
                            >
                              {history.status ||
                                "Unknown"}
                            </Badge>

                            {history.date ? (
                              <span className="text-[10px] text-slate-400">
                                {history.date}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-1 text-[10px] leading-4 text-slate-500">
                            {history.reason ||
                              "Status updated."}
                          </p>
                        </div>

                        <span className="shrink-0 text-[9px] text-slate-400">
                          {history.recordedBy ||
                            "System"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  No status history available.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}

        <div className="flex shrink-0 justify-end border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}