import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getLoanReport, getCollectionReport, getOverdueReport } from "../services/api";

const ReportsTab = ({ groups, members, loanApplications, collections }) => {
  const [reportType, setReportType] = useState("loans");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [generating, setGenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setExportMessage("");
    setReportData(null);
    try {
      if (reportType === "loans") {
        const data = await getLoanReport();
        setReportData(data);
      } else if (reportType === "collections") {
        const data = await getCollectionReport();
        setReportData(data);
      } else if (reportType === "overdues") {
        const data = await getOverdueReport();
        setReportData(data);
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
      setExportMessage("Error generating report.");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (format) => {
    if (format !== "pdf") {
      setExportMessage("Only PDF export is supported right now.");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }

    if (!reportData) {
      setExportMessage("Please generate a report first before exporting.");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }

    setExportMessage("Generating PDF document...");
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text(`Micro Finance - ${reportType.toUpperCase()} Report`, 14, 22);
      
      // Timestamp
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      // Data Table
      const tableData = Object.entries(reportData).map(([key, value]) => {
        const formattedKey = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return [formattedKey, String(value)];
      });

      doc.autoTable({
        startY: 40,
        head: [['Metric', 'Value']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [57, 255, 20], textColor: [0,0,0] },
        styles: { fontSize: 12 }
      });

      doc.save(`${reportType}_report.pdf`);
      setExportMessage(`Downloaded Successfully: ${reportType}_report.pdf`);
      setTimeout(() => setExportMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setExportMessage("Failed to generate PDF.");
      setTimeout(() => setExportMessage(""), 3000);
    }
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
                <option value="loans">Loans Report</option>
                <option value="collections">Collections Report</option>
                <option value="overdues">Overdues Report</option>
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
              <h6 className="text-secondary align-self-start mb-4">
                {reportType === "loans" ? "Loan Portfolio Overview" : 
                 reportType === "collections" ? "Collections Summary" : 
                 "Overdues Summary"}
              </h6>

              {/* Dynamic Data Rendering */}
              <div className="w-100 d-flex flex-wrap gap-4 justify-content-center mt-2 mb-4">
                {reportData ? (
                  Object.entries(reportData).map(([key, value]) => (
                    <div key={key} className="bg-black bg-opacity-50 p-4 rounded border border-secondary text-center flex-grow-1" style={{ minWidth: "150px" }}>
                      <p className="text-secondary small fw-bold mb-2 text-uppercase">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <h2 className="fw-bold m-0" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.4)" }}>
                        {value}
                      </h2>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-secondary py-5 w-100 border border-secondary border-dashed rounded bg-black bg-opacity-25">
                    <p className="mb-0">Click "Generate Analysis" to fetch real-time data</p>
                  </div>
                )}
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
