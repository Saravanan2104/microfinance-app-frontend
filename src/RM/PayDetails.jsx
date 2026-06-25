import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';

const PayDetails = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch(`${BASE_URL}/loan-applications`);
        if (response.ok) {
          const data = await response.json();
          setLoans(data);
        } else {
          console.error("Failed to fetch loan applications");
        }
      } catch (error) {
        console.error("Error fetching loan applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const filteredPayments = loans.filter(loan => 
    filterDate ? new Date(loan.applied_date).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bolder text-dark mb-1" style={{ fontSize: "2rem" }}>Loan & Payment Details</h3>
           <p className="text-muted small m-0">Overview of recent loan applications and status.</p>
        </div>
        <div className="d-flex gap-2">
          <input 
            type="date" 
            className="form-control bg-white text-dark border-success shadow-none" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>
      
      <div 
        className="card border-0 rounded-4 shadow-sm"
        style={{
          background: "#ffffff",
          border: "1px solid #dee2e6"
        }}
      >
        <div className="card-header bg-transparent border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
           <h5 className="fw-bold text-dark m-0">All Loan Applications</h5>
           {filterDate && (
             <span className="badge text-white px-3 py-2" style={{ background: "#198754" }}>
               Filtered: {filterDate}
             </span>
           )}
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>APP NUMBER</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>MEMBER ID</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>REQUESTED AMOUNT (₹)</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>DATE</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>GROUP ID</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>STATUS</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">Loading payments...</td></tr>
                ) : filteredPayments.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No payments found for this date.</td></tr>
                ) : (
                  filteredPayments.map(pay => (
                    <tr key={pay.loan_application_id} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td className="px-4 py-3 text-dark">#{pay.application_number}</td>
                      <td className="px-4 py-3 fw-bold text-dark">{pay.member_id}</td>
                      <td className="px-4 py-3 fw-bold" style={{ color: "#198754" }}>₹{pay.requested_amount}</td>
                      <td className="px-4 py-3 text-muted">{new Date(pay.applied_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-muted">EMP-{pay.group_id}</td>
                      <td className="px-4 py-3 text-muted">
                        <span className={`badge rounded-pill ${pay.application_status === 'APPROVED' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                          {pay.application_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayDetails;
