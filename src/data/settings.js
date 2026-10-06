const settings = {
  company: {
    name: "Advanced Tech",
    email: "",
    phone: "",
    address: "",
  },

  general: {
    currency: "USD",
    timezone: "America/Los_Angeles",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
  },

  calendar: {
    weekStartsOn: "Monday",

    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

    businessHours: {
      start: "08:00",
      end: "17:00",
    },
  },

  reporting: {
    defaultRange: "week",

    trendRanges: ["week", "mtd", "cm-vs-lm", "3-month", "6-month", "ytd"],
  },
};

export default settings;
