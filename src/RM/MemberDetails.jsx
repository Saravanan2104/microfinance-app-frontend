import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';
import AddMember from './AddMember';

const MemberDetails = ({ onSelectGroup }) => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState([]);
  const [memberGroupMap, setMemberGroupMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/members`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          console.error("Failed to fetch members");
        }

        const groupsRes = await fetch(`${BASE_URL}/groups`);
        if (groupsRes.ok) {
          const groups = await groupsRes.json();
          const groupMapping = {};
          
          await Promise.all(groups.map(async (g) => {
            try {
              const gmRes = await fetch(`${BASE_URL}/groups/${g.group_id}/members`);
              if (gmRes.ok) {
                const gmData = await gmRes.json();
                gmData.forEach(gm => {
                  if (gm.status === 'ACTIVE') {
                    groupMapping[gm.member_id] = g;
                  }
                });
              }
            } catch (err) {
              console.error(err);
            }
          }));
          
          setMemberGroupMap(groupMapping);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMemberCreated = () => {
    setShowAddMember(false);
    setLoading(true);
    fetch(`${BASE_URL}/members`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .finally(() => setLoading(false));
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/members/${memberId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert("Member deleted successfully");
        setMembers(members.filter(m => m.member_id !== memberId));
      } else {
        const err = await response.json();
        alert(err.detail || "Failed to delete member");
      }
    } catch (err) {
      alert("Network error. Ensure backend is running.");
    }
  };

  const filteredMembers = members.filter(m => 
    (m.first_name + ' ' + (m.last_name || '')).toLowerCase().includes(search.toLowerCase()) || 
    m.member_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bolder text-dark mb-1">Member Directory</h3>
           <p className="text-muted">Search and manage member profiles.</p>
        </div>
        <button 
          onClick={() => setShowAddMember(true)}
          className="btn fw-bold px-4 rounded-pill text-white" 
          style={{ background: "#198754" }}
        >
          + Add Member
        </button>
      </div>

      {showAddMember && <AddMember onCancel={() => setShowAddMember(false)} onSuccess={handleMemberCreated} />}
      
      <div 
        className="card border-0 rounded-4 mb-4 p-4 d-flex align-items-center shadow-sm"
        style={{
          background: "#ffffff",
          border: "1px solid #dee2e6"
        }}
      >
           <div className="input-group" style={{ maxWidth: "600px", width: "100%" }}>
              <span className="input-group-text bg-transparent border-success text-dark px-3 py-2">🔍</span>
              <input 
                type="text" 
                className="form-control bg-white text-dark border-success px-3 py-2" 
                placeholder="Search by name or Member Code..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
      </div>

      {loading ? (
        <div className="text-center mt-5 text-dark opacity-75">Loading members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center mt-5 text-dark opacity-75">No members found.</div>
      ) : (
        <div className="row g-4">
          {filteredMembers.map(member => (
            <div className="col-md-6 col-lg-4" key={member.member_id}>
              <div 
                className="card h-100 border-0 rounded-4 shadow-sm"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dee2e6"
                }}
              >
                <div className="card-body p-4 position-relative">
                  <button 
                    className="btn btn-sm position-absolute" 
                    style={{ top: "15px", right: "15px", color: "#dc3545", background: "transparent", border: "none" }}
                    onClick={() => handleDeleteMember(member.member_id)}
                    title="Delete Member"
                  >
                    <span className="fs-5 fw-bold">×</span>
                  </button>

                  <div className="text-center mb-4 mt-2">
                    <div 
                      className="avatar rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bolder fs-3 text-white" 
                      style={{ width: "80px", height: "80px", background: "#198754" }}
                    >
                      {member.first_name[0]}{member.last_name ? member.last_name[0] : ''}
                    </div>
                    <h4 className="fw-bold text-dark mb-1">{member.first_name} {member.last_name}</h4>
                    <p className="text-muted small mb-0" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>{member.member_code}</p>
                  </div>
                  
                  <div 
                    className="d-flex justify-content-between text-center p-3 rounded-3 mb-4"
                    style={{ background: "#f8f9fa" }}
                  >
                     <div>
                        <p className="text-muted small fw-bold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>PHONE</p>
                        <h6 className="fw-bold text-dark m-0">{member.phone}</h6>
                     </div>
                     <div style={{ width: "1px", background: "#dee2e6" }}></div>
                     <div>
                        <p className="text-muted small fw-bold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>GENDER</p>
                        <h6 className="fw-bold text-dark m-0 text-capitalize">{member.gender || 'N/A'}</h6>
                     </div>
                  </div>

                  <div 
                    className="text-start p-3 rounded-3"
                    style={{ background: "#f8f9fa" }}
                  >
                     <p className="text-muted small fw-bold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>GROUP</p>
                     {memberGroupMap[member.member_id] ? (
                       <h6 
                         className="fw-bold m-0" 
                         style={{ color: "#198754", cursor: "pointer", textDecoration: "underline" }}
                         onClick={() => onSelectGroup && onSelectGroup(memberGroupMap[member.member_id])}
                         title="Click to view Group Details"
                       >
                         {memberGroupMap[member.member_id].group_name}
                       </h6>
                     ) : (
                       <h6 className="fw-bold m-0 text-muted">
                         No Group Assigned
                       </h6>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberDetails;
