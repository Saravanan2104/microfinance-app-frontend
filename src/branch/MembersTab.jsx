import React, { useState } from "react";

const MembersTab = ({ members, setMembers, groups }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  // Perform client-side verification
  const handleVerifyKYC = (id) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, kycStatus: "Verified" };
      }
      return m;
    });
    setMembers(updated);
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({ ...selectedMember, kycStatus: "Verified" });
    }
  };

  // Reject KYC
  const handleRejectKYC = (id) => {
    const updated = members.map(m => {
      if (m.id === id) {
        return { ...m, kycStatus: "Action Required" };
      }
      return m;
    });
    setMembers(updated);
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({ ...selectedMember, kycStatus: "Action Required" });
    }
  };

  // Filter members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.phone.includes(searchQuery);
    const matchesGroup = selectedGroupFilter === "" || m.groupName === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Members Registry
          </h1>
          <p className="text-secondary mb-0">Record and manage group members information, savings, and KYC documents</p>
        </div>
        
      </div>

      {/* Search and Filters Bar */}
      
        <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="card-body py-3">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">🔍</span>
                  <input 
                    type="text" 
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Search by Member Name, Code or Phone Number..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select 
                  className="form-select bg-dark text-white border-secondary"
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                >
                  <option value="">-- All Groups --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      

      <div className="row g-4">
        {/* Left Column: Form or Table */}
        <div className={selectedMember ? "col-lg-7" : "col-lg-12"}>
          
          
            {/* Members Inventory Card */}
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0">Member Directory</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                    <thead className="table-light bg-opacity-10 text-secondary">
                      <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="py-3">Member Name</th>
                        <th className="py-3">Phone</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Group Name</th>
                        <th className="py-3 text-end">Active Loan</th>
                        <th className="py-3 text-center">KYC Validation</th>
                        <th className="px-4 py-3 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member) => (
                        <tr 
                          key={member.id} 
                          className="border-bottom border-dark"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedMember(member);
                            
                          }}
                        >
                          <td className="px-4 py-3 font-monospace text-secondary" style={{ fontSize: "12px" }}>{member.id}</td>
                          <td className="py-3 fw-bold text-white">{member.name}</td>
                          <td className="py-3 text-light">{member.phone}</td>
                          <td className="py-3 text-secondary text-truncate" style={{ maxWidth: "150px" }}>{member.email || "N/A"}</td>
                          <td className="py-3 text-info fw-bold">{member.groupName || member.group_name || "N/A"}</td>
                          <td className="py-3 text-end text-danger font-monospace fw-bold">
                            ${member.activeLoan ? member.activeLoan.toLocaleString() : "0"}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`badge ${
                              member.kycStatus === "Verified" ? "bg-success" : 
                              member.kycStatus === "Pending Review" ? "bg-warning text-black" : "bg-danger"
                            }`}>
                              {member.kycStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member);
                                
                              }}
                            >
                              Review Files
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredMembers.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center py-4 text-secondary">
                            No members found matching the filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          

        </div>

        {/* Right Column: Member Details & KYC Checker */}
        {selectedMember && (
          <div className="col-lg-5">
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(57,255,20,0.25)", boxShadow: "0 0 25px rgba(57,255,20,0.08)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0 text-success">KYC Verification Dashboard</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedMember(null)}
                ></button>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-dark d-inline-flex justify-content-center align-items-center border border-success mb-2" style={{ width: "64px", height: "64px" }}>
                    <span className="fs-3">👤</span>
                  </div>
                  <h4 className="fw-bold mb-0">{selectedMember.name}</h4>
                  <small className="text-secondary font-monospace">{selectedMember.id}</small>
                  <div className="mt-2">
                    <span className={`badge ${
                      selectedMember.kycStatus === "Verified" ? "bg-success" : 
                      selectedMember.kycStatus === "Pending Review" ? "bg-warning text-black" : "bg-danger"
                    }`}>
                      {selectedMember.kycStatus}
                    </span>
                  </div>
                </div>

                <hr className="border-secondary" />

                <h6 className="text-success fw-bold mb-2">Member Profiles</h6>
                <div className="row g-2 mb-4" style={{ fontSize: "14px" }}>
                  <div className="col-4 text-secondary">Phone:</div>
                  <div className="col-8 text-light">{selectedMember.phone}</div>
                  
                  <div className="col-4 text-secondary">Email:</div>
                  <div className="col-8 text-light">{selectedMember.email || "N/A"}</div>

                  <div className="col-4 text-secondary">Group Name:</div>
                  <div className="col-8 text-info fw-bold">{selectedMember.groupName || selectedMember.group_name || "N/A"}</div>

                  <div className="col-4 text-secondary">Savings Pool:</div>
                  <div className="col-8 text-success fw-bold">${selectedMember.savingsBalance ? selectedMember.savingsBalance.toLocaleString() : "0"}</div>

                  <div className="col-4 text-secondary">Active Debt:</div>
                  <div className="col-8 text-danger fw-bold">${selectedMember.activeLoan ? selectedMember.activeLoan.toLocaleString() : "0"}</div>
                </div>

                <hr className="border-secondary" />

                <h6 className="text-success fw-bold mb-3">KYC Documents Submitted</h6>
                <div className="p-3 bg-dark rounded border border-secondary mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold text-light">{selectedMember.kycType || "Aadhar Card"}</span>
                    <span className="font-monospace text-secondary" style={{ fontSize: "12px" }}>{selectedMember.kycNumber || "XXXX-XXXX-XXXX"}</span>
                  </div>
                  <div className="text-center py-4 bg-black rounded border border-dashed border-secondary mb-2" style={{ borderStyle: "dashed" }}>
                    <span className="text-secondary" style={{ fontSize: "28px" }}>📄</span>
                    <span className="text-secondary small d-block mt-1">document_preview_mock.pdf</span>
                    <small className="text-secondary-emphasis font-monospace" style={{ fontSize: "10px" }}>Size: 1.2 MB</small>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  {selectedMember.kycStatus !== "Verified" ? (
                    <>
                      <button 
                        className="btn btn-success fw-bold flex-grow-1"
                        onClick={() => handleVerifyKYC(selectedMember.id)}
                      >
                        Approve Document KYC
                      </button>
                      <button 
                        className="btn btn-outline-danger fw-bold"
                        onClick={() => handleRejectKYC(selectedMember.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <div className="alert alert-success text-center w-100 py-2 mb-0">
                      <strong>Verified Verification Complete ✓</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersTab;
