import React, { useState } from "react";

const AlertsTab = ({ alerts, setAlerts }) => {
  const [filter, setFilter] = useState("all");

  const handleDismiss = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleClearAll = () => {
    setAlerts([]);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === "all") return true;
    if (filter === "critical") return a.type === "danger";
    if (filter === "warnings") return a.type === "warning";
    if (filter === "approvals") return a.category === "Approvals" || a.category === "KYC";
    return true;
  });

  const getAlertBadge = (type) => {
    switch (type) {
      case "danger":
        return <span className="badge bg-danger">Critical Risk</span>;
      case "warning":
        return <span className="badge bg-warning text-black">Warning Action</span>;
      case "success":
        return <span className="badge bg-success">Action Complete</span>;
      default:
        return <span className="badge bg-info">Information</span>;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "danger":
        return "🚨";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Notifications & Alerts
          </h1>
          <p className="text-secondary mb-0">System alerts, overdue repayment reminders, and manager tasks</p>
        </div>
        {alerts.length > 0 && (
          <button 
            className="btn btn-outline-danger btn-sm fw-bold"
            onClick={handleClearAll}
          >
            Clear All Alerts
          </button>
        )}
      </div>

      <div className="row g-4">
        
        {/* Navigation Categories Card */}
        <div className="col-md-3">
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h6 className="fw-bold mb-0">Categories</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush rounded bg-transparent">
                <button 
                  className={`list-group-item list-group-item-action bg-transparent border-bottom border-dark text-start py-3 ${filter === "all" ? "text-success fw-bold" : "text-white"}`}
                  onClick={() => setFilter("all")}
                >
                  All Alerts <span className="badge bg-secondary float-end">{alerts.length}</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action bg-transparent border-bottom border-dark text-start py-3 ${filter === "critical" ? "text-danger fw-bold" : "text-white"}`}
                  onClick={() => setFilter("critical")}
                >
                  Critical Risk <span className="badge bg-danger float-end">{alerts.filter(a => a.type === "danger").length}</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action bg-transparent border-bottom border-dark text-start py-3 ${filter === "warnings" ? "text-warning fw-bold" : "text-white"}`}
                  onClick={() => setFilter("warnings")}
                >
                  Action Warnings <span className="badge bg-warning text-black float-end">{alerts.filter(a => a.type === "warning").length}</span>
                </button>
                <button 
                  className={`list-group-item list-group-item-action bg-transparent border-0 text-start py-3 ${filter === "approvals" ? "text-info fw-bold" : "text-white"}`}
                  onClick={() => setFilter("approvals")}
                >
                  Pending Approvals <span className="badge bg-info float-end">{alerts.filter(a => a.category === "Approvals" || a.category === "KYC").length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Listings */}
        <div className="col-md-9">
          {filteredAlerts.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {filteredAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="card text-white border-0" 
                  style={{ 
                    background: "rgba(255,255,255,0.03)", 
                    borderLeft: `4px solid ${
                      alert.type === "danger" ? "#ff0055" : 
                      alert.type === "warning" ? "#ffbb00" : 
                      alert.type === "success" ? "#00ff77" : "#00aaff"
                    }`
                  }}
                >
                  <div className="card-body p-4 d-flex align-items-start gap-3">
                    <span className="fs-3">{getAlertIcon(alert.type)}</span>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        {getAlertBadge(alert.type)}
                        <small className="text-secondary font-monospace">{alert.time}</small>
                      </div>
                      <p className="mb-0 text-light py-2">{alert.message}</p>
                      
                      {/* Action items based on notification type */}
                      <div className="d-flex gap-2 mt-2">
                        {alert.type === "danger" && (
                          <button className="btn btn-sm btn-outline-danger">Schedule Urgent Collections Call</button>
                        )}
                        {(alert.category === "Approvals" || alert.category === "KYC") && (
                          <button className="btn btn-sm btn-outline-info">Redirect to Approvals Queue</button>
                        )}
                        <button 
                          className="btn btn-sm btn-link text-secondary text-decoration-none"
                          onClick={() => handleDismiss(alert.id)}
                        >
                          Dismiss Alert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-white border-0 text-center py-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="card-body">
                <span className="fs-1">🔔</span>
                <h5 className="fw-bold mt-3">Alert Stream Clear</h5>
                <p className="text-secondary small">No notifications found under the selected category filters.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AlertsTab;
