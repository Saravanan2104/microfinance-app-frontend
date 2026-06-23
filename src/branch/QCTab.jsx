import React from "react";

const QCTab = () => {
  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
            Quality Control
          </h1>
          <p className="text-secondary mb-0">Audit, compliance, and quality assurance processes</p>
        </div>
      </div>

      <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(57,255,20,0.2)" }}>
        <div className="card-body p-5 text-center">
          <div className="rounded-circle bg-dark d-inline-flex justify-content-center align-items-center border border-success mb-3" style={{ width: "80px", height: "80px" }}>
            <span className="fs-1">✅</span>
          </div>
          <h4 className="fw-bold text-success">Quality Control Dashboard</h4>
          <p className="text-secondary">This section is currently under development. Here you will be able to review audits, approve disbursements, and perform KYC compliance checks.</p>
        </div>
      </div>
    </div>
  );
};

export default QCTab;
