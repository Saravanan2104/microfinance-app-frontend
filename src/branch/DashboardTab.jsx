import React, { useState } from "react";

const DashboardTab = ({
  groups,
  members,
  loanApplications,
  setLoanApplications,
  disbursements,
  setDisbursements,
  collections,
  setCollections,
  alerts,
  setAlerts,
  staff
}) => {
  const [newColAmount, setNewColAmount] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedFO, setSelectedFO] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Calculate quick metrics
  const totalGroups = groups.length;
  const totalMembers = members.length;
  const activeLoansCount = members.filter(m => m.activeLoan > 0).length;
  const pendingLoansCount = loanApplications.filter(l => l.status === "Pending").length;
  const totalPortfolio = members.reduce((sum, m) => sum + (m.activeLoan || 0), 0) + 
                         loanApplications.filter(l => l.status === "Approved").reduce((sum, l) => sum + l.amount, 0);
  
  const handleApproveLoan = (id) => {
    const updated = loanApplications.map(app => {
      if (app.id === id) {
        // Add to disbursements
        const newDisb = {
          id: `DISB${Math.floor(100 + Math.random() * 900)}`,
          memberName: app.memberName,
          amount: app.amount,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
          status: "Approved (Awaiting Release)"
        };
        setDisbursements(prev => [newDisb, ...prev]);

        // Add success alert
        const newAlert = {
          id: Date.now(),
          type: "success",
          message: `Loan of $${app.amount.toLocaleString()} for ${app.memberName} has been approved.`,
          time: "Just now",
          category: "Approvals"
        };
        setAlerts(prev => [newAlert, ...prev]);

        return { ...app, status: "Approved" };
      }
      return app;
    });
    setLoanApplications(updated);
  };

  const handleRejectLoan = (id, name, amount) => {
    const updated = loanApplications.map(app => {
      if (app.id === id) {
        const newAlert = {
          id: Date.now(),
          type: "danger",
          message: `Loan of $${amount.toLocaleString()} for ${name} was rejected.`,
          time: "Just now",
          category: "Approvals"
        };
        setAlerts(prev => [newAlert, ...prev]);
        return { ...app, status: "Rejected" };
      }
      return app;
    });
    setLoanApplications(updated);
  };

  const handleReleaseDisbursement = (id, name, amount) => {
    const updated = disbursements.map(disb => {
      if (disb.id === id) {
        // Add success alert
        const newAlert = {
          id: Date.now(),
          type: "success",
          message: `Funds released: $${amount.toLocaleString()} disbursed to ${name}.`,
          time: "Just now",
          category: "Disbursements"
        };
        setAlerts(prev => [newAlert, ...prev]);
        return { ...disb, status: "Released" };
      }
      return disb;
    });
    setDisbursements(updated);
  };

  const handleRecordCollection = (e) => {
    e.preventDefault();
    if (!selectedGroup || !newColAmount || !selectedFO) return;

    const amt = parseFloat(newColAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newCol = {
      id: `COL${Math.floor(100 + Math.random() * 900)}`,
      groupName: selectedGroup,
      amount: amt,
      collectedBy: selectedFO,
      date: new Date().toLocaleString()
    };

    setCollections(prev => [newCol, ...prev]);
    
    // Add success alert
    const newAlert = {
      id: Date.now(),
      type: "success",
      message: `Collection logged: $${amt.toLocaleString()} from ${selectedGroup} by ${selectedFO}.`,
      time: "Just now",
      category: "Collections"
    };
    setAlerts(prev => [newAlert, ...prev]);

    setNewColAmount("");
    setSuccessMsg("Collection logged successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Mock meetings data
  const meetings = [
    { id: 1, title: "Lotus Group Weekly Repayment Meet", group: "Lotus Women Group", officer: "Ramesh Kumar", time: "Tomorrow, 10:00 AM", location: "Center 1A" },
    { id: 2, title: "Rose Group Monthly Evaluation", group: "Rose Self Help Group", officer: "Suresh Singh", time: "June 25, 11:30 AM", location: "Center 2B" },
    { id: 3, title: "Branch Field Officers Review", group: "Internal Staff", officer: "Priya Sharma", time: "June 26, 09:30 AM", location: "Branch Office" },
    { id: 4, title: "Jasmine Group Inauguration Meeting", group: "Jasmine SHG", officer: "Pooja Hegde", time: "June 28, 02:00 PM", location: "Center 4C" }
  ];

  return (
    <div className="container-fluid py-4 text-dark">
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1 text-success" style={{ fontSize: "32px" }}>
            Branch Dashboard
          </h1>
          <p className="text-secondary mb-0">Overview & Management Portal — Branch Code: BR041</p>
        </div>
        <div className="bg-dark p-2 rounded border border-success" style={{ background: "rgba(0,0,0,0.4)" }}>
          <small className="text-success fw-bold">Live Status: Connected</small>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="row g-4 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white card-zoom-out">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Total Groups</span>
              <h2 className="display-6 fw-bold mt-2 mb-0 text-dark">{totalGroups}</h2>
              <small className="text-success">↑ Active Women Groups</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white card-zoom-out">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Total Members</span>
              <h2 className="display-6 fw-bold mt-2 mb-0 text-dark">{totalMembers}</h2>
              <small className="text-success">↑ Active accounts</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white card-zoom-out">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Active Borrowers</span>
              <h2 className="display-6 fw-bold mt-2 mb-0 text-dark">{activeLoansCount}</h2>
              <small className="text-info">{pendingLoansCount} Applications Pending</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white card-zoom-out">
            <div className="card-body">
              <span className="text-secondary small fw-bold uppercase">Outstanding Portfolio</span>
              <h2 className="display-6 fw-bold mt-2 mb-0 text-success">${totalPortfolio.toLocaleString()}</h2>
              <small className="text-success">Good repayment health</small>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Performance KPIs Row */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card text-white border-0" style={{ background: "rgba(57, 255, 20, 0.03)", border: "1px solid rgba(57, 255, 20, 0.15)" }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-success">Branch Performance KPIs</h5>
              <div className="row g-4 text-center">
                <div className="col-md-3 border-end border-secondary">
                  <div className="p-2">
                    <span className="text-secondary small">Collection Rate</span>
                    <h3 className="fw-bold text-white mt-1">98.4%</h3>
                    <div className="progress bg-dark mt-2" style={{ height: "4px" }}>
                      <div className="progress-bar bg-success" style={{ width: "98.4%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 border-end border-secondary">
                  <div className="p-2">
                    <span className="text-secondary small">Portfolio at Risk (PAR)</span>
                    <h3 className="fw-bold text-danger mt-1">1.2%</h3>
                    <div className="progress bg-dark mt-2" style={{ height: "4px" }}>
                      <div className="progress-bar bg-danger" style={{ width: "1.2%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 border-end border-secondary">
                  <div className="p-2">
                    <span className="text-secondary small">Active Member Growth</span>
                    <h3 className="fw-bold text-info mt-1">+12.5%</h3>
                    <div className="progress bg-dark mt-2" style={{ height: "4px" }}>
                      <div className="progress-bar bg-info" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-2">
                    <span className="text-secondary small">Overdue Recovery Rate</span>
                    <h3 className="fw-bold text-warning mt-1">95.8%</h3>
                    <div className="progress bg-dark mt-2" style={{ height: "4px" }}>
                      <div className="progress-bar bg-warning" style={{ width: "95.8%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        
        {/* Left Column: Loan Applications & Disbursements */}
        <div className="col-lg-8">
          
          {/* Loan Applications */}
          <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="fw-bold mb-0">Loan Applications Queue</h5>
              <span className="badge bg-warning text-black fw-bold">{pendingLoansCount} Pending</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                  <thead className="table-light bg-opacity-10 text-secondary">
                    <tr>
                      <th className="px-4 py-3">Applicant</th>
                      <th className="py-3">Requested Loan</th>
                      <th className="py-3">Purpose</th>
                      <th className="py-3">Applied Date</th>
                      <th className="py-3">Status</th>
                      <th className="px-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanApplications.map((app) => (
                      <tr key={app.id} className="border-bottom border-dark">
                        <td className="px-4 py-3 fw-bold text-white">{app.memberName}</td>
                        <td className="py-3 text-success fw-bold">${app.amount.toLocaleString()}</td>
                        <td className="py-3 text-light">{app.purpose}</td>
                        <td className="py-3 text-secondary">{app.date}</td>
                        <td className="py-3">
                          <span className={`badge ${
                            app.status === "Pending" ? "bg-warning text-black" : 
                            app.status === "Approved" ? "bg-success" : "bg-danger"
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          {app.status === "Pending" ? (
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-success fw-bold" 
                                onClick={() => handleApproveLoan(app.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-danger fw-bold" 
                                onClick={() => handleRejectLoan(app.id, app.memberName, app.amount)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <small className="text-secondary">-</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Loan Disbursement Tracking */}
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="fw-bold mb-0">Approved Loan Disbursements</h5>
              <span className="badge bg-success">{disbursements.filter(d => d.status !== "Released").length} Awaiting Release</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                  <thead className="table-light bg-opacity-10 text-secondary">
                    <tr>
                      <th className="px-4 py-3">Member Name</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Scheduled Date</th>
                      <th className="py-3">Disbursment Status</th>
                      <th className="px-4 py-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disbursements.map((disb) => (
                      <tr key={disb.id} className="border-bottom border-dark">
                        <td className="px-4 py-3 fw-bold text-white">{disb.memberName}</td>
                        <td className="py-3 text-success fw-bold">${disb.amount.toLocaleString()}</td>
                        <td className="py-3 text-secondary">{disb.date}</td>
                        <td className="py-3">
                          <span className={`badge ${
                            disb.status === "Released" ? "bg-info text-black" : "bg-warning text-black"
                          }`}>
                            {disb.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          {disb.status !== "Released" ? (
                            <button 
                              className="btn btn-sm btn-outline-success fw-bold"
                              onClick={() => handleReleaseDisbursement(disb.id, disb.memberName, disb.amount)}
                            >
                              Release Funds
                            </button>
                          ) : (
                            <small className="text-secondary-emphasis">Disbursed ✓</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Collection Entry, Overdue, and Meetings */}
        <div className="col-lg-4">
          
          {/* Quick Collection Logger */}
          <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Record Repayment Collection</h5>
            </div>
            <div className="card-body">
              {successMsg && <div className="alert alert-success py-2">{successMsg}</div>}
              <form onSubmit={handleRecordCollection}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Select Group</label>
                  <select 
                    className="form-select bg-dark text-white border-secondary"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Group --</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Amount Collected ($)</label>
                  <input 
                    type="number" 
                    className="form-control bg-dark text-white border-secondary" 
                    placeholder="Enter collected amount"
                    value={newColAmount}
                    onChange={(e) => setNewColAmount(e.target.value)}
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Field Officer</label>
                  <select 
                    className="form-select bg-dark text-white border-secondary"
                    value={selectedFO}
                    onChange={(e) => setSelectedFO(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Staff --</option>
                    {staff.map(s => (
                      <option key={s.id} value={`${s.name} (${s.role === "Field Officer" ? "FO" : "Staff"})`}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn w-100 fw-bold" 
                  style={{ background: "#39FF14", color: "#000", border: "none" }}
                >
                  Record Repayment
                </button>
              </form>
            </div>
          </div>

          {/* Overdue Recovery Warning List */}
          <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Overdue Recovery Monitor</h5>
              <span className="badge bg-danger">Critical</span>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded bg-transparent">
                <div className="list-group-item bg-transparent text-white border-bottom border-dark p-3">
                  <div className="d-flex justify-content-between">
                    <strong className="text-danger">Kavitha Murthy</strong>
                    <span className="text-danger fw-bold">$500 Overdue</span>
                  </div>
                  <p className="small text-secondary mb-1">Group: Rose Self Help Group | Overdue: 14 Days</p>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="badge bg-dark border border-danger text-danger">Field Visit Scheduled</span>
                    <button className="btn btn-xs btn-outline-secondary py-0 px-2 small">Actioned</button>
                  </div>
                </div>
                <div className="list-group-item bg-transparent text-white border-bottom border-dark p-3">
                  <div className="d-flex justify-content-between">
                    <strong className="text-warning">Latha Mahesh</strong>
                    <span className="text-warning fw-bold">$300 Overdue</span>
                  </div>
                  <p className="small text-secondary mb-1">Group: Deepam Welfare Group | Overdue: 5 Days</p>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="badge bg-dark border border-warning text-warning">SMS Alert Sent</span>
                    <button className="btn btn-xs btn-outline-secondary py-0 px-2 small">Call Officer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meetings Calendar Widget */}
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Upcoming Meetings</h5>
              <small className="text-success font-monospace">Next 7 Days</small>
            </div>
            <div className="card-body p-3">
              {meetings.map((meet) => (
                <div key={meet.id} className="mb-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.2)", borderLeft: "3px solid #39FF14" }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <strong className="small text-light d-block mb-1">{meet.title}</strong>
                    <span className="badge bg-success bg-opacity-25 text-success" style={{ fontSize: "10px" }}>Active</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary" style={{ fontSize: "12px" }}>
                    <span>🕒 {meet.time}</span>
                    <span>📍 {meet.location}</span>
                  </div>
                  <div className="mt-2 text-end text-secondary" style={{ fontSize: "11px" }}>
                    Officer: <strong>{meet.officer}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardTab;
