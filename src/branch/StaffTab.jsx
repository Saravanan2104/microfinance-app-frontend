import React, { useState } from "react";

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
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("Field Officer");
  const [assignedGroups, setAssignedGroups] = useState("0");

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

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffName) return;

    const newStaff = {
      id: `STF00${staff.length + 1}`,
      name: staffName,
      role: staffRole,
      assignedGroups: parseInt(assignedGroups) || 0,
      collectionTarget: staffRole === "Field Officer" ? 95 : 0,
      collectionRate: staffRole === "Field Officer" ? 100.0 : 0
    };

    setStaff([...staff, newStaff]);
    setStaffName("");
    setAssignedGroups("0");
    setShowAddStaff(false);
  };

  const handleUpdateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Staff & Field Operations
          </h1>
          <p className="text-secondary mb-0">Manage personnel, delegate field tasks, and audit performance targets</p>
        </div>
        <button 
          className="btn fw-bold"
          style={{ background: "#39FF14", color: "#000", border: "none" }}
          onClick={() => setShowAddStaff(!showAddStaff)}
        >
          {showAddStaff ? "Cancel Add Staff" : "+ Register New Staff"}
        </button>
      </div>

      <div className="row g-4">
        
        {/* Left Column: Staff Directory or Add Staff */}
        <div className="col-lg-8">
          {showAddStaff ? (
            /* Register Staff Form Card */
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(57,255,20,0.2)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0 text-success">Register Branch Personnel</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddStaffSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Ramesh Kumar"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Corporate Designation</label>
                    <select 
                      className="form-select bg-dark text-white border-secondary"
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                    >
                      <option value="Field Officer">Field Officer</option>
                      <option value="Senior Field Officer">Senior Field Officer</option>
                      <option value="Branch Auditor">Branch Auditor</option>
                      <option value="Intern">Intern</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Assigned Women's Groups Count</label>
                    <input 
                      type="number" 
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="0"
                      value={assignedGroups}
                      onChange={(e) => setAssignedGroups(e.target.value)}
                    />
                  </div>

                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn fw-bold" 
                      style={{ background: "#39FF14", color: "#000", border: "none" }}
                    >
                      Add Staff Member
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* Staff Roster Card */
            <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0">Branch Personnel Roster</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                    <thead className="table-light bg-opacity-10 text-secondary">
                      <tr>
                        <th className="px-4 py-3">Staff Code</th>
                        <th className="py-3">Name</th>
                        <th className="py-3">Role</th>
                        <th className="py-3 text-center">Assigned Groups</th>
                        <th className="py-3 text-center">Target Rate</th>
                        <th className="py-3 text-center">Actual collection Rate</th>
                        <th className="px-4 py-3 text-end">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map((member) => (
                        <tr key={member.id} className="border-bottom border-dark">
                          <td className="px-4 py-3 font-monospace text-secondary" style={{ fontSize: "12px" }}>{member.id}</td>
                          <td className="py-3 fw-bold text-white">{member.name}</td>
                          <td className="py-3 text-light">{member.role}</td>
                          <td className="py-3 text-center text-info fw-bold">{member.assignedGroups} Groups</td>
                          <td className="py-3 text-center text-secondary font-monospace">
                            {member.collectionTarget ? `${member.collectionTarget}%` : "-"}
                          </td>
                          <td className="py-3 text-center font-monospace">
                            {member.collectionRate ? (
                              <strong className={member.collectionRate >= member.collectionTarget ? "text-success" : "text-warning"}>
                                {member.collectionRate}%
                              </strong>
                            ) : "-"}
                          </td>
                          <td className="px-4 py-3 text-end">
                            <span className="badge bg-success bg-opacity-25 text-success">On Field</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Active Ops Tasks Card */}
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Active Ops Tasks Queue</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless mb-0 align-middle">
                  <thead className="table-light bg-opacity-10 text-secondary">
                    <tr>
                      <th className="px-4 py-3">Assigned Staff</th>
                      <th className="py-3">Task Description</th>
                      <th className="py-3">Due Date</th>
                      <th className="py-3">Status</th>
                      <th className="px-4 py-3 text-end">Mark Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-bottom border-dark">
                        <td className="px-4 py-3 fw-bold text-white">{task.staffName}</td>
                        <td className="py-3 text-light">{task.taskDescription}</td>
                        <td className="py-3 text-secondary">{task.dueDate}</td>
                        <td className="py-3">
                          <span className={`badge ${
                            task.status === "Completed" ? "bg-success" : 
                            task.status === "In Progress" ? "bg-info text-black" : "bg-warning text-black"
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          {task.status !== "Completed" ? (
                            <div className="btn-group btn-group-sm">
                              {task.status === "Pending" && (
                                <button className="btn btn-outline-info" onClick={() => handleUpdateTaskStatus(task.id, "In Progress")}>Start</button>
                              )}
                              <button className="btn btn-success" onClick={() => handleUpdateTaskStatus(task.id, "Completed")}>Done</button>
                            </div>
                          ) : (
                            <small className="text-secondary">Closed ✓</small>
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

        {/* Right Column: Task Assigner Form */}
        <div className="col-lg-4">
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Delegate Operational Task</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAssignTask}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Select Staff Officer</label>
                  <select 
                    className="form-select bg-dark text-white border-secondary"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    required
                  >
                    <option value="">-- Select Officer --</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Task Objectives</label>
                  <textarea 
                    className="form-control bg-dark text-white border-secondary"
                    rows="3"
                    placeholder="Provide description of task expectations..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Due Target Date</label>
                  <input 
                    type="date" 
                    className="form-control bg-dark text-white border-secondary"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn w-100 fw-bold" 
                  style={{ background: "#39FF14", color: "#000", border: "none" }}
                >
                  Delegate Field Order
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffTab;
