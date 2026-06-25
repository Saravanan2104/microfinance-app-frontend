import React, { useMemo, useState } from "react";
import { AdminLayout, DetailItem, StatusBadge, TextField } from "./AdminLayout";
import { DEFAULT_PASSWORD, initialBranches, initialManagers } from "./adminData";

const emptyManagerForm = {
  firstName: "",
  lastName: "",
  branch: "",
  email: "",
  phone: "",
  password: DEFAULT_PASSWORD,
};

export default function BranchManager() {
  const [managers, setManagers] = useState(initialManagers);
  const [selectedManager, setSelectedManager] = useState(initialManagers[0]);
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyManagerForm);
  const [errors, setErrors] = useState({});

  const filteredManagers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return managers;

    return managers.filter((manager) =>
      [
        manager.firstName,
        manager.lastName,
        manager.branch,
        manager.email,
        manager.phone,
        manager.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [managers, query]);

  const activeCount = managers.filter((manager) => manager.status === "Active").length;
  const branchesCovered = new Set(managers.map((manager) => manager.branch)).size;

  function openForm() {
    setForm(emptyManagerForm);
    setErrors({});
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setErrors({});
  }

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.branch.trim()) next.branch = "Branch is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.password.trim()) next.password = "Password is required.";
    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const newManager = {
      id: `bm-${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      branch: form.branch.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: "Active",
      joined: "Today",
    };

    setManagers((prev) => [newManager, ...prev]);
    setSelectedManager(newManager);
    closeForm();
  }

  return (
    <AdminLayout
      activeSection="managers"
      managerCount={managers.length}
      branchCount={initialBranches.length}
    >
      <div className="admin-topbar">
        <div>
          <div className="admin-breadcrumb">
            Microfinance Controls / <span>Branch Managers</span>
          </div>
          <h1 className="admin-title">Branch Managers</h1>
          <p className="admin-subtitle">
            Onboard branch managers and review their assigned branch details.
          </p>
        </div>

        <button type="button" className="admin-primary-btn" onClick={openForm}>
          + Add Branch Manager
        </button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat-label">Total Managers</div>
          <div className="admin-stat-value">{managers.length}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-label">Active</div>
          <div className="admin-stat-value">{activeCount}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-label">Branches Covered</div>
          <div className="admin-stat-value">{branchesCovered}</div>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-toolbar">
            <input
              className="admin-search"
              type="text"
              placeholder="Search manager, email, phone, or branch"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="admin-table-wrap">
            <ManagerTable
              managers={filteredManagers}
              selectedId={selectedManager?.id}
              onSelect={setSelectedManager}
            />
          </div>

          {filteredManagers.length === 0 && (
            <div className="admin-empty">No branch managers match "{query}".</div>
          )}
        </section>

        <ManagerDetails manager={selectedManager} />
      </div>

      {isFormOpen && (
        <div className="admin-overlay" onClick={closeForm}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-head">
              <div>
                <h2 className="admin-modal-title">Add Branch Manager</h2>
                <p className="admin-modal-subtitle">
                  Create a login profile and assign a branch.
                </p>
              </div>
              <button type="button" className="admin-modal-close" onClick={closeForm}>
                &times;
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit} noValidate>
              <div className="admin-form-row">
                <TextField label="First Name" name="firstName" value={form.firstName} error={errors.firstName} onChange={setForm} />
                <TextField label="Last Name" name="lastName" value={form.lastName} error={errors.lastName} onChange={setForm} />
              </div>
              <TextField label="Branch" name="branch" value={form.branch} error={errors.branch} onChange={setForm} />
              <TextField label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={setForm} />
              <TextField label="Phone No" name="phone" value={form.phone} error={errors.phone} onChange={setForm} />
              <TextField label="Temporary Password" name="password" value={form.password} error={errors.password} onChange={setForm} />

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

function ManagerTable({ managers, selectedId, onSelect }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Branch</th>
          <th>Email</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {managers.map((manager) => {
          const isSelected = selectedId === manager.id;

          return (
            <tr
              key={manager.id}
              className={`clickable ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(manager)}
            >
              <td className="admin-name">
                {manager.firstName} {manager.lastName}
              </td>
              <td className="admin-muted">{manager.branch}</td>
              <td className="admin-muted">{manager.email}</td>
              <td>
                <StatusBadge status={manager.status} />
              </td>
              <td>
                <button
                  type="button"
                  className="admin-detail-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(manager);
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

function ManagerDetails({ manager }) {
  if (!manager) {
    return (
      <aside className="admin-details">
        <div className="admin-details-kicker">Branch Manager Details</div>
        <p className="admin-muted">Select a manager to view details.</p>
      </aside>
    );
  }

  return (
    <aside className="admin-details">
      <div className="admin-details-kicker">Branch Manager Details</div>
      <h2 className="admin-details-title">
        {manager.firstName} {manager.lastName}
      </h2>

      <dl className="admin-detail-list">
        <DetailItem label="Assigned Branch" value={manager.branch} />
        <DetailItem label="Email" value={manager.email} />
        <DetailItem label="Phone No" value={manager.phone} />
        <DetailItem label="Joined" value={manager.joined} />
        <DetailItem label="Status" value={manager.status} />
      </dl>
    </aside>
  );
}
