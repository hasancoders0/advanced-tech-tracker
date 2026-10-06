const employeesData = [
  {
    id: "EMP-001",
    employeeCode: "EMP-001",
    name: "Deomar Contreras",
    fullName: "Deomar Contreras",

    contact: {
      email: "deomar.contreras@example.com",
      phone: "(619) 555-0101",
    },

    address: {
      street: "1250 Main Street",
      city: "San Diego",
      state: "CA",
      zipCode: "92101",
      country: "USA",
    },

    employment: {
      departmentId: "dept-automotive",
      department: "Automotive",
      roleId: "role-senior-technician",
      role: "Senior Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2021-03-15",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-001-STATUS-001",
        status: "Active",
        date: "2021-03-15",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-002",
    employeeCode: "EMP-002",
    name: "Alan Rivera",
    fullName: "Alan Rivera",

    contact: {
      email: "alan.rivera@example.com",
      phone: "(619) 555-0102",
    },

    address: {
      street: "842 Harbor View Drive",
      city: "San Diego",
      state: "CA",
      zipCode: "92102",
      country: "USA",
    },

    employment: {
      departmentId: "dept-automotive",
      department: "Automotive",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2022-06-20",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-002-STATUS-001",
        status: "Active",
        date: "2022-06-20",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-003",
    employeeCode: "EMP-003",
    name: "Roberto Lopez Jr",
    fullName: "Roberto Lopez Jr",

    contact: {
      email: "roberto.lopez.jr@example.com",
      phone: "(619) 555-0103",
    },

    address: {
      street: "415 Palm Avenue",
      city: "San Diego",
      state: "CA",
      zipCode: "92103",
      country: "USA",
    },

    employment: {
      departmentId: "dept-automotive",
      department: "Automotive",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2023-01-09",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-003-STATUS-001",
        status: "Active",
        date: "2023-01-09",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-005",
    employeeCode: "EMP-005",
    name: "Mike Memmel",
    fullName: "Mike Memmel",

    contact: {
      email: "mike.memmel@example.com",
      phone: "(619) 555-0105",
    },

    address: {
      street: "728 Mission Road",
      city: "San Diego",
      state: "CA",
      zipCode: "92104",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-senior-technician",
      role: "Senior Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2020-08-17",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-005-STATUS-001",
        status: "Active",
        date: "2020-08-17",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-006",
    employeeCode: "EMP-006",
    name: "Roberto Lopez",
    fullName: "Roberto Lopez",

    contact: {
      email: "roberto.lopez@example.com",
      phone: "(619) 555-0106",
    },

    address: {
      street: "963 Market Street",
      city: "San Diego",
      state: "CA",
      zipCode: "92105",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2022-11-14",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-006-STATUS-001",
        status: "Active",
        date: "2022-11-14",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-007",
    employeeCode: "EMP-007",
    name: "Trevor McCarty",
    fullName: "Trevor McCarty",

    contact: {
      email: "trevor.mccarty@example.com",
      phone: "(619) 555-0107",
    },

    address: {
      street: "214 Sunset Boulevard",
      city: "San Diego",
      state: "CA",
      zipCode: "92106",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2023-04-03",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-007-STATUS-001",
        status: "Active",
        date: "2023-04-03",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-008",
    employeeCode: "EMP-008",
    name: "Julio Alatorre",
    fullName: "Julio Alatorre",

    contact: {
      email: "julio.alatorre@example.com",
      phone: "(619) 555-0108",
    },

    address: {
      street: "531 Adams Avenue",
      city: "San Diego",
      state: "CA",
      zipCode: "92107",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2023-07-10",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-008-STATUS-001",
        status: "Active",
        date: "2023-07-10",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-009",
    employeeCode: "EMP-009",
    name: "Rob Kile",
    fullName: "Rob Kile",

    contact: {
      email: "rob.kile@example.com",
      phone: "(619) 555-0109",
    },

    address: {
      street: "1180 University Avenue",
      city: "San Diego",
      state: "CA",
      zipCode: "92108",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2024-01-08",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-009-STATUS-001",
        status: "Active",
        date: "2024-01-08",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-010",
    employeeCode: "EMP-010",
    name: "Joe Rascon",
    fullName: "Joe Rascon",

    contact: {
      email: "joe.rascon@example.com",
      phone: "(619) 555-0110",
    },

    address: {
      street: "672 El Cajon Boulevard",
      city: "San Diego",
      state: "CA",
      zipCode: "92109",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2024-02-19",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-010-STATUS-001",
        status: "Active",
        date: "2024-02-19",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-011",
    employeeCode: "EMP-011",
    name: "Fabian Lopez",
    fullName: "Fabian Lopez",

    contact: {
      email: "fabian.lopez@example.com",
      phone: "(619) 555-0111",
    },

    address: {
      street: "392 College Avenue",
      city: "San Diego",
      state: "CA",
      zipCode: "92110",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2024-05-06",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-011-STATUS-001",
        status: "Active",
        date: "2024-05-06",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-012",
    employeeCode: "EMP-012",
    name: "Tanner Cummings",
    fullName: "Tanner Cummings",

    contact: {
      email: "tanner.cummings@example.com",
      phone: "(619) 555-0112",
    },

    address: {
      street: "845 Clairemont Drive",
      city: "San Diego",
      state: "CA",
      zipCode: "92111",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2024-08-12",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-012-STATUS-001",
        status: "Active",
        date: "2024-08-12",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-013",
    employeeCode: "EMP-013",
    name: "Joe Nathan",
    fullName: "Joe Nathan",

    contact: {
      email: "joe.nathan@example.com",
      phone: "(619) 555-0113",
    },

    address: {
      street: "1540 Rosecrans Street",
      city: "San Diego",
      state: "CA",
      zipCode: "92112",
      country: "USA",
    },

    employment: {
      departmentId: "dept-service",
      department: "Service",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2025-01-13",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-013-STATUS-001",
        status: "Active",
        date: "2025-01-13",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },

  {
    id: "EMP-014",
    employeeCode: "EMP-014",
    name: "Mike DiDonato",
    fullName: "Mike DiDonato",

    contact: {
      email: "mike.didonato@example.com",
      phone: "(619) 555-0114",
    },

    address: {
      street: "2260 Pacific Highway",
      city: "San Diego",
      state: "CA",
      zipCode: "92113",
      country: "USA",
    },

    employment: {
      departmentId: "dept-hvac",
      department: "HVAC",
      roleId: "role-technician",
      role: "Technician",
      employmentType: "Full Time",
      status: "Active",
      hireDate: "2025-03-10",
      terminationDate: null,
      notes: "",
    },

    statusHistory: [
      {
        id: "EMP-014-STATUS-001",
        status: "Active",
        date: "2025-03-10",
        reason: "Employee hired.",
        recordedBy: "System",
      },
    ],
  },
];

export { employeesData };

export default employeesData;