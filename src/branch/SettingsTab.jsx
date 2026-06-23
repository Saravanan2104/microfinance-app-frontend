import React, { useState } from "react";

const SettingsTab = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Loan Settings States
  const [groupLoanRate, setGroupLoanRate] = useState("12.5");
  const [businessLoanRate, setBusinessLoanRate] = useState("14.0");
  const [emergencyLoanRate, setEmergencyLoanRate] = useState("8.0");
  const [minSavingsFee, setMinSavingsFee] = useState("10");

  // KPI Target States
  const [targetCollectionRate, setTargetCollectionRate] = useState("98");
  const [growthTarget, setGrowthTarget] = useState("15");

  // KYC Mandate States
  const [requireAadhar, setRequireAadhar] = useState(true);
  const [requirePAN, setRequirePAN] = useState(false);
  const [requireVoterID, setRequireVoterID] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Branch configurations saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1200);
  };

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
          Branch Settings & Control
        </h1>
        <p className="text-secondary mb-0">Configure operational rules, interest rates, and compliance parameters</p>
      </div>

      {successMsg && (
        <div className="alert alert-success py-2 mb-4 d-flex justify-content-between align-items-center">
          <span>{successMsg}</span>
          <span>✓</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings}>
        <div className="row g-4">
          
          {/* Left Column: Financial & KPI Configurations */}
          <div className="col-lg-8">
            
            {/* Loan Products Settings */}
            <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0 text-success">Loan Products & Interest Rates</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">General Group Loan Interest Rate (% p.a.)</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        step="0.1"
                        className="form-control bg-dark text-white border-secondary"
                        value={groupLoanRate}
                        onChange={(e) => setGroupLoanRate(e.target.value)}
                        required 
                      />
                      <span className="input-group-text bg-dark border-secondary text-secondary">%</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Micro-Business Development Rate (% p.a.)</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        step="0.1"
                        className="form-control bg-dark text-white border-secondary"
                        value={businessLoanRate}
                        onChange={(e) => setBusinessLoanRate(e.target.value)}
                        required 
                      />
                      <span className="input-group-text bg-dark border-secondary text-secondary">%</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Emergency Support Loan Rate (% p.a.)</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        step="0.1"
                        className="form-control bg-dark text-white border-secondary"
                        value={emergencyLoanRate}
                        onChange={(e) => setEmergencyLoanRate(e.target.value)}
                        required 
                      />
                      <span className="input-group-text bg-dark border-secondary text-secondary">%</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Minimum Initial Savings Requirement ($)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-secondary">$</span>
                      <input 
                        type="number" 
                        className="form-control bg-dark text-white border-secondary"
                        value={minSavingsFee}
                        onChange={(e) => setMinSavingsFee(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Performance KPI Targets */}
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0 text-success">Branch Performance KPI Targets</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Target Collection Rate (%)</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        className="form-control bg-dark text-white border-secondary"
                        value={targetCollectionRate}
                        onChange={(e) => setTargetCollectionRate(e.target.value)}
                        required 
                      />
                      <span className="input-group-text bg-dark border-secondary text-secondary">%</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-secondary small fw-bold">Target Monthly Member Growth (%)</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        className="form-control bg-dark text-white border-secondary"
                        value={growthTarget}
                        onChange={(e) => setGrowthTarget(e.target.value)}
                        required 
                      />
                      <span className="input-group-text bg-dark border-secondary text-secondary">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Compliance and Action Button */}
          <div className="col-lg-4">
            
            {/* KYC Compliance Mandate */}
            <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-header bg-transparent border-bottom border-secondary py-3">
                <h5 className="fw-bold mb-0 text-success">KYC Compliance Checklists</h5>
              </div>
              <div className="card-body">
                <p className="text-secondary small mb-3">Enforce mandatory verification fields prior to allowing loan disbursal applications.</p>
                
                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="aadharMandate" 
                    checked={requireAadhar}
                    onChange={(e) => setRequireAadhar(e.target.checked)}
                  />
                  <label className="form-check-label text-light small" htmlFor="aadharMandate">Require Aadhar Card Code</label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="panMandate" 
                    checked={requirePAN}
                    onChange={(e) => setRequirePAN(e.target.checked)}
                  />
                  <label className="form-check-label text-light small" htmlFor="panMandate">Require PAN Card Validation</label>
                </div>

                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="voterMandate" 
                    checked={requireVoterID}
                    onChange={(e) => setRequireVoterID(e.target.checked)}
                  />
                  <label className="form-check-label text-light small" htmlFor="voterMandate">Require Voter Identification ID</label>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="card-body">
                <button 
                  type="submit" 
                  className="btn w-100 fw-bold py-3" 
                  style={{ background: "#39FF14", color: "#000", border: "none" }}
                  disabled={saving}
                >
                  {saving ? "Saving Changes..." : "Apply Config Parameters"}
                </button>
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};

export default SettingsTab;
