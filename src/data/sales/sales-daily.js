const salesDailyData = [
  // =====================================================
  // OCTOBER 03, 2026
  // =====================================================

  {
    id: "sale-001",
    date: "2026-10-03",

    type: "product",

    customerId: "cust-001",

    itemId: "item-001",

    quantity: 1,
    unitPrice: 185,
    discount: 0,
    tax: 0,
    total: 185,

    salespersonId: "user-003",
    technicianId: null,

    paymentMethod: "Card",
    paymentStatus: "Pending",

    notes: "Customer requested standard brake inspection.",

    equipment: [],

    createdAt: "2026-10-03T09:42:00",
    updatedAt: "2026-10-03T09:42:00",
  },

  {
    id: "sale-002",
    date: "2026-10-03",

    type: "product",

    customerId: "cust-002",

    itemId: "item-002",

    quantity: 1,
    unitPrice: 95,
    discount: 0,
    tax: 0,
    total: 95,

    salespersonId: "user-004",
    technicianId: null,

    paymentMethod: "Cash",
    paymentStatus: "Paid",

    notes: "Regular oil change service.",

    equipment: [],

    createdAt: "2026-10-03T10:18:00",
    updatedAt: "2026-10-03T10:18:00",
  },

  {
    id: "sale-003",
    date: "2026-10-03",

    type: "service",

    customerId: "cust-003",

    itemId: "item-006",

    quantity: 1,
    unitPrice: 125,
    discount: 0,
    tax: 0,

    equipment: [
      {
        id: "equipment-001",
        name: "Refrigerant",
        quantity: 1,
        price: 35,
      },
    ],

    serviceCharge: 125,
    equipmentTotal: 35,

    total: 160,

    salespersonId: "user-003",
    technicianId: "tech-003",

    paymentMethod: "Card",
    paymentStatus: "Pending",

    notes: "Diagnostic inspection with refrigerant replacement.",

    createdAt: "2026-10-03T11:05:00",
    updatedAt: "2026-10-03T11:05:00",
  },

  // =====================================================
  // OCTOBER 02, 2026
  // =====================================================

  {
    id: "sale-004",
    date: "2026-10-02",

    type: "product",

    customerId: "cust-004",

    itemId: "item-003",

    quantity: 1,
    unitPrice: 145,
    discount: 10,
    tax: 0,
    total: 135,

    salespersonId: "user-003",
    technicianId: null,

    paymentMethod: "Card",
    paymentStatus: "Paid",

    notes: "Fleet maintenance discount applied.",

    equipment: [],

    createdAt: "2026-10-02T09:15:00",
    updatedAt: "2026-10-02T09:15:00",
  },

  {
    id: "sale-005",
    date: "2026-10-02",

    type: "service",

    customerId: "cust-006",

    itemId: "item-008",

    quantity: 1,
    unitPrice: 110,
    discount: 0,
    tax: 0,

    equipment: [],

    serviceCharge: 110,
    equipmentTotal: 0,

    total: 110,

    salespersonId: "user-004",
    technicianId: "tech-004",

    paymentMethod: "Check",
    paymentStatus: "Pending",

    notes: "Scheduled preventive maintenance visit.",

    createdAt: "2026-10-02T13:40:00",
    updatedAt: "2026-10-02T13:40:00",
  },

  // =====================================================
  // OCTOBER 01, 2026
  // =====================================================

  {
    id: "sale-006",
    date: "2026-10-01",

    type: "product",

    customerId: "cust-005",

    itemId: "item-004",

    quantity: 1,
    unitPrice: 220,
    discount: 0,
    tax: 15,
    total: 235,

    salespersonId: "user-003",
    technicianId: null,

    paymentMethod: "Card",
    paymentStatus: "Paid",

    notes: "Battery replaced after inspection.",

    equipment: [],

    createdAt: "2026-10-01T08:55:00",
    updatedAt: "2026-10-01T08:55:00",
  },

  {
    id: "sale-007",
    date: "2026-10-01",

    type: "service",

    customerId: "cust-007",

    itemId: "item-009",

    quantity: 1,
    unitPrice: 150,
    discount: 0,
    tax: 0,

    equipment: [],

    serviceCharge: 150,
    equipmentTotal: 0,

    total: 150,

    salespersonId: "user-004",
    technicianId: "tech-003",

    paymentMethod: "Cash",
    paymentStatus: "Paid",

    notes: "Routine equipment inspection.",

    createdAt: "2026-10-01T14:20:00",
    updatedAt: "2026-10-01T14:20:00",
  },

  // =====================================================
  // SEPTEMBER 30, 2026
  // =====================================================

  {
    id: "sale-008",
    date: "2026-09-30",

    type: "product",

    customerId: "cust-008",

    itemId: "item-005",

    quantity: 2,
    unitPrice: 65,
    discount: 5,
    tax: 0,
    total: 125,

    salespersonId: "user-003",
    technicianId: null,

    paymentMethod: "Card",
    paymentStatus: "Paid",

    notes: "Two filters replaced.",

    equipment: [],

    createdAt: "2026-09-30T10:10:00",
    updatedAt: "2026-09-30T10:10:00",
  },

  {
    id: "sale-009",
    date: "2026-09-30",

    type: "service",

    customerId: "cust-001",

    itemId: "item-007",

    quantity: 1,
    unitPrice: 175,
    discount: 0,
    tax: 0,
    total: 175,

    salespersonId: "user-004",
    technicianId: "tech-004",

    paymentMethod: "Card",
    paymentStatus: "Pending",

    notes: "After-hours emergency request.",

    equipment: [],

    serviceCharge: 175,
    equipmentTotal: 0,

    createdAt: "2026-09-30T18:35:00",
    updatedAt: "2026-09-30T18:35:00",
  },

  // =====================================================
  // SEPTEMBER 29, 2026
  // =====================================================

  {
    id: "sale-010",
    date: "2026-09-29",

    type: "product",

    customerId: "cust-002",

    itemId: "item-002",

    quantity: 2,
    unitPrice: 95,
    discount: 10,
    tax: 0,
    total: 180,

    salespersonId: "user-003",
    technicianId: null,

    paymentMethod: "Check",
    paymentStatus: "Paid",

    notes: "Two vehicle fleet service.",

    equipment: [],

    createdAt: "2026-09-29T09:30:00",
    updatedAt: "2026-09-29T09:30:00",
  },
];

export default salesDailyData;