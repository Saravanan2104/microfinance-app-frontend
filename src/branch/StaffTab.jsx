import React, { useState } from "react";
import { createEmployee, assignBranch } from "../services/api";

const StaffTab = ({ staff, setStaff }) => {
  const [tasks, setTasks] = useState([
    { id: 1, staffName: "Ramesh Kumar", taskDescription: "Audit collection register for Lotus Women Group", dueDate: "2026-06-23", status: "Pending" },
    { id: 2, staffName: "Suresh Singh", taskDescription: "Follow up with Kavitha Murthy regarding overdue loan repayment", dueDate: "2026-06-24", status: "In Progress" },
    { id: 3, staffName: "Pooja Hegde", taskDescription: "Conduct registration verification meeting for Jasmine SHG", dueDate: "2026-06-25", status: "Completed" }
  ]);

  // Form States for Task Assignment
  const [selectedStaff, setSelectedStaff] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Form States for Staff Registration
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [staffRole, setStaffRole] = useState("RM");
  const [employeeBranchId, setEmployeeBranchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!selectedStaff || !taskDesc || !dueDate) return;

    const newTask = {
      id: Date.now(),
      staffName: selectedStaff,
      taskDescription: taskDesc,
      dueDate,
      status: "Pending"
    };

    setTasks([newTask, ...tasks]);
    setSelectedStaff("");
    setTaskDesc("");
    setDueDate("");
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !phone) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role_name: staffRole,
      };

      const created = await createEmployee(payload);
      
      if (employeeBranchId) {
        try {
          await assignBranch(parseInt(employeeBranchId), created.employee_id);
        } catch (assignErr) {
          console.error("Failed to assign branch:", assignErr);
          // Non-fatal error, continue
        }
      }
      
      const newStaff = {
        id: String(created.employee_id || Date.now()),
        name: `${created.first_name || firstName} ${created.last_name || lastName}`.trim(),
        role: created.role_name || staffRole,
        assignedGroups: 0,
        collectionTarget: staffRole === "RM" ? 95 : 0,
        collectionRate: staffRole === "RM" ? 100.0 : 0
      };

      setStaff([newStaff, ...staff]);
      
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setStaffRole("RM");
      setEmployeeBranchId("");
      setShowAddStaff(false);
      alert("Employee created successfully!");
    } catch (err) {
      console.error("Failed to create employee:", err);
      setErrorMsg(err.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };



  const handleUpdateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Selected Staff for Details Pane
  const [selectedStaffDetail, setSelectedStaffDetail] = useState(null);

  // Set first staff as default selected if available
  if (!selectedStaffDetail && staff.length > 0) {
    setSelectedStaffDetail(staff[0]);
  }

  return (
    <div className="container-fluid py-4 text-dark">
      {/* Header matching screenshot */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <div className="text-secondary fw-bold" style={{ fontSize: "12px", letterSpacing: "1px" }}>
            MICROFINANCE CONTROLS / <span className="text-success">BRANCH MANAGERS</span>
          </div>
          <h1 className="fw-bold mb-1 mt-2 text-dark" style={{ fontSize: "32px" }}>
            Branch Managers
          </h1>
          <p className="text-secondary mb-0">Onboard branch managers and review their assigned branch details.</p>
        </div>
        <button 
          className="btn fw-bold px-4 py-2 shadow-sm"
          style={{ background: "#28a745", color: "#fff", border: "none", borderRadius: "8px" }}
          onClick={() => setShowAddStaff(!showAddStaff)}
        >
          {showAddStaff ? "Cancel Adding" : "+ Add Branch Manager"}
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: Metrics & Table */}
        <div className="col-lg-8">
          
          {/* Top Metric Cards */}
          {!showAddStaff && (
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body py-3">
                    <div className="text-secondary fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "1px" }}>TOTAL RECORDS</div>
                    <div className="fs-3 fw-bold text-dark">{staff.length}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body py-3">
                    <div className="text-secondary fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "1px" }}>ACTIVE</div>
                    <div className="fs-3 fw-bold text-dark">{staff.length > 0 ? staff.length - 1 : 0}</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body py-3">
                    <div className="text-secondary fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "1px" }}>BRANCHES COVERED</div>
                    <div className="fs-3 fw-bold text-dark">{staff.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showAddStaff ? (
            /* Register Staff Form Card */
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-bottom py-3 rounded-top-4">
                <h5 className="fw-bold mb-0 text-success">Register Branch Personnel</h5>
              </div>
              <div className="card-body p-4">
                {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                <form onSubmit={handleAddStaffSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">First Name</label>
                    <input 
                      type="text" 
                      className="form-control border"
                      placeholder="e.g. Ramesh"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Last Name</label>
                    <input 
                      type="text" 
                      className="form-control border"
                      placeholder="e.g. Kumar"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Email</label>
                    <input 
                      type="email" 
                      className="form-control border"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Phone</label>
                    <input 
                      type="text" 
                      className="form-control border"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Password</label>
                    <input 
                      type="password" 
                      className="form-control border"
                      placeholder="Secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Corporate Designation</label>
                    <select 
                      className="form-select border"
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                    >
                      <option value="RM">Relationship Manager (RM)</option>
                      <option value="QA">Quality Analyzer (QA)</option>
                      <option value="FO">Field Officer</option>
                      <option value="BM">Branch Manager</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Branch ID (Optional)</label>
                    <input 
                      type="number" 
                      className="form-control border"
                      placeholder="e.g. 1"
                      value={employeeBranchId}
                      onChange={(e) => setEmployeeBranchId(e.target.value)}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn fw-bold w-100 py-2 shadow-sm" 
                      style={{ background: "#28a745", color: "#fff", border: "none" }}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Add Staff Member"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Staff Roster Card */
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-bottom py-3 rounded-top-4">
                <input 
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search manager, email, phone, or branch"
                  style={{ borderRadius: "8px", padding: "10px 15px" }}
                />
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="px-4 py-3 fw-bold" style={{ fontSize: "12px", letterSpacing: "1px", border: "none" }}>NAME</th>
                        <th className="py-3 fw-bold" style={{ fontSize: "12px", letterSpacing: "1px", border: "none" }}>BRANCH</th>
                        <th className="py-3 fw-bold" style={{ fontSize: "12px", letterSpacing: "1px", border: "none" }}>EMAIL</th>
                        <th className="px-4 py-3 text-end fw-bold" style={{ fontSize: "12px", letterSpacing: "1px", border: "none" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((member, idx) => (
                        <tr 
                          key={member.id} 
                          onClick={() => setSelectedStaffDetail(member)}
                          className={selectedStaffDetail?.id === member.id ? "bg-success bg-opacity-10" : "bg-white"}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="px-4 py-4 fw-bold text-dark border-bottom-0">{member.name}</td>
                          <td className="py-4 text-dark border-bottom-0">Bengaluru Central</td>
                          <td className="py-4 text-dark border-bottom-0">{member.email || "—"}</td>
                          <td className="px-4 py-4 text-end border-bottom-0">
                            <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-2">Active</span>
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

        {/* Right Column: Branch Manager Details Pane */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="text-secondary fw-bold mb-3" style={{ fontSize: "11px", letterSpacing: "1px" }}>
                BRANCH MANAGER DETAILS
              </div>
              
              {selectedStaffDetail ? (
                <>
                  <h3 className="fw-bold text-dark mb-4">{selectedStaffDetail.name}</h3>
                  
                  <div className="mb-4">
                    <label className="text-secondary fw-bold d-block mb-1" style={{ fontSize: "12px" }}>Assigned Branch</label>
                    <div className="text-dark fw-bold">Bengaluru Central</div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-secondary fw-bold d-block mb-1" style={{ fontSize: "12px" }}>Email</label>
                    <div className="text-dark fw-bold">{selectedStaffDetail.email || "no-email@example.com"}</div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-secondary fw-bold d-block mb-1" style={{ fontSize: "12px" }}>Phone No</label>
                    <div className="text-dark fw-bold">{selectedStaffDetail.phone || "+91 98765 43210"}</div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-secondary fw-bold d-block mb-1" style={{ fontSize: "12px" }}>Joined</label>
                    <div className="text-dark fw-bold">12 Jan 2025</div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="text-secondary fw-bold d-block mb-1" style={{ fontSize: "12px" }}>Status</label>
                    <span className="badge bg-success bg-opacity-25 text-success rounded-pill px-3 py-2">Active</span>
                  </div>

                </>
              ) : (
                <div className="text-secondary mt-4">Select a manager from the list to view details.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffTab;
