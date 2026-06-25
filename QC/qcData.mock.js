// src/components/dashboard/qc/qcData.mock.js

export const qcChecklistData = [
  {
    id: 1,
    item: "KYC & Identity Match",
    checkedBy: "System / QC",
    status: "Passed",
    riskLevel: "High",
    notes: "Aadhaar/ID photo matches live selfie. No name mismatches."
  },
  {
    id: 2,
    item: "Field Verification Report",
    checkedBy: "RM / QC",
    status: "Passed",
    riskLevel: "Medium",
    notes: "Geotagged photo of the borrower's business shop verified."
  },
  {
    id: 3,
    item: "Credit Bureau (CIBIL/Equifax)",
    checkedBy: "System",
    status: "Passed",
    riskLevel: "High",
    notes: "Total active MFI loans do not exceed regulatory limits (No over-indebtedness)."
  }
];

export const membersListData = [
  {
    id: 1,
    item: "Rajeshwari S.",
    checkedBy: "RM: Kumar A.",
    status: "Active",
    riskLevel: "Low",
    notes: "Tailoring business owner. Fully verified group leader."
  },
  {
    id: 2,
    item: "Latha Mahesh",
    checkedBy: "RM: Kumar A.",
    status: "Active",
    riskLevel: "Low",
    notes: "Small grocery shop setup. Co-signer verified."
  },
  {
    id: 3,
    item: "Meena Pravin",
    checkedBy: "RM: Suresh M.",
    status: "Pending",
    riskLevel: "Medium",
    notes: "Home bakery startup application. Document verification pending."
  }
];

export const activeLoansData = [
  {
    id: 1,
    item: "Loan Application #1042",
    checkedBy: "Amt: $20,000",
    status: "Disbursed",
    riskLevel: "Low",
    notes: "Purpose: Tailoring Machine Purchase. Term: 12 Months."
  },
  {
    id: 2,
    item: "Loan Application #1039",
    checkedBy: "Amt: $15,000",
    status: "Disbursed",
    riskLevel: "Low",
    notes: "Purpose: Small Grocery Shop Setup. Term: 12 Months."
  }
];