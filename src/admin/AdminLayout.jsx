import React from "react";
import { NavLink } from "react-router-dom";

export function AdminLayout({ activeSection, managerCount, branchCount, children }) {
  return (
    <div className="admin-shell">
      <style>{adminStyles}</style>

      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand-kicker">Admin Console</div>
          <div className="admin-brand-title">Microfinance Controls</div>
          <div className="admin-brand-subtitle">
            Manage branches, branch managers, and operational assignments.
          </div>
        </div>

        <nav className="admin-menu">
          <NavLink
            to="/admin/branch-manager"
            className={`admin-menu-btn ${activeSection === "managers" ? "active" : ""}`}
          >
            <span className="admin-menu-title">Branch Managers</span>
          </NavLink>

          <NavLink
            to="/admin/branches"
            className={`admin-menu-btn ${activeSection === "branches" ? "active" : ""}`}
          >
            <span className="admin-menu-title">Branches</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">AD</div>
          <div>
            <div className="admin-name">Admin Desk</div>
            <div className="admin-muted">Branch operations</div>
          </div>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}

export function StatusBadge({ status }) {
  const className = status === "Active" ? "active" : status === "Review" ? "review" : "";
  return <span className={`admin-status ${className}`}>{status}</span>;
}

export function DetailItem({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function TextField({ label, name, type = "text", value, error, onChange }) {
  return (
    <div className="admin-field">
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className={`admin-input ${error ? "has-error" : ""}`}
        type={type}
        value={value}
        onChange={(event) =>
          onChange((prev) => ({ ...prev, [name]: event.target.value }))
        }
      />
      {error && <div className="admin-error">{error}</div>}
    </div>
  );
}

const adminStyles = `
  * { box-sizing: border-box; }

  .admin-shell {
    --green: #16a34a;
    --green-dark: #15803d;
    --ink: #111827;
    --muted: #9ca3af;
    --line: #1f2937;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    background: #0b0f17;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif;
  }

  /* Updated sidebar base color layout to dark to reflect Image 1 */
  .admin-sidebar {
    background: #05070a;
    border-right: 1px solid var(--line);
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .admin-brand-kicker {
    color: var(--green);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .admin-brand-title {
    margin-top: 8px;
    font-size: 22px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.15;
  }

  .admin-brand-subtitle {
    margin-top: 8px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.45;
  }

  .admin-menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 28px;
  }

  /* Perfect match match layout structure from Image 1 */
  .admin-menu-btn {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    text-decoration: none;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #9ca3af;
    padding: 12px 16px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .admin-menu-btn:hover {
    background: #111827;
    color: #ffffff;
  }

  /* When active, it switches background to your green tokens cleanly */
  .admin-menu-btn.active {
    background: rgba(22, 163, 74, 0.15);
    color: #22c55e;
    font-weight: 700;
  }

  .admin-menu-title {
    display: block;
    font-size: 14px;
  }

  .admin-sidebar-footer {
    margin-top: auto;
    border-top: 1px solid var(--line);
    padding-top: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .admin-avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #111827;
    color: #ffffff;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: 13px;
  }

  .admin-main {
    min-width: 0;
    padding: 28px;
    background: #0b0f17;
  }

  .admin-topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 20px;
  }

  .admin-breadcrumb {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 10px;
  }

  .admin-breadcrumb span {
    color: var(--green);
  }

  .admin-title {
    margin: 0;
    font-size: 30px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0;
  }

  .admin-subtitle {
    margin: 8px 0 0;
    color: var(--muted);
    font-size: 14px;
  }

  .admin-primary-btn,
  .admin-detail-btn {
    border: none;
    border-radius: 10px;
    background: var(--green);
    color: #ffffff;
    font-weight: 800;
    cursor: pointer;
  }

  .admin-primary-btn {
    padding: 12px 18px;
    white-space: nowrap;
    box-shadow: 0 10px 24px rgba(22, 163, 74, 0.2);
  }

  .admin-primary-btn:hover,
  .admin-detail-btn:hover,
  .admin-submit-btn:hover {
    background: var(--green-dark);
  }

  .admin-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 20px;
    align-items: start;
  }

  .admin-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(150px, 1fr));
    gap: 14px;
    margin-bottom: 16px;
  }

  .admin-stat,
  .admin-card,
  .admin-details {
    background: #111827;
    border: 1px solid var(--line);
    border-radius: 14px;
  }

  .admin-stat {
    padding: 18px;
  }

  .admin-stat-label {
    color: #9ca3af;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .admin-stat-value {
    margin-top: 8px;
    font-size: 28px;
    font-weight: 900;
    color: #ffffff;
  }

  .admin-toolbar {
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--line);
  }

  .admin-search {
    width: 100%;
    max-width: 430px;
    border: 1.5px solid var(--line);
    border-radius: 10px;
    background: #1f2937;
    color: #ffffff;
    padding: 11px 14px;
    outline: none;
    font-size: 14px;
  }

  .admin-search:focus {
    border-color: var(--green);
    background: #111827;
  }

  .admin-table-wrap {
    overflow-x: auto;
  }

  .admin-table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
  }

  .admin-table th {
    background: #1f2937;
    color: #ffffff;
    text-align: left;
    padding: 14px 18px;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .admin-table td {
    padding: 15px 18px;
    border-bottom: 1px solid var(--line);
    font-size: 14px;
    color: #e5e7eb;
  }

  .admin-table tr.clickable {
    cursor: pointer;
  }

  .admin-table tr.clickable:hover {
    background: #1f2937;
  }

  .admin-table tr.selected {
    background: rgba(22, 163, 74, 0.1);
  }

  .admin-name {
    font-weight: 900;
    color: #ffffff;
  }

  .admin-muted {
    color: var(--muted);
    font-weight: 600;
  }

  .admin-status {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 5px 11px;
    font-size: 12px;
    font-weight: 900;
    border: 1px solid #374151;
    background: #1f2937;
    color: #9ca3af;
  }

  .admin-status.active {
    background: rgba(22, 163, 74, 0.2);
    border-color: #22c55e;
    color: #22c55e;
  }

  .admin-status.review {
    background: rgba(249, 115, 22, 0.2);
    border-color: #f97316;
    color: #f97316;
  }

  .admin-detail-btn {
    padding: 9px 13px;
    font-size: 12px;
  }

  .admin-details {
    padding: 20px;
    position: sticky;
    top: 20px;
  }

  .admin-details-kicker {
    color: #9ca3af;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .admin-details-title {
    margin: 10px 0 16px;
    font-size: 22px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.2;
  }

  .admin-detail-list {
    display: grid;
    gap: 12px;
    margin: 0;
  }

  .admin-detail-list dt {
    color: #9ca3af;
    font-size: 12px;
    font-weight: 800;
  }

  .admin-detail-list dd {
    margin: 4px 0 0;
    color: #ffffff;
    font-size: 14px;
    font-weight: 800;
  }

  .admin-empty {
    padding: 38px;
    text-align: center;
    color: #9ca3af;
    font-weight: 700;
  }

  .admin-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
  }

  .admin-modal {
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    background: #111827;
    border-radius: 16px;
    border: 1px solid var(--line);
  }

  .admin-modal-head {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 0;
  }

  .admin-modal-title {
    margin: 0 0 4px;
    color: #ffffff;
    font-size: 21px;
    font-weight: 900;
  }

  .admin-modal-subtitle {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
  }

  .admin-modal-close {
    border: none;
    background: transparent;
    color: #9ca3af;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
  }

  .admin-form {
    padding: 20px 24px 24px;
  }

  .admin-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .admin-field {
    margin-bottom: 15px;
  }

  .admin-label {
    display: block;
    margin-bottom: 6px;
    color: #d1d5db;
    font-size: 12px;
    font-weight: 800;
  }

  .admin-input {
    width: 100%;
    border: 1.5px solid var(--line);
    border-radius: 10px;
    background: #1f2937;
    padding: 11px 13px;
    color: #ffffff;
    outline: none;
  }

  .admin-input:focus {
    border-color: var(--green);
    background: #111827;
  }

  .admin-input.has-error {
    border-color: #fca5a5;
    background: #271c1c;
  }

  .admin-error {
    margin-top: 5px;
    color: #fca5a5;
    font-size: 11.5px;
    font-weight: 700;
  }

  .admin-form-actions {
    display: flex;
    gap: 10px;
    margin-top: 6px;
  }

  .admin-secondary-btn {
    flex: 1;
    border: 1.5px solid var(--line);
    border-radius: 10px;
    background: transparent;
    color: #d1d5db;
    font-weight: 800;
    padding: 11px 14px;
    cursor: pointer;
  }

  .admin-submit-btn {
    flex: 1.4;
    border: none;
    border-radius: 10px;
    background: var(--green);
    color: #ffffff;
    font-weight: 800;
    padding: 11px 14px;
    cursor: pointer;
  }

  @media (max-width: 980px) {
    .admin-shell { grid-template-columns: 1fr; }
    .admin-sidebar { min-height: auto; }
    .admin-grid { grid-template-columns: 1fr; }
    .admin-details { position: static; }
  }

  @media (max-width: 640px) {
    .admin-main { padding: 18px; }
    .admin-topbar, .admin-toolbar { align-items: stretch; flex-direction: column; }
    .admin-stats { grid-template-columns: 1fr; }
    .admin-form-row { grid-template-columns: 1fr; }
    .admin-primary-btn { width: 100%; }
  }
`;