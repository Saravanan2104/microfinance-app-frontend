import React, { useState } from 'react';
import BASE_URL from '../services/api';

const AddGroup = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    group_code: '',
    group_name: '',
    group_limit_amount: 100000, // default limit
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.group_name || !formData.group_code) {
      return setError('Group Name and Code are required.');
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Hardcoding relations as per instruction since auth isn't fully set
      const payload = {
        ...formData,
        branch_id: 1,
        location_id: 1,
        relationship_manager_employee_id: 1
      };

      const response = await fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Group created successfully!');
        onSuccess();
      } else {
        const errData = await response.json();
        setError(errData.detail || 'Failed to create group');
      }
    } catch (err) {
      setError('Network error. Ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="card border-0 rounded-4 w-100 mb-4 shadow-sm"
      style={{
        background: "#ffffff",
        border: "1px solid #dee2e6"
      }}
    >
      <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
         <h4 className="fw-bolder text-dark m-0">Create New Group</h4>
         {onCancel && <button className="btn btn-sm btn-outline-secondary" onClick={onCancel}>Close</button>}
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted fw-bold small">GROUP NAME *</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              value={formData.group_name} onChange={e => setFormData({...formData, group_name: e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted fw-bold small">GROUP CODE *</label>
            <input type="text" className="form-control bg-white text-dark border-secondary" 
              placeholder="e.g. GRP-001"
              value={formData.group_code} onChange={e => setFormData({...formData, group_code: e.target.value})} />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted fw-bold small">GROUP LIMIT AMOUNT (₹)</label>
            <input type="number" className="form-control bg-white text-dark border-secondary" 
              value={formData.group_limit_amount} onChange={e => setFormData({...formData, group_limit_amount: parseFloat(e.target.value)})} />
          </div>

          {error && <div className="col-12"><div className="alert alert-danger p-2 small">{error}</div></div>}

          <div className="col-12 mt-4 text-end">
            <button type="button" onClick={onCancel} className="btn me-2 fw-bold text-dark border-secondary">Cancel</button>
            <button type="submit" className="btn fw-bold text-white" style={{ background: "#198754" }} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
