import React, { useMemo, useState } from "react";
import { AdminLayout, DetailItem, StatusBadge, TextField } from "./AdminLayout";
import { initialBranches, initialManagers } from "./adminData";

const emptyBranchForm = {
  name: "",
  code: "",
  manager: "",
  area: "",
};

export default function Branches() {
  const [branches, setBranches] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState(initialBranches[0]);
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyBranchForm);
  const [errors, setErrors] = useState({});

  const filteredBranches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return branches;

    return branches.filter((branch) =>
      [branch.name, branch.code, branch.manager, branch.area, branch.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [branches, query]);

  const activeCount = branches.filter((branch) => branch.status === "Active").length;
  const activeLoans = branches.reduce((total, branch) => total + branch.activeLoans, 0);

  function openForm() {
    setForm(emptyBranchForm);
    setErrors({});
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setErrors({});
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Branch name is required.";
    if (!form.code.trim()) next.code = "Branch code is required.";
    if (!form.manager.trim()) next.manager = "Manager name is required.";
    if (!form.area.trim()) next.area = "Area is required.";
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const newBranch = {
      id: `br-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim(),
      manager: form.manager.trim(),
      members: 0,
      activeLoans: 0,
      status: "Active",
      area: form.area.trim(),
    };

    setBranches((prev) => [newBranch, ...prev]);
    setSelectedBranch(newBranch);
    closeForm();
  }

  return (
    <AdminLayout
      activeSection="branches"
      managerCount={initialManagers.length}
      branchCount={branches.length}
    >
      <div className="admin-topbar">
        <div>
          <div className="admin-breadcrumb">
            Microfinance Controls / <span>Branches</span>
          </div>
          <h1 className="admin-title">Branches</h1>
          <p className="admin-subtitle">
            Track branch coverage, loan load, and assigned manager details.
          </p>
        </div>

        <button type="button" className="admin-primary-btn" onClick={openForm}>
          + Add Branch
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-label">Total Branches</div>
          <div className="admin-stat-value">{branches.length}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-label">Active</div>
          <div className="admin-stat-value">{activeCount}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-label">Active Loans</div>
          <div className="admin-stat-value">{activeLoans}</div>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-toolbar">
            <input
              className="admin-search"
              type="text"
              placeholder="Search branch, code, manager, or area"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="admin-table-wrap">
            <BranchTable
              branches={filteredBranches}
              selectedId={selectedBranch?.id}
              onSelect={setSelectedBranch}
            />
          </div>

          {filteredBranches.length === 0 && (
            <div className="admin-empty">No branches match "{query}".</div>
          )}
        </section>

        <BranchDetails branch={selectedBranch} />
      </div>

      {isFormOpen && (
        <div className="admin-overlay" onClick={closeForm}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h2 className="admin-modal-title">Add Branch</h2>
                <p className="admin-modal-subtitle">
                  Register a new service branch and manager assignment.
                </p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeForm}>
                &times;
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit} noValidate>
              <TextField label="Branch Name" name="name" value={form.name} error={errors.name} onChange={setForm} />
              <div className="admin-form-row">
                <TextField label="Branch Code" name="code" value={form.code} error={errors.code} onChange={setForm} />
                <TextField label="Area / State" name="area" value={form.area} error={errors.area} onChange={setForm} />
              </div>
              <TextField label="Assigned Manager" name="manager" value={form.manager} error={errors.manager} onChange={setForm} />

              <div className="admin-form-actions">
                <button type="button" className="admin-secondary-btn" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="admin-submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function BranchTable({ branches, selectedId, onSelect }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Branch Name</th>
          <th>Code</th>
          <th>Manager</th>
          <th>Members</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((branch) => {
          const isSelected = selectedId === branch.id;

          return (
            <tr
              key={branch.id}
              className={`clickable ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(branch)}
            >
              <td className="admin-name">{branch.name}</td>
              <td className="admin-muted">{branch.code}</td>
              <td className="admin-muted">{branch.manager}</td>
              <td className="admin-muted">{branch.members}</td>
              <td>
                <StatusBadge status={branch.status} />
              </td>
              <td>
                <button
                  type="button"
                  className="admin-detail-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(branch);
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function BranchDetails({ branch }) {
  if (!branch) {
    return (
      <aside className="admin-details">
        <div className="admin-details-kicker">Branch Details</div>
        <p className="admin-muted">Select a branch to view details.</p>
      </aside>
    );
  }

  return (
    <aside className="admin-details">
      <div className="admin-details-kicker">Branch Details</div>
      <h2 className="admin-details-title">{branch.name}</h2>

      <dl className="admin-detail-list">
        <DetailItem label="Branch Code" value={branch.code} />
        <DetailItem label="Area / State" value={branch.area} />
        <DetailItem label="Branch Manager" value={branch.manager} />
        <DetailItem label="Members" value={branch.members} />
        <DetailItem label="Active Loans" value={branch.activeLoans} />
        <DetailItem label="Status" value={branch.status} />
      </dl>
    </aside>
  );
}
