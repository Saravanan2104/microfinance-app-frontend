export const DEFAULT_PASSWORD = "12345";

export const initialManagers = [
  {
    id: "bm-001",
    firstName: "Anita",
    lastName: "Sharma",
    branch: "Bengaluru Central",
    email: "anita.sharma@womensgroupmfi.org",
    phone: "+91 98765 43210",
    status: "Active",
    joined: "12 Jan 2025",
  },
  {
    id: "bm-002",
    firstName: "Kavitha",
    lastName: "Reddy",
    branch: "Hyderabad East",
    email: "kavitha.reddy@womensgroupmfi.org",
    phone: "+91 98450 12233",
    status: "Active",
    joined: "24 Feb 2025",
  },
  {
    id: "bm-003",
    firstName: "Priya",
    lastName: "Iyer",
    branch: "Chennai North",
    email: "priya.iyer@womensgroupmfi.org",
    phone: "+91 99001 22110",
    status: "Inactive",
    joined: "07 Apr 2025",
  },
];

export const initialBranches = [
  {
    id: "br-001",
    name: "Bengaluru Central",
    code: "BLR-CEN",
    manager: "Anita Sharma",
    members: 428,
    activeLoans: 132,
    status: "Active",
    area: "Karnataka",
  },
  {
    id: "br-002",
    name: "Hyderabad East",
    code: "HYD-EAS",
    manager: "Kavitha Reddy",
    members: 386,
    activeLoans: 118,
    status: "Active",
    area: "Telangana",
  },
  {
    id: "br-003",
    name: "Chennai North",
    code: "CHN-NOR",
    manager: "Priya Iyer",
    members: 291,
    activeLoans: 74,
    status: "Review",
    area: "Tamil Nadu",
  },
];
