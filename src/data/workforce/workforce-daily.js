const workforceDailyData = [
  {
    date: "2026-09-27",
    status: "closed",
    revisionReason: "",
    submittedBy: "USR-002",
    submittedAt: "2026-09-27T17:20:00",
    lastSavedBy: "USR-002",
    lastSavedAt: "2026-09-27T17:18:00",
    entries: []
  },

  {
    date: "2026-09-28",
    status: "submitted",
    revisionReason: "",
    submittedBy: "USR-002",
    submittedAt: "2026-09-28T17:12:00",
    lastSavedBy: "USR-002",
    lastSavedAt: "2026-09-28T17:10:00",
    entries: [
      { id: "WF-0928-002", technicianId: "TECH-002", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.30", hoursWorked: "8.00", emergencyHours: "0.30", notes: "", lastSavedAt: "2026-09-28T16:45:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-003", technicianId: "TECH-003", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "7.45", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-28T16:46:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-004", technicianId: "TECH-004", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.15", hoursWorked: "8.00", emergencyHours: "0.15", notes: "", lastSavedAt: "2026-09-28T16:47:00", lastSavedBy: "USR-002" },

      { id: "WF-0928-011", technicianId: "TECH-011", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "9.00", hoursWorked: "8.30", emergencyHours: "0.30", notes: "Completed priority fleet work.", lastSavedAt: "2026-09-28T16:50:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-012", technicianId: "TECH-012", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.20", hoursWorked: "8.00", emergencyHours: "0.20", notes: "", lastSavedAt: "2026-09-28T16:51:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-013", technicianId: "TECH-013", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.50", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-28T16:52:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-014", technicianId: "TECH-014", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.40", hoursWorked: "8.00", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-09-28T16:53:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-015", technicianId: "TECH-015", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.35", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-28T16:54:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-016", technicianId: "TECH-016", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.10", hoursWorked: "8.00", emergencyHours: "0.10", notes: "", lastSavedAt: "2026-09-28T16:55:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-017", technicianId: "TECH-017", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.25", hoursWorked: "8.00", emergencyHours: "0.25", notes: "", lastSavedAt: "2026-09-28T16:56:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-018", technicianId: "TECH-018", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.55", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-28T16:57:00", lastSavedBy: "USR-002" },
      { id: "WF-0928-019", technicianId: "TECH-019", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.35", hoursWorked: "8.00", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-09-28T16:58:00", lastSavedBy: "USR-002" },

      { id: "WF-0928-020", technicianId: "TECH-020", departmentId: "dept-hvac", entryStatus: "Worked", hoursProduced: "8.45", hoursWorked: "8.00", emergencyHours: "0.45", notes: "Two HVAC service calls.", lastSavedAt: "2026-09-28T17:00:00", lastSavedBy: "USR-002" }
    ]
  },

  {
    date: "2026-09-29",
    status: "submitted",
    revisionReason: "",
    submittedBy: "USR-003",
    submittedAt: "2026-09-29T17:05:00",
    lastSavedBy: "USR-003",
    lastSavedAt: "2026-09-29T17:02:00",
    entries: [
      { id: "WF-0929-002", technicianId: "TECH-002", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.45", hoursWorked: "8.00", emergencyHours: "0.45", notes: "", lastSavedAt: "2026-09-29T16:40:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-003", technicianId: "TECH-003", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.05", hoursWorked: "8.00", emergencyHours: "0.05", notes: "", lastSavedAt: "2026-09-29T16:41:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-004", technicianId: "TECH-004", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "7.50", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-29T16:42:00", lastSavedBy: "USR-003" },

      { id: "WF-0929-011", technicianId: "TECH-011", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "9.15", hoursWorked: "8.30", emergencyHours: "0.45", notes: "", lastSavedAt: "2026-09-29T16:45:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-012", technicianId: "TECH-012", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.35", hoursWorked: "8.00", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-09-29T16:46:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-013", technicianId: "TECH-013", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.00", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-29T16:47:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-014", technicianId: "TECH-014", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.50", hoursWorked: "8.00", emergencyHours: "0.50", notes: "", lastSavedAt: "2026-09-29T16:48:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-015", technicianId: "TECH-015", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.40", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-29T16:49:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-016", technicianId: "TECH-016", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.25", hoursWorked: "8.00", emergencyHours: "0.25", notes: "", lastSavedAt: "2026-09-29T16:50:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-017", technicianId: "TECH-017", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.40", hoursWorked: "8.00", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-09-29T16:51:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-018", technicianId: "TECH-018", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.55", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-29T16:52:00", lastSavedBy: "USR-003" },
      { id: "WF-0929-019", technicianId: "TECH-019", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.20", hoursWorked: "8.00", emergencyHours: "0.20", notes: "", lastSavedAt: "2026-09-29T16:53:00", lastSavedBy: "USR-003" },

      { id: "WF-0929-020", technicianId: "TECH-020", departmentId: "dept-hvac", entryStatus: "Worked", hoursProduced: "9.10", hoursWorked: "8.30", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-09-29T16:55:00", lastSavedBy: "USR-003" }
    ]
  },

  {
    date: "2026-09-30",
    status: "submitted",
    revisionReason: "",
    submittedBy: "USR-002",
    submittedAt: "2026-09-30T17:15:00",
    lastSavedBy: "USR-002",
    lastSavedAt: "2026-09-30T17:12:00",
    entries: [
      { id: "WF-0930-002", technicianId: "TECH-002", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.20", hoursWorked: "8.00", emergencyHours: "0.20", notes: "", lastSavedAt: "2026-09-30T16:40:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-003", technicianId: "TECH-003", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.35", hoursWorked: "8.00", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-09-30T16:41:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-004", technicianId: "TECH-004", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "7.55", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-30T16:42:00", lastSavedBy: "USR-002" },

      { id: "WF-0930-011", technicianId: "TECH-011", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "9.00", hoursWorked: "8.30", emergencyHours: "0.30", notes: "", lastSavedAt: "2026-09-30T16:45:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-012", technicianId: "TECH-012", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.10", hoursWorked: "8.00", emergencyHours: "0.10", notes: "", lastSavedAt: "2026-09-30T16:46:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-013", technicianId: "TECH-013", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.25", hoursWorked: "8.00", emergencyHours: "0.25", notes: "", lastSavedAt: "2026-09-30T16:47:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-014", technicianId: "TECH-014", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.40", hoursWorked: "8.00", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-09-30T16:48:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-015", technicianId: "TECH-015", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.45", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-30T16:49:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-016", technicianId: "TECH-016", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.30", hoursWorked: "8.00", emergencyHours: "0.30", notes: "", lastSavedAt: "2026-09-30T16:50:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-017", technicianId: "TECH-017", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.15", hoursWorked: "8.00", emergencyHours: "0.15", notes: "", lastSavedAt: "2026-09-30T16:51:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-018", technicianId: "TECH-018", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.50", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-09-30T16:52:00", lastSavedBy: "USR-002" },
      { id: "WF-0930-019", technicianId: "TECH-019", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.45", hoursWorked: "8.00", emergencyHours: "0.45", notes: "", lastSavedAt: "2026-09-30T16:53:00", lastSavedBy: "USR-002" },

      { id: "WF-0930-020", technicianId: "TECH-020", departmentId: "dept-hvac", entryStatus: "Worked", hoursProduced: "8.55", hoursWorked: "8.00", emergencyHours: "0.55", notes: "", lastSavedAt: "2026-09-30T16:55:00", lastSavedBy: "USR-002" }
    ]
  },

  {
    date: "2026-10-01",
    status: "submitted",
    revisionReason: "",
    submittedBy: "USR-003",
    submittedAt: "2026-10-01T17:18:00",
    lastSavedBy: "USR-003",
    lastSavedAt: "2026-10-01T17:15:00",
    entries: [
      { id: "WF-1001-002", technicianId: "TECH-002", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.40", hoursWorked: "8.00", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-10-01T16:40:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-003", technicianId: "TECH-003", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.10", hoursWorked: "8.00", emergencyHours: "0.10", notes: "", lastSavedAt: "2026-10-01T16:41:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-004", technicianId: "TECH-004", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "7.50", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-10-01T16:42:00", lastSavedBy: "USR-003" },

      { id: "WF-1001-011", technicianId: "TECH-011", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "9.20", hoursWorked: "8.30", emergencyHours: "0.50", notes: "Priority service work.", lastSavedAt: "2026-10-01T16:45:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-012", technicianId: "TECH-012", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.35", hoursWorked: "8.00", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-10-01T16:46:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-013", technicianId: "TECH-013", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.05", hoursWorked: "8.00", emergencyHours: "0.05", notes: "", lastSavedAt: "2026-10-01T16:47:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-014", technicianId: "TECH-014", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.50", hoursWorked: "8.00", emergencyHours: "0.50", notes: "", lastSavedAt: "2026-10-01T16:48:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-015", technicianId: "TECH-015", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.40", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-10-01T16:49:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-016", technicianId: "TECH-016", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.25", hoursWorked: "8.00", emergencyHours: "0.25", notes: "", lastSavedAt: "2026-10-01T16:50:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-017", technicianId: "TECH-017", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.30", hoursWorked: "8.00", emergencyHours: "0.30", notes: "", lastSavedAt: "2026-10-01T16:51:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-018", technicianId: "TECH-018", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.55", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-10-01T16:52:00", lastSavedBy: "USR-003" },
      { id: "WF-1001-019", technicianId: "TECH-019", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.45", hoursWorked: "8.00", emergencyHours: "0.45", notes: "", lastSavedAt: "2026-10-01T16:53:00", lastSavedBy: "USR-003" },

      { id: "WF-1001-020", technicianId: "TECH-020", departmentId: "dept-hvac", entryStatus: "Worked", hoursProduced: "9.05", hoursWorked: "8.30", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-10-01T16:55:00", lastSavedBy: "USR-003" }
    ]
  },

  {
    date: "2026-10-02",
    status: "revised",
    revisionReason: "Corrected emergency hours for Service department.",
    submittedBy: "USR-002",
    submittedAt: "2026-10-02T17:25:00",
    lastSavedBy: "USR-002",
    lastSavedAt: "2026-10-02T17:28:00",
    entries: [
      { id: "WF-1002-002", technicianId: "TECH-002", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.35", hoursWorked: "8.00", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-10-02T16:40:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-003", technicianId: "TECH-003", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "8.00", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-10-02T16:41:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-004", technicianId: "TECH-004", departmentId: "dept-automotive", entryStatus: "Worked", hoursProduced: "7.45", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-10-02T16:42:00", lastSavedBy: "USR-002" },

      { id: "WF-1002-011", technicianId: "TECH-011", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "9.10", hoursWorked: "8.30", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-10-02T16:45:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-012", technicianId: "TECH-012", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.30", hoursWorked: "8.00", emergencyHours: "0.30", notes: "", lastSavedAt: "2026-10-02T16:46:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-013", technicianId: "TECH-013", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.15", hoursWorked: "8.00", emergencyHours: "0.15", notes: "", lastSavedAt: "2026-10-02T16:47:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-014", technicianId: "TECH-014", departmentId: "dept-service", entryStatus: "Called Out", hoursProduced: "0.00", hoursWorked: "0.00", emergencyHours: "0.00", notes: "Called out sick.", lastSavedAt: "2026-10-02T16:48:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-015", technicianId: "TECH-015", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.20", hoursWorked: "8.00", emergencyHours: "0.20", notes: "", lastSavedAt: "2026-10-02T16:49:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-016", technicianId: "TECH-016", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.40", hoursWorked: "8.00", emergencyHours: "0.40", notes: "", lastSavedAt: "2026-10-02T16:50:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-017", technicianId: "TECH-017", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.25", hoursWorked: "8.00", emergencyHours: "0.25", notes: "", lastSavedAt: "2026-10-02T16:51:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-018", technicianId: "TECH-018", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "7.50", hoursWorked: "8.00", emergencyHours: "0.00", notes: "", lastSavedAt: "2026-10-02T16:52:00", lastSavedBy: "USR-002" },
      { id: "WF-1002-019", technicianId: "TECH-019", departmentId: "dept-service", entryStatus: "Worked", hoursProduced: "8.35", hoursWorked: "8.00", emergencyHours: "0.35", notes: "", lastSavedAt: "2026-10-02T16:53:00", lastSavedBy: "USR-002" },

      { id: "WF-1002-020", technicianId: "TECH-020", departmentId: "dept-hvac", entryStatus: "Worked", hoursProduced: "8.50", hoursWorked: "8.00", emergencyHours: "0.50", notes: "After-hours HVAC call.", lastSavedAt: "2026-10-02T16:55:00", lastSavedBy: "USR-002" }
    ]
  },

  {
    date: "2026-10-03",
    status: "open",
    revisionReason: "",
    submittedBy: null,
    submittedAt: null,
    lastSavedBy: "USR-002",
    lastSavedAt: "2026-10-03T08:15:00",
    entries: []
  }
];
function getWorkforceDailyByDate(date) {
  return workforceDailyData.find((day) => day.date === date);
}

function getWorkforceEntriesByDate(date) {
  return getWorkforceDailyByDate(date)?.entries ?? [];
}
const workforceData = workforceDailyData;

export {
  workforceData,
  workforceDailyData,
  getWorkforceDailyByDate,
  getWorkforceEntriesByDate
};

export default workforceDailyData;
