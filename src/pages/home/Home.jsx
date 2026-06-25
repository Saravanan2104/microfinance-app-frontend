import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import Branch tab components
import DashboardTab from "../../branch/DashboardTab";
import GroupsTab from "../../branch/GroupsTab";
import MembersTab from "../../branch/MembersTab";
import LoansTab from "../../branch/LoansTab";
import ReportsTab from "../../branch/ReportsTab";
import AlertsTab from "../../branch/AlertsTab";
import StaffTab from "../../branch/StaffTab";
import ProfileTab from "../../branch/ProfileTab";
import SettingsTab from "../../branch/SettingsTab";
import QCTab from "../../branch/QCTab";
import { getMembers, getGroups, getEmployees } from "../../services/api";

const Home = () => {
  const navigate = useNavigate();

  // Sidebar state (locked to true)
  const sidebarExpanded = true;
  
  // Active Tab state: dashboard, groups, members, reports, alerts, staff, profile, settings
  const [activeTab, setActiveTab] = useState("dashboard");

  // API loading / error
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Shared state — populated from API
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);

  // Normalise a raw API member object to the shape the UI expects
  const normaliseMember = (m) => ({
    id: m.member_code || String(m.member_id),
    member_id: m.member_id,
    name: `${m.first_name || ""} ${m.last_name || ""}`.trim(),
    phone: m.phone || "",
    address: m.address || "",
    dob: m.dob || "",
    gender: m.gender || "",
    marital_status: m.marital_status || "",
    whatsapp_number: m.whatsapp_number || "",
    secondary_number: m.secondary_number || "",
    email: m.email || "",
    groupName: m.group_name || "",
    kycStatus: m.kyc_status || "Pending Review",
    kycType: m.kyc_type || "Aadhar Card",
    kycNumber: m.kyc_number || "",
    activeLoan: m.active_loan || 0,
    savingsBalance: m.savings_balance || 0,
  });

  // Normalise a raw API group object
  const normaliseGroup = (g) => ({
    id: g.group_code || String(g.group_id),
    group_id: g.group_id,
    name: g.group_name || "",
    leader: g.head_member_id ? `Member #${g.head_member_id}` : "—",
    meetingDay: g.meeting_day || "",
    membersCount: g.members_count || 0,
    savingsPool: g.group_limit_amount || 0,
    performanceScore: 90,
    status: g.status || "Active",
    fieldOfficer: g.relationship_manager_employee_id
      ? `RM #${g.relationship_manager_employee_id}`
      : "—",
    targetCollection: 95,
  });

  const normaliseStaff = (s) => ({
    id: String(s.employee_id),
    name: `${s.first_name || ""} ${s.last_name || ""}`.trim(),
    role: s.role_name || "Unknown",
    email: s.email || "",
    phone: s.phone || "",
    assignedGroups: 0,
    collectionTarget: 95,
    collectionRate: 100
  });

  // Fetch members and groups from real API
  useEffect(() => {
    const loadData = async () => {
      setApiLoading(true);
      setApiError("");
      try {
        const [membersData, groupsData, staffData] = await Promise.all([
          getMembers(),
          getGroups(),
          getEmployees(),
        ]);
        setMembers((membersData || []).map(normaliseMember));
        setGroups((groupsData || []).map(normaliseGroup));
        setStaff((staffData || []).map(normaliseStaff));
      } catch (err) {
        console.error("API error:", err);
        setApiError(err.message || "Failed to load data from server");
      } finally {
        setApiLoading(false);
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loanApplications, setLoanApplications] = useState([
    { id: "LN001", memberName: "Rajeshwari S.", amount: 20000, purpose: "Tailoring Machine Purchase", status: "Pending", date: "2026-06-20" },
    { id: "LN002", memberName: "Latha Mahesh", amount: 15000, purpose: "Small Grocery Shop Setup", status: "Approved", date: "2026-06-18" },
    { id: "LN003", memberName: "Kavitha Murthy", amount: 30000, purpose: "Children Education Fees", status: "Pending", date: "2026-06-22" },
    { id: "LN004", memberName: "Meena Krishnan", amount: 10000, purpose: "Poultry Farming Materials", status: "Rejected", date: "2026-06-15" }
  ]);

  const [disbursements, setDisbursements] = useState([
    { id: "DISB001", memberName: "Anitha Raj", amount: 15000, date: "2026-06-24", status: "Approved (Awaiting Release)" },
    { id: "DISB002", memberName: "Sunitha V.", amount: 10000, date: "2026-06-21", status: "Released" },
    { id: "DISB003", memberName: "Latha Mahesh", amount: 15000, date: "2026-06-28", status: "Approved (Awaiting Release)" }
  ]);

  const [collections, setCollections] = useState([
    { id: "COL001", groupName: "Lotus Women Group", amount: 2400, collectedBy: "Ramesh Kumar (FO)", date: "2026-06-22 10:30 AM" },
    { id: "COL002", groupName: "Rose Self Help Group", amount: 1800, collectedBy: "Suresh Singh (FO)", date: "2026-06-22 11:45 AM" },
    { id: "COL003", groupName: "Deepam Welfare Group", amount: 3100, collectedBy: "Ramesh Kumar (FO)", date: "2026-06-21 02:15 PM" }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: "danger", message: "Overdue payment warning: member Kavitha Murthy (Rose SHG) missed payment target of $500.", time: "2 hours ago", category: "Overdue" },
    { id: 2, type: "warning", message: "2 Loan Applications are pending manager audit approvals.", time: "5 hours ago", category: "Approvals" },
    { id: 3, type: "info", message: "Upcoming Center Meeting scheduled for Lotus group tomorrow at 10:00 AM.", time: "1 day ago", category: "Meetings" },
    { id: 4, type: "success", message: "KYC verification credentials approved successfully for Rajeshwari S.", time: "1 day ago", category: "KYC" }
  ]);

  const [staff, setStaff] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const toggleSidebar = () => {
    // Disabled to prevent width change
  };

  // Render sub-components based on activeTab state
  const renderContentTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            groups={groups}
            members={members}
            loanApplications={loanApplications}
            setLoanApplications={setLoanApplications}
            disbursements={disbursements}
            setDisbursements={setDisbursements}
            collections={collections}
            setCollections={setCollections}
            alerts={alerts}
            setAlerts={setAlerts}
            staff={staff}
          />
        );
      case "groups":
        return (
          <GroupsTab
            groups={groups}
            setGroups={setGroups}
            staff={staff}
            members={members}
          />
        );
      case "members":
        return (
          <MembersTab
            members={members}
            setMembers={setMembers}
            groups={groups}
          />
        );
      case "loans":
        return (
          <LoansTab
            members={members}
            groups={groups}
          />
        );
      case "reports":
        return (
          <ReportsTab
            groups={groups}
            members={members}
            loanApplications={loanApplications}
            collections={collections}
          />
        );
      case "alerts":
        return (
          <AlertsTab
            alerts={alerts}
            setAlerts={setAlerts}
          />
        );
      case "staff":
        return (
          <StaffTab
            staff={staff}
            setStaff={setStaff}
          />
        );
      case "qc":
        return <QCTab />;
      case "profile":
        return <ProfileTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <div className="p-4 text-white">Tab not found.</div>;
    }
  };

  // Nav item list configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "groups", label: "Groups", icon: "👥" },
    { id: "members", label: "Members", icon: "👤" },
    { id: "loans", label: "Loans", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
    { id: "staff", label: "Staff", icon: "👔" },
    { id: "qc", label: "QC", icon: "✅" },
    { id: "profile", label: "Profile", icon: "⚙️" },
    { id: "settings", label: "Settings", icon: "🛠️" }
  ];

  return (
    <div 
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "#f4f7f6", // Light gray background
        fontFamily: "'Outfit', 'Inter', sans-serif",
        overflowX: "hidden"
      }}
    >
      {/* Top Navbar */}
      <nav 
        className="navbar navbar-expand-lg px-4 py-3 border-bottom sticky-top"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e0e0e0 !important",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
        }}
      >
        <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
          
          <div className="d-flex align-items-center gap-3">
            {/* Hamburger Button */}
            <button 
              className="btn btn-outline-success border-0 text-success fs-4 p-0 d-flex align-items-center justify-content-center"
              onClick={toggleSidebar}
              style={{ width: "36px", height: "36px" }}
              aria-label="Toggle Sidebar"
            >
              ☰
            </button>
            <div className="d-flex align-items-center gap-2">
              <span className="fs-3 text-success">👥</span>
              <div className="d-flex flex-column">
                <span 
                  className="fw-bold tracking-wider text-success" 
                  style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}
                >
                  Admin Console
                </span>
                <span 
                  className="fw-bold text-dark" 
                  style={{ fontSize: "20px" }}
                >
                  Microfinance Controls
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary small d-none d-md-inline-block fw-medium">
              📅 {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div 
              className="position-relative cursor-pointer"
              onClick={() => setActiveTab("alerts")}
              style={{ cursor: "pointer" }}
            >
              <span className="fs-4">🔔</span>
              {alerts.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
                  {alerts.length}
                </span>
              )}
            </div>
          </div>

        </div>
      </nav>

      {/* Main Layout Container */}
      <div className="d-flex flex-grow-1 position-relative">
        
        {/* Responsive Collapsible Sidebar */}
        <aside 
          className="py-4 px-3 d-flex flex-column justify-content-between shrink-0 border-end"
          style={{
            width: sidebarExpanded ? "260px" : "80px",
            background: "#ffffff",
            borderRight: "1px solid #e0e0e0 !important",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 100,
            overflowY: "auto",
            maxHeight: "calc(100vh - 73px)",
            boxShadow: "2px 0 5px rgba(0,0,0,0.02)"
          }}
        >
          {/* Menu Items */}
          <div className="d-flex flex-column gap-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="btn w-100 text-start d-flex align-items-center gap-3 py-3 px-3 rounded border-0 mb-1"
                  style={{
                    background: isActive ? "#28a745" : "transparent", // Solid green for active
                    color: isActive ? "#ffffff" : "#4a4a4a", // White text if active, dark gray if not
                    transition: "all 0.2s",
                    fontWeight: isActive ? "600" : "500"
                  }}
                >
                  <span className="fs-5">{item.icon}</span>
                  {sidebarExpanded && <span className="fw-bold" style={{ fontSize: "15px" }}>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Profile Card & Logout Section */}
          <div className="mt-5 pt-4 border-top">
            {/* Branch Manager Card */}
            {sidebarExpanded ? (
              <div 
                className="p-3 mb-3 rounded d-flex align-items-center gap-3"
                style={{ background: "#f8f9fa", border: "1px solid #e0e0e0" }}
              >
                <div 
                  className="rounded-circle bg-white border border-success d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: "40px", height: "40px" }}
                >
                  👩💼
                </div>
                <div>
                  <strong className="text-dark d-block" style={{ fontSize: "14px" }}>Priya Sharma</strong>
                  <span className="text-secondary small d-block" style={{ fontSize: "11px" }}>Branch Manager</span>
                </div>
              </div>
            ) : (
              <div 
                className="text-center mb-3 cursor-pointer"
                onClick={() => setActiveTab("profile")}
                title="Priya Sharma (Branch Manager)"
                style={{ cursor: "pointer" }}
              >
                👩💼
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              style={{ fontSize: "14px" }}
            >
              <span>🚪</span>
              {sidebarExpanded && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-grow-1 overflow-auto" style={{ maxHeight: "calc(100vh - 73px)" }}>
          <div className="p-4">
            {apiLoading ? (
              <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-success mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
                <p className="text-secondary">Loading data from server…</p>
              </div>
            ) : null}
            {!apiLoading && renderContentTab()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Home;