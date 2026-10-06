import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

import settings from "@/data/settings";

const DAY_INDEX = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export function getWeekStartIndex() {
  return DAY_INDEX[settings.calendar.weekStartsOn] ?? 1;
}

export function getWorkingDays() {
  return settings.calendar.workingDays || [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
}

export function toDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  return parseISO(String(value));
}

export function formatDateKey(date) {
  return format(date, "yyyy-MM-dd");
}

export function formatDisplayDate(date) {
  return format(date, "MM/dd/yy");
}

export function getWeekStart(date) {
  const current = new Date(date);
  const targetDay = getWeekStartIndex();
  const currentDay = current.getDay();

  let difference = currentDay - targetDay;

  if (difference < 0) {
    difference += 7;
  }

  current.setHours(0, 0, 0, 0);

  return addDays(current, -difference);
}

export function getWeekDates(date) {
  const start = getWeekStart(date);

  return getWorkingDays()
    .map((dayName) => {
      const targetDay = DAY_INDEX[dayName];

      let offset = targetDay - getWeekStartIndex();

      if (offset < 0) {
        offset += 7;
      }

      return {
        name: dayName,
        date: addDays(start, offset),
      };
    })
    .sort((a, b) => a.date - b.date);
}

export function getLatestDataDate(records = []) {
  const dates = records
    .map((record) => record?.date || record?.workDate || record?.saleDate)
    .filter(Boolean)
    .map((value) => toDate(value))
    .filter(Boolean);

  if (!dates.length) {
    return new Date();
  }

  return dates.sort((a, b) => b - a)[0];
}

export function formatPeriod(start, end) {
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
}

export function getRecordDate(record) {
  return (
    record?.date ||
    record?.workDate ||
    record?.saleDate ||
    record?.createdDate ||
    record?.createdAt ||
    null
  );
}

export function getRecordEntries(record) {
  if (!record) return [];

  return (
    record.entries ||
    record.workforce ||
    record.technicians ||
    record.data ||
    []
  );
}

export function getEntryName(entry) {
  return (
    entry?.name ||
    entry?.employeeName ||
    entry?.technicianName ||
    "Unknown"
  );
}

export function getEntryId(entry) {
  return (
    entry?.id ||
    entry?.technicianId ||
    entry?.employeeId ||
    ""
  );
}

export function getEntryDepartment(entry) {
  return (
    entry?.department ||
    entry?.departmentName ||
    "General"
  );
}

export function getStatus(entry) {
  return (
    entry?.entryStatus ||
    entry?.status ||
    "Worked"
  );
}

export function timeCodeToMinutes(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const text = String(value).trim();

  if (!text) return 0;

  const numeric = Number(text);

  if (!Number.isNaN(numeric)) {
    const [hoursText, minutesText = "0"] = text.split(".");
    const hours = Number(hoursText) || 0;
    const minutes = Number(minutesText.padEnd(2, "0").slice(0, 2)) || 0;

    return hours * 60 + minutes;
  }

  return 0;
}

export function minutesToTimeCode(minutes) {
  const safeMinutes = Math.max(0, Math.round(Number(minutes) || 0));

  const hours = Math.floor(safeMinutes / 60);
  const remaining = safeMinutes % 60;

  return `${hours}.${String(remaining).padStart(2, "0")}`;
}

export function getEntryHours(entry) {
  return (
    entry?.hoursProduced ??
    entry?.produced ??
    entry?.hoursWorked ??
    entry?.worked ??
    "0.00"
  );
}

export function getProducedHours(entry) {
  return (
    entry?.hoursProduced ??
    entry?.produced ??
    entry?.productionHours ??
    "0.00"
  );
}

export function getWorkedHours(entry) {
  return (
    entry?.hoursWorked ??
    entry?.worked ??
    entry?.workHours ??
    "0.00"
  );
}

export function getEmergencyHours(entry) {
  return (
    entry?.emergencyHours ??
    entry?.emergency ??
    "0.00"
  );
}

export function getDailyRecord(records, date) {
  const key = formatDateKey(date);

  return records.find(
    (record) => getRecordDate(record) === key
  );
}

export function getAllEntriesForRange(records, start, end) {
  return records.flatMap((record) => {
    const value = getRecordDate(record);

    if (!value) return [];

    const date = toDate(value);

    if (!date) return [];

    if (isBefore(date, start) || isAfter(date, end)) {
      return [];
    }

    return getRecordEntries(record).map((entry) => ({
      ...entry,
      __date: date,
    }));
  });
}

export function getRangeFromKey(key, referenceDate) {
  const date = new Date(referenceDate);

  switch (key) {
    case "mtd":
      return {
        start: startOfMonth(date),
        end: date,
      };

    case "cm-vs-lm":
      return {
        start: startOfMonth(subMonths(date, 1)),
        end: endOfMonth(subMonths(date, 1)),
      };

    case "three-month":
      return {
        start: startOfMonth(subMonths(date, 2)),
        end: date,
      };

    case "six-month":
      return {
        start: startOfMonth(subMonths(date, 5)),
        end: date,
      };

    case "ytd":
      return {
        start: startOfYear(date),
        end: date,
      };

    default:
      return {
        start: getWeekStart(date),
        end: addDays(getWeekStart(date), 6),
      };
  }
}

export function getWeekSummary(records, weekDates) {
  const employees = new Map();

  weekDates.forEach(({ date }) => {
    const record = getDailyRecord(records, date);

    getRecordEntries(record).forEach((entry) => {
      const id = getEntryId(entry);

      if (!id) return;

      if (!employees.has(id)) {
        employees.set(id, {
          id,
          name: getEntryName(entry),
          department: getEntryDepartment(entry),
          days: {},
          totalMinutes: 0,
          emergencyMinutes: 0,
          callOuts: 0,
        });
      }

      const employee = employees.get(id);
      const key = formatDateKey(date);
      const status = String(getStatus(entry)).toLowerCase();

      employee.days[key] = {
        value:
          status.includes("call") ||
          status.includes("out")
            ? "Called Out"
            : getEntryHours(entry),
        status,
      };

      employee.totalMinutes += timeCodeToMinutes(
        getProducedHours(entry)
      );

      employee.emergencyMinutes += timeCodeToMinutes(
        getEmergencyHours(entry)
      );

      if (
        status.includes("call") ||
        status.includes("out")
      ) {
        employee.callOuts += 1;
      }
    });
  });

  return Array.from(employees.values());
}
