import React, { useState, useEffect } from "react";
import { getLoanApplications } from "../services/api";

const LoansTab = ({ members, groups }) => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await getLoanApplications();
        setLoanApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load loan applications:", err);
        setErrorMsg("Could not load loan applications from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const getMemberName = (id) => {
    const member = members?.find(m => m.member_id === id);
    return member ? member.name : `Member #${id}`;
  };

  const getGroupName = (id) => {
    const group = groups?.find(g => g.group_id === id);
    return group ? group.name : `Group #${id}`;
  };

  // Filter loans
  const filteredLoans = loanApplications.filter(l => {
    const query = searchQuery.toLowerCase();
    const memName = getMemberName(l.member_id).toLowerCase();
    const grpName = getGroupName(l.group_id).toLowerCase();
    return (
      (l.application_number && l.application_number.toLowerCase().includes(query)) ||
      (l.loan_purpose && l.loan_purpose.toLowerCase().includes(query)) ||
      memName.includes(query) ||
      grpName.includes(query) ||
      (l.member_id && String(l.member_id).includes(query)) ||
      (l.group_id && String(l.group_id).includes(query))
    );
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-warning text-black">Pending</span>;
    }
  };

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Loan Applications
          </h1>
          <p className="text-secondary mb-0">Track and manage group member loan applications and disbursements</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="card-body py-3">
          <div className="input-group" style={{ maxWidth: "500px" }}>
            <span className="input-group-text bg-dark border-secondary text-secondary">🔍</span>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary"
              placeholder="Search by App No, Purpose, Member ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: List of Loans */}
        <div className={selectedLoan ? "col-lg-7" : "col-lg-12"}>
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Applications Directory</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status"></div>
                </div>
              ) : errorMsg ? (
                <div className="alert alert-danger m-3">{errorMsg}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                    <thead className="table-light bg-opacity-10 text-secondary">
                      <tr>
                        <th className="px-4 py-3">App No.</th>
                        <th className="py-3">Member</th>
                        <th className="py-3">Group</th>
                        <th className="py-3 text-end">Amount</th>
                        <th className="py-3">Purpose</th>
                        <th className="py-3">Date</th>
                        <th className="py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLoans.map((loan) => (
                        <tr 
                          key={loan.loan_application_id} 
                          className="border-bottom border-dark"
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedLoan(loan)}
                        >
                          <td className="px-4 py-3 font-monospace text-secondary" style={{ fontSize: "12px" }}>
                            {loan.application_number}
                          </td>
                          <td className="py-3 fw-bold text-white">
                            {getMemberName(loan.member_id)}
                          </td>
                          <td className="py-3 text-info">
                            {getGroupName(loan.group_id)}
                          </td>
                          <td className="py-3 text-end text-success fw-bold font-monospace">
                            ${loan.requested_amount?.toLocaleString() || "0"}
                          </td>
                          <td className="py-3 text-light text-truncate" style={{ maxWidth: "150px" }}>
                            {loan.loan_purpose}
                          </td>
                          <td className="py-3 text-secondary" style={{ fontSize: "13px" }}>
                            {loan.applied_date ? new Date(loan.applied_date).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3 text-center">
                            {getStatusBadge(loan.application_status)}
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLoan(loan);
                              }}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredLoans.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center py-4 text-secondary">
                            No applications found matching the criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Loan Details Sidebar */}
        {selectedLoan && (
          <div className="col-lg-5">
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(57,255,20,0.25)", boxShadow: "0 0 25px rgba(57,255,20,0.08)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0 text-success">Application Details</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setSelectedLoan(null)}
                ></button>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-dark d-inline-flex justify-content-center align-items-center border border-success mb-2" style={{ width: "64px", height: "64px" }}>
                    <span className="fs-3">📄</span>
                  </div>
                  <h4 className="fw-bold mb-0 text-success">
                    ${selectedLoan.requested_amount?.toLocaleString() || "0"}
                  </h4>
                  <small className="text-secondary font-monospace">{selectedLoan.application_number}</small>
                  <div className="mt-2">
                    {getStatusBadge(selectedLoan.application_status)}
                  </div>
                </div>

                <hr className="border-secondary" />

                <h6 className="text-success fw-bold mb-3">Applicant Information</h6>
                <div className="row g-2 mb-4" style={{ fontSize: "14px" }}>
                  <div className="col-5 text-secondary">Member Name:</div>
                  <div className="col-7 text-light fw-bold">{getMemberName(selectedLoan.member_id)}</div>
                  
                  <div className="col-5 text-secondary">Group Affiliation:</div>
                  <div className="col-7 text-info fw-bold">{getGroupName(selectedLoan.group_id)}</div>

                  <div className="col-5 text-secondary">Applied Date:</div>
                  <div className="col-7 text-light">
                    {selectedLoan.applied_date ? new Date(selectedLoan.applied_date).toLocaleString() : "N/A"}
                  </div>
                </div>

                <hr className="border-secondary" />

                <h6 className="text-success fw-bold mb-3">Loan Details</h6>
                <div className="row g-2 mb-4" style={{ fontSize: "14px" }}>
                  <div className="col-5 text-secondary">Requested Amount:</div>
                  <div className="col-7 text-success fw-bold">${selectedLoan.requested_amount?.toLocaleString() || "0"}</div>
                  
                  <div className="col-5 text-secondary">Purpose:</div>
                  <div className="col-7 text-light">{selectedLoan.loan_purpose || "N/A"}</div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button className="btn fw-bold flex-grow-1" style={{ background: "#39FF14", color: "#000", border: "none" }}>
                    Approve Loan
                  </button>
                  <button className="btn btn-outline-danger fw-bold">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansTab;
