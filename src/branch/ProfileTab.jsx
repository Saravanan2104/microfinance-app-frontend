import React from "react";

const ProfileTab = () => {
  const profile = {
    name: "Priya Sharma",
    role: "Branch Manager",
    branch: "North Metro Branch (BR041)",
    email: "priya.sharma@womensgroup-microfinance.org",
    phone: "+91 98123 45678",
    joinedDate: "October 12, 2024",
    bio: "Dedicated to driving financial inclusion and women empowerment through localized microfinance self-help groups. Managing field operations, portfolios, audits, and capacity building for self-help groups in the metro region.",
    stats: {
      loansApproved: 342,
      totalDisbursed: "$1,824,500",
      activeGroups: 18,
      branchRating: "4.9 / 5.0 (Top Decile)"
    }
  };

  const badges = [
    { title: "Empowerment Catalyst", description: "Successfully supported the registration of over 15 active groups.", icon: "🌟" },
    { title: "Portfolio Guardian", description: "Maintained a Collection Rate above 98% for three consecutive quarters.", icon: "🛡️" },
    { title: "Compliance Champion", description: "Flawless audit records for KYC validation and fund releases.", icon: "🏆" }
  ];

  return (
    <div className="container-fluid py-4 text-white">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ color: "#39FF14", textShadow: "0 0 10px rgba(57, 255, 20, 0.3)" }}>
          Branch Manager Profile
        </h1>
        <p className="text-secondary mb-0">View profile information, permissions, and operational performance badges</p>
      </div>

      <div className="row g-4">
        
        {/* Profile Card Summary */}
        <div className="col-lg-4">
          <div className="card text-white border-0 text-center p-4 h-100" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-body d-flex flex-column align-items-center">
              
              {/* Mock Avatar */}
              <div 
                className="rounded-circle overflow-hidden mb-3 border border-success d-flex justify-content-center align-items-center bg-dark"
                style={{ width: "128px", height: "128px", boxShadow: "0 0 20px rgba(57,255,20,0.2)" }}
              >
                {/* Visual Avatar Placeholder since we use SVG / Emoji */}
                <span className="fs-1">👩💼</span>
              </div>

              <h4 className="fw-bold mb-1 text-white">{profile.name}</h4>
              <p className="text-success small fw-bold mb-3">{profile.role}</p>
              
              <div className="badge bg-dark border border-secondary text-secondary-emphasis px-3 py-2 mb-4 font-monospace">
                ID: BM-2024-0891
              </div>

              <hr className="border-secondary w-100" />

              <div className="w-100 text-start mt-3" style={{ fontSize: "14px" }}>
                <div className="mb-2">
                  <span className="text-secondary d-block small">Email Address</span>
                  <span className="text-light">{profile.email}</span>
                </div>
                <div className="mb-2">
                  <span className="text-secondary d-block small">Mobile Line</span>
                  <span className="text-light">{profile.phone}</span>
                </div>
                <div>
                  <span className="text-secondary d-block small">Tenure Commencement</span>
                  <span className="text-light">{profile.joinedDate}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Operational Overview & Achievements */}
        <div className="col-lg-8">
          
          {/* Performance stats row */}
          <div className="card text-white border-0 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Operational Performance Overview</h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4 text-center">
                <div className="col-sm-6 col-md-3">
                  <span className="text-secondary small">Loans Authorized</span>
                  <h3 className="fw-bold mt-1 text-white">{profile.stats.loansApproved}</h3>
                </div>
                <div className="col-sm-6 col-md-3">
                  <span className="text-secondary small">Total Disbursed</span>
                  <h3 className="fw-bold mt-1 text-success">{profile.stats.totalDisbursed}</h3>
                </div>
                <div className="col-sm-6 col-md-3">
                  <span className="text-secondary small">Active Groups</span>
                  <h3 className="fw-bold mt-1 text-info">{profile.stats.activeGroups}</h3>
                </div>
                <div className="col-sm-6 col-md-3">
                  <span className="text-secondary small">Efficiency Score</span>
                  <h3 className="fw-bold mt-1 text-warning" style={{ fontSize: "18px", marginTop: "8px" }}>{profile.stats.branchRating}</h3>
                </div>
              </div>

              <hr className="border-secondary my-4" />

              <h6 className="fw-bold text-success mb-2">Priya's Bio & Leadership Mission</h6>
              <p className="text-secondary" style={{ lineHeight: "1.6" }}>
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="card text-white border-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="card-header bg-transparent border-bottom border-secondary py-3">
              <h5 className="fw-bold mb-0">Accredited Achievement Badges</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {badges.map((badge, idx) => (
                  <div key={idx} className="col-md-4">
                    <div className="p-3 h-100 rounded border border-secondary" style={{ background: "rgba(0,0,0,0.15)" }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fs-4">{badge.icon}</span>
                        <strong className="text-success small">{badge.title}</strong>
                      </div>
                      <p className="mb-0 text-secondary" style={{ fontSize: "12px", lineHeight: "1.4" }}>
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileTab;
