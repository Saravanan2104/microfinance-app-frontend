const BASE_URL = "https://thread-quilt-unworn.ngrok-free.dev";

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

// ── Members ──────────────────────────────────────────────────
export const getMembers = async () => {
  const res = await fetch(`${BASE_URL}/members`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
};

export const getMember = async (memberId) => {
  const res = await fetch(`${BASE_URL}/members/${memberId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch member");
  return res.json();
};

export const createMember = async (memberData) => {
  const res = await fetch(`${BASE_URL}/members`, {
    method: "POST",
    headers: getHeaders(),
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
    headers: getHeaders(),
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
    headers: getHeaders(),
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
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
};

export const getGroupMembers = async (groupId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch group members");
  return res.json();
};

export const createGroup = async (groupData) => {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(groupData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create group");
  }
  return res.json();
};

export const updateGroup = async (groupId, groupData) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(groupData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update group");
  }
  return res.json();
};

export const addMemberToGroup = async (groupId, memberId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members?member_id=${memberId}`, {
    method: "POST",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add member to group");
  }
  return res.json();
};

export const removeMemberFromGroup = async (groupId, memberId) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members/${memberId}`, {
    method: "DELETE",
    headers: getHeaders(),
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
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch loan applications");
  return res.json();
};

export const getLoanApplication = async (loanApplicationId) => {
  const res = await fetch(`${BASE_URL}/loan-applications/${loanApplicationId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch loan application");
  return res.json();
};

export const getMemberLoans = async (memberId) => {
  const res = await fetch(`${BASE_URL}/loan-applications/member/${memberId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch member loans");
  return res.json();
};

export default BASE_URL;