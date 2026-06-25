import React, { useState } from 'react';
import BASE_URL from '../services/api';

const LoanRequestForm = ({ member, onCancel }) => {
  const [formData, setFormData] = useState({ amount: '', purpose: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(member ? member.member_id : '');

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/members`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMemberId) {
      return setError('Please select a member for this loan request.');
    }
    if (!formData.amount || formData.amount <= 0) {
      return setError('Please enter a valid loan amount.');
    }
    if (formData.purpose.trim() === '') {
      return setError('Please specify the purpose of the loan.');
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        application_number: "APP-" + Date.now(), 
        member_id: parseInt(selectedMemberId),
        group_id: member && member.group_id ? member.group_id : 0,
        requested_amount: parseFloat(formData.amount),
        loan_purpose: formData.purpose,
        created_by: 1 // Mock employee ID for now
      };

      const response = await fetch(`${BASE_URL}/loan-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const createdLoan = await response.json();
        
        // 2. Automatically submit to QC workflow
        const submitResponse = await fetch(`${BASE_URL}/loan-applications/${createdLoan.loan_application_id}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ remarks: "Submitted automatically by RM" })
        });

        if (submitResponse.ok) {
          alert('Loan Request Created and Sent to Quality Checker successfully!');
          onCancel();
        } else {
          setError('Loan created, but failed to send to Quality Checker.');
        }
      } else {
        const errData = await response.json();
        setError(errData.detail || 'Failed to submit loan request');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('A network error occurred. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-0 d-flex justify-content-center pt-4">
      <div 
        className="card border-0 rounded-4 w-100 shadow-sm" 
        style={{ 
          maxWidth: "550px",
          background: "#ffffff",
          border: "1px solid #dee2e6"
        }}
      >
        <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4 text-center">
           <div className="mb-3">
              <span className="badge rounded-pill px-3 py-2 fw-bold text-white" style={{ background: "#198754" }}>New Loan Request</span>
           </div>
           <h3 className="fw-bolder text-dark mb-1">
             {member ? `Apply for ${member.first_name || member.name}` : 'Submit a Loan Application'}
           </h3>
           <p className="text-muted small m-0">Fill out the details below to request a new loan.</p>
        </div>
        <div className="card-body p-4">
          
          {!member && (
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold" style={{ letterSpacing: "1px" }}>SELECT MEMBER</label>
              <select 
                className="form-select bg-white text-dark border-success fw-bold p-3"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="">-- Choose a member --</option>
                {members.map(m => (
                  <option key={m.member_id} value={m.member_id}>
                    {m.first_name} {m.last_name} ({m.member_code})
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="alert alert-danger p-2 small">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold" style={{ letterSpacing: "1px" }}>LOAN AMOUNT (₹)</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-success text-dark fw-bold">₹</span>
                <input 
                  type="number" 
                  className="form-control bg-white text-dark border-success fw-bold p-3 shadow-none" 
                  placeholder="e.g. 50000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small fw-bold" style={{ letterSpacing: "1px" }}>LOAN PURPOSE</label>
              <textarea 
                className="form-control bg-white text-dark border-success p-3 shadow-none" 
                rows="3" 
                placeholder="Describe the reason for the loan..."
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="d-flex gap-3 pt-2">
               <button 
                 type="submit" 
                 className="btn fw-bold py-3 w-100 text-white" 
                 style={{ background: "#198754" }}
                 disabled={isSubmitting}
               >
                 {isSubmitting ? 'Submitting...' : 'Submit Request'}
               </button>
               <button 
                 type="button" 
                 className="btn btn-outline-secondary fw-bold py-3 w-100"
                 onClick={onCancel}
               >
                 Cancel
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestForm;