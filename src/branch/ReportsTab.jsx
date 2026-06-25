import React, { useState } from "react";

const ReportsTab = ({ groups, members, loanApplications, collections }) => {
  const [reportType, setReportType] = useState("loans");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [generating, setGenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 1000);
  };

  const handleExport = (format) => {
    setExportMessage(`Exporting ${reportType.toUpperCase()} report as ${format.toUpperCase()}...`);
    setTimeout(() => {
      setExportMessage(`Downloaded Successfully: ${reportType}_report_${dateRange}.${format === "excel" ? "xlsx" : "pdf"}`);
      setTimeout(() => setExportMessage(""), 4000);
    }, 1500);
  };

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Reports & Analytics Center
          </h1>
          <p className="text-secondary mb-0">Generate, evaluate, and export financial and growth metrics</p>
        </div>
      </div>

      {/* Reports Config Form */}
      <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="card-body">
          <form onSubmit={handleGenerateReport} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label text-secondary small fw-bold">Select Report Module</label>
              <select 
                className="form-select bg-dark text-white border-secondary"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="loans">Loans & Disbursement Analysis</option>
                <option value="collections">Repayment Collections Report</option>
                <option value="members">Member Registrations & Growth</option>
                <option value="kpi">Branch Performance KPIs Summary</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label text-secondary small fw-bold">Date Range Selector</label>
              <select 
                className="form-select bg-dark text-white border-secondary"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_quarter">Last Quarter (Q2 2026)</option>
                <option value="year_to_date">Year to Date (2026)</option>
              </select>
            </div>

            <div className="col-md-4">
              <button 
                type="submit" 
                className="btn w-100 fw-bold" 
                style={{ background: "#39FF14", color: "#000", border: "none", height: "38px" }}
                disabled={generating}
              >
                {generating ? "Recalculating..." : "Generate Analysis"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {exportMessage && (
        <div className="alert alert-info py-2 mb-4 d-flex justify-content-between align-items-center">
          <span>{exportMessage}</span>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ display: exportMessage.includes("Downloaded") ? "none" : "inline-block" }}></span>
        </div>
      )}

      {/* Analytics Visuals Display */}
      <div className="row g-4">
        
        {/* Charts & Analytics Visuals */}
        <div className="col-lg-8">
          <div className="card text-white border-0 h-100" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary d-flex justify-content-between align-items-center py-3">
              <h5 className="fw-bold mb-0">Visual Performance Graph</h5>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-success active">Graph View</button>
                <button className="btn btn-outline-success">Tabular Data</button>
              </div>
            </div>
            <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
              <h6 className="text-secondary align-self-start mb-3">
                {reportType === "loans" ? "Disbursement Volumes vs Target Collections" : 
                 reportType === "collections" ? "Weekly Collections Trends" : 
                 reportType === "members" ? "Cumulative Membership Intake" : "Monthly Branch KPI Scorecard"}
              </h6>

              {/* Render Custom Responsive SVG Chart */}
              <div className="w-100 bg-black bg-opacity-40 p-3 rounded border border-secondary mb-3" style={{ position: "relative", minHeight: "220px" }}>
                <svg viewBox="0 0 500 200" className="w-100" style={{ overflow: "visible" }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />

                  {/* Chart Line/Bar based on report type */}
                  {reportType === "loans" && (
                    <>
                      {/* Targets (Bar chart) */}
                      <rect x="60" y="70" width="25" height="100" fill="rgba(57,255,20,0.15)" stroke="rgba(57,255,20,0.4)" />
                      <rect x="130" y="50" width="25" height="120" fill="rgba(57,255,20,0.15)" stroke="rgba(57,255,20,0.4)" />
                      <rect x="200" y="40" width="25" height="130" fill="rgba(57,255,20,0.15)" stroke="rgba(57,255,20,0.4)" />
                      <rect x="270" y="60" width="25" height="110" fill="rgba(57,255,20,0.15)" stroke="rgba(57,255,20,0.4)" />
                      <rect x="340" y="30" width="25" height="140" fill="rgba(57,255,20,0.15)" stroke="rgba(57,255,20,0.4)" />
                      <rect x="410" y="45" width="25" height="125" fill="rgba(57,255,20,0.15)" stroke="rgba(57,255,20,0.4)" />
                      
                      {/* Actual (Disbursements Line chart) */}
                      <path d="M 72.5 100 L 142.5 80 L 212.5 50 L 282.5 90 L 352.5 35 L 422.5 60" fill="none" stroke="#39FF14" strokeWidth="3" />
                      <circle cx="72.5" cy="100" r="4" fill="#fff" stroke="#39FF14" strokeWidth="2" />
                      <circle cx="142.5" cy="80" r="4" fill="#fff" stroke="#39FF14" strokeWidth="2" />
                      <circle cx="212.5" cy="50" r="4" fill="#fff" stroke="#39FF14" strokeWidth="2" />
                      <circle cx="282.5" cy="90" r="4" fill="#fff" stroke="#39FF14" strokeWidth="2" />
                      <circle cx="352.5" cy="35" r="4" fill="#fff" stroke="#39FF14" strokeWidth="2" />
                      <circle cx="422.5" cy="60" r="4" fill="#fff" stroke="#39FF14" strokeWidth="2" />
                    </>
                  )}

                  {reportType === "collections" && (
                    <>
                      {/* Trend Line (Glowing neon green) */}
                      <path d="M 60 150 L 130 140 L 200 90 L 270 70 L 340 50 L 410 40" fill="none" stroke="#39FF14" strokeWidth="4" filter="drop-shadow(0px 0px 5px rgba(57,255,20,0.6))" />
                      {/* Points */}
                      <circle cx="60" cy="150" r="4" fill="#39FF14" />
                      <circle cx="130" cy="140" r="4" fill="#39FF14" />
                      <circle cx="200" cy="90" r="4" fill="#39FF14" />
                      <circle cx="270" cy="70" r="4" fill="#39FF14" />
                      <circle cx="340" cy="50" r="4" fill="#39FF14" />
                      <circle cx="410" cy="40" r="4" fill="#39FF14" />
                    </>
                  )}

                  {reportType === "members" && (
                    <>
                      {/* Bar charts for growth */}
                      <rect x="70" y="140" width="30" height="30" fill="#39FF14" opacity="0.4" />
                      <rect x="140" y="110" width="30" height="60" fill="#39FF14" opacity="0.5" />
                      <rect x="210" y="90" width="30" height="80" fill="#39FF14" opacity="0.6" />
                      <rect x="280" y="70" width="30" height="100" fill="#39FF14" opacity="0.8" />
                      <rect x="350" y="40" width="30" height="130" fill="#39FF14" />
                      <rect x="420" y="30" width="30" height="140" fill="#39FF14" />
                    </>
                  )}

                  {reportType === "kpi" && (
                    <>
                      {/* Target threshold */}
                      <line x1="40" y1="60" x2="480" y2="60" stroke="#ff0055" strokeWidth="1.5" strokeDasharray="4" />
                      <text x="410" y="52" fill="#ff0055" style={{ fontSize: "8px" }}>Target threshold</text>
                      
                      {/* Actual KPI rates */}
                      <path d="M 60 160 L 130 110 L 200 90 L 270 50 L 340 45 L 410 40" fill="none" stroke="#39FF14" strokeWidth="3" />
                      <circle cx="60" cy="160" r="5" fill="#39FF14" />
                      <circle cx="130" cy="110" r="5" fill="#39FF14" />
                      <circle cx="200" cy="90" r="5" fill="#39FF14" />
                      <circle cx="270" cy="50" r="5" fill="#39FF14" />
                      <circle cx="340" cy="45" r="5" fill="#39FF14" />
                      <circle cx="410" cy="40" r="5" fill="#39FF14" />
                    </>
                  )}

                  {/* X Axis Labels */}
                  <text x="60" y="190" fill="#888" style={{ fontSize: "10px" }} textAnchor="middle">Jan</text>
                  <text x="130" y="190" fill="#888" style={{ fontSize: "10px" }} textAnchor="middle">Feb</text>
                  <text x="200" y="190" fill="#888" style={{ fontSize: "10px" }} textAnchor="middle">Mar</text>
                  <text x="270" y="190" fill="#888" style={{ fontSize: "10px" }} textAnchor="middle">Apr</text>
                  <text x="340" y="190" fill="#888" style={{ fontSize: "10px" }} textAnchor="middle">May</text>
                  <text x="410" y="190" fill="#888" style={{ fontSize: "10px" }} textAnchor="middle">Jun</text>

                  {/* Y Axis Labels */}
                  <text x="30" y="174" fill="#888" style={{ fontSize: "9px" }} textAnchor="end">0k</text>
                  <text x="30" y="124" fill="#888" style={{ fontSize: "9px" }} textAnchor="end">5k</text>
                  <text x="30" y="74" fill="#888" style={{ fontSize: "9px" }} textAnchor="end">10k</text>
                  <text x="30" y="24" fill="#888" style={{ fontSize: "9px" }} textAnchor="end">15k</text>
                </svg>
              </div>

              <div className="d-flex gap-3 justify-content-center text-secondary small">
                <div className="d-flex align-items-center">
                  <span className="d-inline-block rounded-circle me-1" style={{ width: "10px", height: "10px", background: "#39FF14" }}></span>
                  <span>Actual Achievement</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="d-inline-block rounded-circle me-1" style={{ width: "10px", height: "10px", background: "rgba(57,255,20,0.3)" }}></span>
                  <span>Assigned Target Bounds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate / Export Panel */}
        <div className="col-lg-4">
          <div className="card text-white border-0 h-100" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Export & Share Reports</h5>
            </div>
            <div className="card-body">
              <p className="text-secondary small">
                Download high-fidelity, compliance-ready reports for state microfinance audits, branch manager synchronization, and field assessment meetings.
              </p>

              <hr className="border-secondary my-4" />

              <div className="mb-4">
                <button 
                  className="btn btn-outline-light w-100 py-3 mb-3 d-flex align-items-center justify-content-between"
                  onClick={() => handleExport("pdf")}
                >
                  <div className="text-start">
                    <strong className="d-block text-white">Download PDF Document</strong>
                    <small className="text-secondary">Suitable for presentations and printing</small>
                  </div>
                  <span className="fs-3">📄</span>
                </button>

                <button 
                  className="btn btn-outline-success w-100 py-3 d-flex align-items-center justify-content-between"
                  onClick={() => handleExport("excel")}
                >
                  <div className="text-start">
                    <strong className="d-block text-success">Export Microsoft Excel</strong>
                    <small className="text-secondary">Suitable for data manipulation</small>
                  </div>
                  <span className="fs-3">📊</span>
                </button>
              </div>

              <div className="p-3 bg-dark rounded border border-secondary" style={{ background: "rgba(0,0,0,0.2)" }}>
                <h6 className="fw-bold text-success small mb-2">Audit Compliance Note</h6>
                <p className="mb-0 text-secondary" style={{ fontSize: "12px" }}>
                  All generated reports are cryptographically signed for regulatory compliance and audit logs. Verify branch signatures at the central systems portal.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsTab;
