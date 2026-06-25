const BASE_URL = "/api";

// Common headers for all requests
export const getHeaders = (includeAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  };
  if (includeAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Global response handler to catch 401 Unauthorized errors and force login
const handleResponse = async (res, defaultErrMsg) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("access_token");
    window.location.href = "/";
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    let errMsg = defaultErrMsg;
    if (err.detail) {
      if (Array.isArray(err.detail)) {
        errMsg = err.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join(', ');
      } else if (typeof err.detail === "string") {
        errMsg = err.detail;
      } else if (typeof err.detail === "object") {
        errMsg = JSON.stringify(err.detail);
      }
    }
    throw new Error(errMsg);
  }
  return res.json();
};

// ── Members ──────────────────────────────────────────────────
export const getMembers = async () => {
  const res = await fetch(`${BASE_URL}/members`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch members");
};

export const getMember = async (memberId) => {
  const res = await fetch(`${BASE_URL}/members/${memberId}`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch member");
};

export const createMember = async (memberData) => {
  const res = await fetch(`${BASE_URL}/members`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(memberData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create member");
  }
  return res.json();
};

export const updateMember = async (memberId, memberData) => {
  const res = await fetch(`${BASE_URL}/members/${memberId}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(memberData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update member");
  }
  return res.json();
};

export const deleteMember = async (memberId) => {
  const res = await fetch(`${BASE_URL}/members/${memberId}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete member");
  }
  return res.json();
};

// ── Groups ────────────────────────────────────────────────────
export const getGroups = async () => {
  const res = await fetch(`${BASE_URL}/groups`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch groups");
};

export const getGroupMembers = async (groupId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch group members");
};

export const createGroup = async (groupData) => {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(groupData),
  });
  return handleResponse(res, "Failed to create group");
};

export const updateGroup = async (groupId, groupData) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify(groupData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update group");
  }
  return res.json();
};

export const assignHead = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/assign-head`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to assign head");
  }
  return res.json();
};

export const assignSubHead = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/assign-sub-head`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to assign sub head");
  }
  return res.json();
};

export const addMemberToGroup = async (groupId, memberId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ member_ids: [parseInt(memberId, 10)] })
  });
  return handleResponse(res, "Failed to add member to group");
};

export const removeMemberFromGroup = async (groupId, memberId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members/${memberId}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to remove member from group");
  }
  return res.json();
};

// ── Loans ──────────────────────────────────────────────────────
export const getLoanApplications = async () => {
  const res = await fetch(`${BASE_URL}/loan-applications`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch loan applications");
};

export const getLoanApplication = async (loanApplicationId) => {
  const res = await fetch(`${BASE_URL}/loan-applications/${loanApplicationId}`, {
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error("Failed to fetch loan application");
  return res.json();
};

export const getMemberLoans = async (memberId) => {
  const res = await fetch(`${BASE_URL}/loan-applications/member/${memberId}`, {
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error("Failed to fetch member loans");
  return res.json();
};

export const getCollectionReport = async () => {
  const res = await fetch(`${BASE_URL}/reports/collections`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch collection report");
};

export const getLoanReport = async () => {
  const res = await fetch(`${BASE_URL}/reports/loans`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch loan report");
};

export const getOverdueReport = async () => {
  const res = await fetch(`${BASE_URL}/reports/overdues`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch overdue report");
};

// ── Employees ──────────────────────────────────────────────────
export const getEmployees = async () => {
  const res = await fetch(`${BASE_URL}/employees`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch employees");
};

export const createEmployee = async (employeeData) => {
  const res = await fetch(`${BASE_URL}/employees`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(employeeData),
  });
  return handleResponse(res, "Failed to create employee");
};

export const assignBranch = async (branchId, employeeId) => {
  const res = await fetch(`${BASE_URL}/branch-assignments`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ branch_id: branchId, employee_id: parseInt(employeeId, 10) }),
  });
  return handleResponse(res, "Failed to assign branch");
};

export const getBranches = async () => {
  const res = await fetch(`${BASE_URL}/branches`, {
    headers: getHeaders(true),
  });
  return handleResponse(res, "Failed to fetch branches");
};

export default BASE_URL;