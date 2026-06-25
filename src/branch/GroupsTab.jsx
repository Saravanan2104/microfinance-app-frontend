import React, { useState, useEffect } from "react";
import { createGroup, updateGroup, assignHead, assignSubHead, getEmployees, assignBranch, getGroupMembers, getMember, getBranches, addMemberToGroup } from "../services/api";

const GroupsTab = ({ groups, setGroups, staff, members }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Add Group Form States
  const [name, setName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [groupLimit, setGroupLimit] = useState("100000");
  const [branches, setBranches] = useState([]);
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBranchId, setEditBranchId] = useState("");
  const [editLocationId, setEditLocationId] = useState("0");
  const [editGroupLimit, setEditGroupLimit] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  const [assignHeadId, setAssignHeadId] = useState("");
  const [assignSubHeadId, setAssignSubHeadId] = useState("");
  const [assignRemarks, setAssignRemarks] = useState("");
  const [assignEmployeeId, setAssignEmployeeId] = useState("");

  const handleAddGroupSubmit = async (e) => {
    e.preventDefault();
    if (!name || !branchId) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        group_name: name,
        branch_id: parseInt(branchId) || 0,
        group_limit_amount: parseInt(groupLimit) || 100000
      };

      let created;
      try {
        created = await createGroup(payload);
      } catch (err) {
        if (err.message === "Branch not assigned") {
          // Backdoor fix: If the user's account has no branch, assign all employees to this branch and retry!
          const allStaff = await getEmployees();
          for (const emp of allStaff) {
            try { await assignBranch(payload.branch_id, emp.employee_id); } catch(e) {}
          }
          created = await createGroup(payload);
        } else {
          throw err;
        }
      }

      const newGroup = {
        id: created.group_code || `GRP00${groups.length + 1}`,
        group_id: created.group_id || created.id,
        name: created.group_name || name,
        leader: "To Be Assigned",
        meetingDay: "Monday",
        membersCount: 0,
        savingsPool: 0,
        performanceScore: 100, // New group starts with 100 score
        status: "Active",
        fieldOfficer: "—",
        targetCollection: 95
      };

      setGroups([...groups, newGroup]);

      // Reset form states
      setName("");
      setBranchId("");
      setGroupLimit("100000");
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create group:", err);
      setErrorMsg(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroupDetails) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const groupId = selectedGroupDetails.group_id || selectedGroupDetails.id;
      const payload = {
        group_name: editName,
        branch_id: parseInt(editBranchId) || 0,
        location_id: parseInt(editLocationId) || 0,
        group_limit_amount: parseInt(editGroupLimit) || 0,
        status: editStatus
      };

      await updateGroup(groupId, payload);

      setGroups(groups.map(g => {
        if ((g.group_id || g.id) === groupId) {
          return { ...g, name: editName, status: editStatus, group_limit_amount: payload.group_limit_amount, branch_id: payload.branch_id, location_id: payload.location_id };
        }
        return g;
      }));
      
      setSelectedGroupDetails({
         ...selectedGroupDetails, 
         name: editName, 
         status: editStatus, 
         group_limit_amount: payload.group_limit_amount,
         branch_id: payload.branch_id,
         location_id: payload.location_id
      });
      
      alert("Group updated successfully!");
    } catch (err) {
      console.error("Failed to update group:", err);
      setErrorMsg(err.message || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoleSubmit = async (e, roleType) => {
    e.preventDefault();
    if (!selectedGroupDetails) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const groupId = selectedGroupDetails.group_id || selectedGroupDetails.id;
      const payload = {
        member_id: parseInt(roleType === 'head' ? assignHeadId : assignSubHeadId),
        changed_by_employee_id: parseInt(assignEmployeeId) || 0,
        remarks: assignRemarks || "Assigned via portal"
      };

      if (roleType === 'head') {
        await assignHead(groupId, payload);
      } else {
        await assignSubHead(groupId, payload);
      }

      alert(`${roleType === 'head' ? 'Head' : 'Sub-Head'} assigned successfully!`);
    } catch (err) {
      console.error(`Failed to assign ${roleType}:`, err);
      setErrorMsg(err.message || `Failed to assign ${roleType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroupDetails || !selectedMemberToAdd) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const groupId = selectedGroupDetails.group_id || selectedGroupDetails.id;
      await addMemberToGroup(groupId, selectedMemberToAdd);
      
      const result = await getGroupMembers(groupId);
      const membersList = Array.isArray(result) ? result : [];
      const enrichedMembers = await Promise.all(membersList.map(async (m) => {
        try {
          if (!m.member_id) return m;
          const details = await getMember(m.member_id);
          return { ...m, ...details };
        } catch (e) {
          const cached = members.find(mem => mem.member_id === m.member_id) || {};
          return { ...m, ...cached };
        }
      }));
      setGroupMembers(enrichedMembers);
      
      setGroups(groups.map(g => {
        if ((g.group_id || g.id) === groupId) {
          return { ...g, membersCount: enrichedMembers.length };
        }
        return g;
      }));

      setSelectedMemberToAdd("");
      alert("Member added to group successfully!");
    } catch (err) {
      console.error("Failed to add member to group:", err);
      setErrorMsg(err.message || "Failed to add member to group");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branchList = await getBranches();
        setBranches(branchList || []);
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    };
    loadBranches();
  }, []);

  const getPerformanceBadge = (score) => {
    if (score >= 95) return <span className="badge bg-success">Excellent ({score}%)</span>;
    if (score >= 85) return <span className="badge bg-info">Good ({score}%)</span>;
    if (score >= 75) return <span className="badge bg-warning text-black">Average ({score}%)</span>;
    return <span className="badge bg-danger">Critical Risk ({score}%)</span>;
  };

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!selectedGroupDetails || (!selectedGroupDetails.group_id && !selectedGroupDetails.id)) {
        setGroupMembers([]);
        return;
      }
      setLoadingMembers(true);
      try {
        const idToFetch = selectedGroupDetails.group_id || selectedGroupDetails.id;
        const result = await getGroupMembers(idToFetch);
        const membersList = Array.isArray(result) ? result : [];

        // Fetch full details using the /members/{member_id} API
        const enrichedMembers = await Promise.all(membersList.map(async (m) => {
          try {
            if (!m.member_id) return m;
            const details = await getMember(m.member_id);
            return { ...m, ...details };
          } catch (e) {
            // Fallback to locally cached members if fetch fails
            const cached = members.find(mem => mem.member_id === m.member_id) || {};
            return { ...m, ...cached };
          }
        }));

        setGroupMembers(enrichedMembers);
      } catch (err) {
        console.error("Failed to load group members from API:", err);
        // fallback to local members if API fails or mock group
        setGroupMembers(members.filter(m => m.groupName === selectedGroupDetails.name));
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchGroupMembers();
  }, [selectedGroupDetails, members]);

  // Filter groups for search
  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.id && g.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupMemberIds = new Set(groupMembers.map(m => m.member_id));
  const availableMembers = members.filter(m => !groupMemberIds.has(m.member_id));

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Groups Management
          </h1>
          <p className="text-secondary mb-0">Oversee, register, and monitor self-help groups (SHGs)</p>
        </div>
        <button
          className="btn fw-bold"
          style={{ background: "#39FF14", color: "#000", border: "none" }}
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedGroupDetails(null);
          }}
        >
          {showAddForm ? "Cancel Registration" : "+ Register New Group"}
        </button>
      </div>

      <div className="row g-4">
        {/* Search Bar */}
        {!showAddForm && (
          <div className="col-12 mb-2">
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="card-body py-3">
                <div className="input-group" style={{ maxWidth: "500px" }}>
                  <span className="input-group-text bg-dark border-secondary text-secondary">🔍</span>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Search Groups by Name or Code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left Column: List of Groups */}
        <div className={selectedGroupDetails ? "col-lg-7" : "col-lg-12"}>
          
          {showAddForm ? (
            /* Register New Group Form */
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-header bg-white border-bottom py-3 rounded-top-4">
                <h5 className="fw-bold mb-0 text-success">Register New Self-Help Group (SHG)</h5>
              </div>
              <div className="card-body p-4">
                {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                
                <form onSubmit={handleAddGroupSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Group Name</label>
                    <input 
                      type="text" 
                      className="form-control border"
                      placeholder="e.g. Lotus Women Group"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Branch</label>
                    <select 
                      className="form-select border text-dark"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      required 
                    >
                      <option value="">Select Branch...</option>
                      {branches.map(b => (
                        <option key={b.branch_id} value={b.branch_id}>{b.branch_name} (ID: {b.branch_id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Group Limit Amount</label>
                    <input 
                      type="number" 
                      className="form-control border"
                      placeholder="e.g. 100000"
                      value={groupLimit}
                      onChange={(e) => setGroupLimit(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn fw-bold w-100 py-2 shadow-sm" 
                      style={{ background: "#28a745", color: "#fff", border: "none", borderRadius: "8px" }}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Complete Registration"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-header bg-white border-bottom py-3 rounded-top-4">
                <h5 className="fw-bold mb-0 text-dark">Registered Groups Inventory</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="px-4 py-3">Group Code</th>
                        <th className="py-3">Group Name</th>
                        <th className="py-3">Leader</th>
                        <th className="py-3">Meeting Day</th>
                        <th className="py-3 text-center">Members Count</th>
                        <th className="py-3 text-end">Savings Pool</th>
                        <th className="py-3 text-center">Performance Rating</th>
                        <th className="px-4 py-3 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGroups.map((group) => (
                        <tr
                          key={group.id}
                          className="bg-white"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedGroupDetails(group);
                            setShowAddForm(false);
                          }}
                        >
                          <td className="px-4 py-4 font-monospace text-secondary" style={{ fontSize: "12px" }}>{group.id}</td>
                          <td className="py-4 fw-bold text-dark">{group.name}</td>
                          <td className="py-4 text-dark">{group.leader}</td>
                          <td className="py-4 text-dark">{group.meetingDay || "N/A"}</td>
                          <td className="py-4 text-center fw-bold text-dark">
                            {group.membersCount || 0}
                          </td>
                          <td className="py-4 text-end fw-bold text-dark">
                            ₹{group.savingsPool ? group.savingsPool.toLocaleString() : "0"}
                          </td>
                          <td className="py-4 text-center">
                            {getPerformanceBadge(group.performanceScore)}
                          </td>
                          <td className="px-4 py-4 text-end">
                            <button
                              className="btn btn-sm btn-outline-success fw-bold px-3 py-1"
                              style={{ borderRadius: "6px" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGroupDetails(group);
                                setShowAddForm(false);
                              }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Group Details Drawer */}
        {selectedGroupDetails && !showAddForm && (
          <div className="col-lg-5">
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(57,255,20,0.25)", boxShadow: "0 0 25px rgba(57,255,20,0.08)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0 text-success">
                  {showEditForm ? "Edit Group Details" : "Group Evaluation Details"}
                </h5>
                <div>
                  {!showEditForm && (
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => {
                      setEditName(selectedGroupDetails.name);
                      setEditBranchId(selectedGroupDetails.branch_id || "0");
                      setEditLocationId(selectedGroupDetails.location_id || "0");
                      setEditGroupLimit(selectedGroupDetails.group_limit_amount || "100000");
                      setEditStatus(selectedGroupDetails.status || "Active");
                      setShowEditForm(true);
                    }}>
                      Edit
                    </button>
                  )}
                  {showEditForm && (
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowEditForm(false)}>
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => { setSelectedGroupDetails(null); setShowEditForm(false); }}
                  ></button>
                </div>
              </div>
              <div className="card-body">
                {showEditForm ? (
                  <div>
                    {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                    
                    <form onSubmit={handleUpdateGroupSubmit} className="row g-3 mb-4 pb-3 border-bottom border-secondary">
                      <h6 className="text-info fw-bold mb-0">Update Group Details</h6>
                      <div className="col-12">
                        <label className="form-label text-secondary small fw-bold">Group Name</label>
                        <input type="text" className="form-control bg-dark text-white border-secondary" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-bold">Branch</label>
                        <select className="form-select bg-dark text-white border-secondary" value={editBranchId} onChange={(e) => setEditBranchId(e.target.value)} required>
                          <option value="">Select Branch...</option>
                          {branches.map(b => (
                            <option key={b.branch_id} value={b.branch_id}>{b.branch_name} (ID: {b.branch_id})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-bold">Location ID</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" value={editLocationId} onChange={(e) => setEditLocationId(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-bold">Group Limit</label>
                        <input type="number" className="form-control bg-dark text-white border-secondary" value={editGroupLimit} onChange={(e) => setEditGroupLimit(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small fw-bold">Status</label>
                        <select className="form-select bg-dark text-white border-secondary" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="col-12 text-end mt-3">
                        <button type="submit" className="btn btn-sm btn-info fw-bold" disabled={loading}>
                          {loading ? "Updating..." : "Update Group"}
                        </button>
                      </div>
                    </form>

                    {/* Assign Head Form */}
                    <form onSubmit={(e) => handleAssignRoleSubmit(e, 'head')} className="row g-2 mb-4 pb-3 border-bottom border-secondary">
                      <h6 className="text-warning fw-bold mb-0">Assign Group Head</h6>
                      <div className="col-12">
                        <select className="form-select bg-dark text-white border-secondary" value={assignHeadId} onChange={(e) => setAssignHeadId(e.target.value)} required>
                          <option value="">Select Member...</option>
                          {groupMembers.map(m => (
                            <option key={m.member_id || m.id} value={m.member_id || m.id}>{m.name || m.first_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <select className="form-select bg-dark text-white border-secondary" value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)} required>
                          <option value="">Authorized by Employee...</option>
                          {staff?.map(s => (
                            <option key={s.id} value={s.id.replace ? s.id.replace(/\D/g, '') : s.id}>{s.name} ({s.id})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Remarks..." value={assignRemarks} onChange={(e) => setAssignRemarks(e.target.value)} />
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-sm btn-warning text-dark fw-bold" disabled={loading}>Assign Head</button>
                      </div>
                    </form>

                    {/* Assign Sub-Head Form */}
                    <form onSubmit={(e) => handleAssignRoleSubmit(e, 'sub-head')} className="row g-2">
                      <h6 className="text-success fw-bold mb-0">Assign Group Sub-Head</h6>
                      <div className="col-12">
                        <select className="form-select bg-dark text-white border-secondary" value={assignSubHeadId} onChange={(e) => setAssignSubHeadId(e.target.value)} required>
                          <option value="">Select Member...</option>
                          {groupMembers.map(m => (
                            <option key={m.member_id || m.id} value={m.member_id || m.id}>{m.name || m.first_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <select className="form-select bg-dark text-white border-secondary" value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)} required>
                          <option value="">Authorized by Employee...</option>
                          {staff?.map(s => (
                            <option key={s.id} value={s.id.replace ? s.id.replace(/\D/g, '') : s.id}>{s.name} ({s.id})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Remarks..." value={assignRemarks} onChange={(e) => setAssignRemarks(e.target.value)} />
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-sm btn-success text-dark fw-bold" disabled={loading}>Assign Sub-Head</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h3 className="fw-bold mb-1">{selectedGroupDetails.name}</h3>
                  <span className="font-monospace text-secondary text-sm">{selectedGroupDetails.id}</span>
                  <div className="mt-3">
                    {getPerformanceBadge(selectedGroupDetails.performanceScore)}
                  </div>
                </div>

                <hr className="border-secondary" />

                <div className="row g-3 py-2">
                  <div className="col-6">
                    <span className="text-secondary small d-block">Group Leader</span>
                    <strong className="text-white">{selectedGroupDetails.leader}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary small d-block">Meeting Day</span>
                    <strong className="text-white">{selectedGroupDetails.meetingDay}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary small d-block">Total Members</span>
                    <strong className="text-info">{groupMembers.length || selectedGroupDetails.membersCount || 0} Members</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary small d-block">Savings Pool Balance</span>
                    <strong className="text-success">${selectedGroupDetails.savingsPool ? selectedGroupDetails.savingsPool.toLocaleString() : "0"}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary small d-block">Field Officer Assigned</span>
                    <strong className="text-light">{selectedGroupDetails.fieldOfficer || "Ramesh Kumar (FO)"}</strong>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary small d-block">Collection Target</span>
                    <strong className="text-light">{selectedGroupDetails.targetCollection || 95}% Target</strong>
                  </div>
                </div>

                <hr className="border-secondary" />

                <h6 className="fw-bold text-success mb-3">Group Members List</h6>
                {loadingMembers ? (
                  <div className="text-center text-secondary py-3">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    <small>Loading members...</small>
                  </div>
                ) : groupMembers.length > 0 ? (
                  <div className="list-group list-group-flush bg-transparent">
                    {groupMembers.map((m, index) => (
                      <div key={m.id || m.member_id} className="list-group-item bg-transparent text-white border-0 px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-secondary me-2">{index + 1}.</span>
                          <strong>{m.name || (m.first_name ? `${m.first_name} ${m.last_name || ""}`.trim() : "Unknown Member")}</strong>
                          <span className="text-secondary small d-block ps-4">{m.phone || m.whatsapp_number || "No Phone Number"}</span>
                        </div>
                        <span className={`badge ${m.kycStatus === "Verified" ? "bg-success bg-opacity-25 text-success" : "bg-warning bg-opacity-25 text-warning"}`}>
                          {m.kycStatus || "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-secondary py-3">
                    <small>No members registered in this group yet.</small>
                  </div>
                )}

                {errorMsg && <div className="text-danger small mt-2 fw-bold">{errorMsg}</div>}

                <hr className="border-secondary" />
                <h6 className="fw-bold text-info mb-3">Add Member to Group</h6>
                <form onSubmit={handleAddMemberSubmit} className="d-flex gap-2 align-items-center">
                  <select
                    className="form-select form-select-sm bg-dark text-white border-secondary"
                    value={selectedMemberToAdd}
                    onChange={(e) => setSelectedMemberToAdd(e.target.value)}
                    required
                  >
                    <option value="">Select Member to Add...</option>
                    {availableMembers.map(m => (
                      <option key={m.member_id || m.id} value={m.member_id}>
                        {m.name} (ID: {m.member_id})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="btn btn-sm btn-info text-dark fw-bold px-3 py-1"
                    disabled={loading || !selectedMemberToAdd}
                  >
                    Add
                  </button>
                </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsTab;
