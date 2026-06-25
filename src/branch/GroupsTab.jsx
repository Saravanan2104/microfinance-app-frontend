import React, { useState, useEffect } from "react";
import { createGroup, getGroupMembers, getMember } from "../services/api";

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
  const [managerId, setManagerId] = useState("");
  const [groupLimit, setGroupLimit] = useState("100000");

  const handleAddGroupSubmit = async (e) => {
    e.preventDefault();
    if (!name || !branchId || !managerId) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        group_code: `GRP${Date.now()}`,
        group_name: name,
        branch_id: parseInt(branchId) || 0,
        location_id: 0,
        relationship_manager_employee_id: parseInt(managerId) || 0,
        group_limit_amount: parseInt(groupLimit) || 100000
      };

      const created = await createGroup(payload);

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
        fieldOfficer: managerId,
        targetCollection: 95
      };

      setGroups([...groups, newGroup]);

      // Reset form states
      setName("");
      setBranchId("");
      setManagerId("");
      setGroupLimit("100000");
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create group:", err);
      setErrorMsg(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

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

        {/* Left Column: List of Groups or Add Form */}
        <div className={selectedGroupDetails ? "col-lg-7" : "col-lg-12"}>

          {showAddForm ? (
            /* Add New Group Card */
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(57,255,20,0.2)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0 text-success">Register New Self-Help Group (SHG)</h5>
              </div>
              <div className="card-body">
                {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                <form onSubmit={handleAddGroupSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Group Name</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Lotus Women Group"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Branch ID</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. 1"
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Relationship Manager Employee ID</label>
                    <select
                      className="form-select bg-dark text-white border-secondary"
                      value={managerId}
                      onChange={(e) => setManagerId(e.target.value)}
                      required
                    >
                      <option value="">Select Manager...</option>
                      {staff?.map(s => (
                        <option key={s.id} value={s.id.replace ? s.id.replace(/\\D/g, '') : s.id}>
                          {s.name} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Group Limit Amount</label>
                    <input
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="100000"
                      value={groupLimit}
                      onChange={(e) => setGroupLimit(e.target.value)}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn fw-bold"
                      style={{ background: "#39FF14", color: "#000", border: "none" }}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Complete Registration"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Groups List Table Card */
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0">Registered Groups Inventory</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                    <thead className="table-light bg-opacity-10 text-secondary">
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
                          className="border-bottom border-dark"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedGroupDetails(group);
                            setShowAddForm(false);
                          }}
                        >
                          <td className="px-4 py-3 font-monospace text-secondary">{group.id}</td>
                          <td className="py-3 fw-bold text-white">{group.name}</td>
                          <td className="py-3 text-light">{group.leader}</td>
                          <td className="py-3 text-secondary">{group.meetingDay || "N/A"}</td>
                          <td className="py-3 text-center fw-bold text-info">
                            {group.membersCount || 0}
                          </td>
                          <td className="py-3 text-end text-success fw-bold">
                            ${group.savingsPool ? group.savingsPool.toLocaleString() : "0"}
                          </td>
                          <td className="py-3 text-center">
                            {getPerformanceBadge(group.performanceScore)}
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button
                              className="btn btn-sm btn-outline-info"
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
                <h5 className="fw-bold mb-0 text-success">Group Evaluation Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedGroupDetails(null)}
                ></button>
              </div>
              <div className="card-body">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsTab;
