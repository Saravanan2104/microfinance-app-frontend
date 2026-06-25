import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';

const AddMember = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: 'male',
    marital_status: 'single',
    phone: '',
    whatsapp_number: '',
    secondary_number: '',
    email: '',
    group_id: '',
    address: '',
    loan_amount: ''
  });
  const [groups, setGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${BASE_URL}/groups`);
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        }
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.phone) {
      return setError('First Name and Phone are required.');
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = { ...formData };
      delete payload.group_id; // Remove group_id from member creation payload
      delete payload.address;
      delete payload.loan_amount;

      // Convert empty strings to null for Pydantic Optional fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
          payload[key] = null;
        }
      });

      const response = await fetch(`${BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (formData.group_id) {
          await fetch(`${BASE_URL}/groups/${formData.group_id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ member_ids: [data.member_id] })
          });
        }

        if (formData.loan_amount && parseFloat(formData.loan_amount) > 0) {
          const loanPayload = {
            application_number: "APP" + Math.floor(Math.random() * 1000000),
            member_id: data.member_id,
            group_id: formData.group_id ? parseInt(formData.group_id) : 0, // Fallback to 0 for personal loans
            requested_amount: parseFloat(formData.loan_amount),
            loan_purpose: "Personal Request",
            created_by: 1
          };
          
          await fetch(`${BASE_URL}/loan-applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loanPayload)
          });
        }
        
        alert('Member created successfully!');
        onSuccess();
      } else {
        const errData = await response.json();
        setError(errData.detail || 'Failed to create member');
      }
    } catch (err) {
      setError('Network error. Ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="card border-0 rounded-4 mb-4 shadow-sm"
      style={{
        background: "#ffffff",
        border: "1px solid #dee2e6"
      }}
    >
      <div className="card-header bg-transparent border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
         <h5 className="fw-bold text-dark m-0">Add New Member</h5>
         {onCancel && <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Close</button>}
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">FIRST NAME *</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">LAST NAME</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">DATE OF BIRTH</label>
            <input type="date" className="form-control bg-white text-dark border-secondary" 
              name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">GENDER</label>
            <select className="form-select bg-white text-dark border-secondary" 
              name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">MARITAL STATUS</label>
            <select className="form-select bg-white text-dark border-secondary" 
              name="marital_status" value={formData.marital_status} onChange={handleChange}>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">PHONE NUMBER *</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">WHATSAPP NUMBER</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">SECONDARY NUMBER</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              name="secondary_number" value={formData.secondary_number} onChange={handleChange} />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label text-muted small fw-bold">ADDRESS</label>
            <textarea 
              className="form-control bg-white text-dark border-secondary" 
              name="address" 
              rows="2"
              value={formData.address} 
              onChange={handleChange} 
            ></textarea>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">ASSIGN TO GROUP (OPTIONAL)</label>
            <select className="form-select bg-white text-dark border-secondary" name="group_id" value={formData.group_id} onChange={handleChange}>
              <option value="">-- None --</option>
              {groups.map(g => (
                <option key={g.group_id} value={g.group_id}>{g.group_name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label text-muted small fw-bold">LOAN REQUEST AMOUNT (₹)</label>
            <input 
              type="number" 
              className="form-control bg-white text-dark border-secondary" 
              name="loan_amount" 
              value={formData.loan_amount} 
              onChange={handleChange} 
              placeholder="e.g. 50000"
            />
          </div>

          {error && <div className="col-12"><div className="alert alert-danger p-2 small">{error}</div></div>}

          <div className="col-12 mt-4 text-end">
            <button type="button" onClick={onCancel} className="btn me-2 fw-bold text-dark border-secondary">Cancel</button>
            <button type="submit" className="btn fw-bold text-white" style={{ background: "#198754" }} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
