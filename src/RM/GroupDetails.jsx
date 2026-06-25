import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';

const GroupDetails = ({ group, onOpenLoanForm, onCreateGroup }) => {
  const [activeGroup, setActiveGroup] = useState(group);
  const [allGroups, setAllGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [collectionInputs, setCollectionInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState('');
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [viewMode, setViewMode] = useState(group ? 'details' : 'grid');

  // Fetch all groups
  const fetchGroups = () => {
    fetch(`${BASE_URL}/groups`)
      .then(res => res.json())
      .then(data => {
        setAllGroups(data);
        if (data.length > 0) {
          const matchedGroup = data.find(g => g.group_id === activeGroup?.group_id || g.group_id === group?.group_id);
          if (matchedGroup || activeGroup) {
            setActiveGroup(matchedGroup || activeGroup);
          }
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGroups();
    if (group) {
      setActiveGroup(group);
      setViewMode('details');
    }
  }, [group]);

  const fetchAllMembers = () => {
    fetch(`${BASE_URL}/members`)
      .then(res => res.json())
      .then(data => setAllMembers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const handleRenameGroup = async () => {
    if (!editGroupName.trim()) return alert('Name cannot be empty');
    try {
      const response = await fetch(`${BASE_URL}/groups/${activeGroup.group_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_name: editGroupName })
      });
      if (response.ok) {
        setIsEditingName(false);
        fetchGroups(); // Refresh groups to get updated name
      } else {
        const err = await response.json();
        alert(err.detail || 'Failed to rename group');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const fetchGroupMembers = async () => {
    if (!activeGroup?.group_id) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/groups/${activeGroup.group_id}/members`);
      if (response.ok) {
        const data = await response.json();
        const membersRes = await fetch(`${BASE_URL}/members`);
        const membersData = await membersRes.json();
        
        const groupMembers = data.map(gm => {
          const memberDetails = membersData.find(m => m.member_id === gm.member_id) || {};
          return {
            ...gm,
            name: memberDetails.first_name ? `${memberDetails.first_name} ${memberDetails.last_name || ''}` : `Member ${gm.member_id}`,
            outstanding: 0 // Mock for now until API provides it
          };
        });
        setMembers(groupMembers);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeGroup) {
      fetchGroupMembers();
    }
  }, [activeGroup]);

  const handleCollectionChange = (memberId, value) => {
    setCollectionInputs({ ...collectionInputs, [memberId]: value });
  };

  const submitCollection = async (memberId) => {
    const amount = collectionInputs[memberId];
    if (!amount) return alert('Enter an amount first');

    alert(`Mock Collection of ₹${amount} saved!`);
    setCollectionInputs({ ...collectionInputs, [memberId]: '' });
  };

  const handleAssignRole = async (memberId, role) => {
    try {
      const endpoint = role === 'head' ? 'assign-head' : 'assign-sub-head';
      const payload = {
        member_id: memberId,
        changed_by_employee_id: 1, // Mock employee ID
        remarks: "Assigned via RM Dashboard"
      };
      
      const response = await fetch(`${BASE_URL}/groups/${activeGroup.group_id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const updatedGroup = await response.json();
        setActiveGroup(updatedGroup);
        alert(`Successfully assigned as Group ${role === 'head' ? 'Head' : 'Sub-Head'}!`);
        fetchGroupMembers();
      } else {
        const err = await response.json();
        alert(err.detail || 'Failed to assign role.');
      }
    } catch (err) {
      alert('Network error during role assignment.');
    }
  };

  const handleAddMemberToGroup = async () => {
    if (!selectedMemberToAdd) return alert('Please select a member to add.');
    
    try {
      const response = await fetch(`${BASE_URL}/groups/${activeGroup.group_id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_ids: [parseInt(selectedMemberToAdd)] })
      });
      
      if (response.ok) {
        alert('Member successfully added to group!');
        setSelectedMemberToAdd('');
        fetchGroupMembers();
        fetchAllMembers();
      } else {
        const err = await response.json();
        alert(err.detail || 'Failed to add member to group.');
      }
    } catch (err) {
      alert('Network error while adding member.');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member from the group?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/groups/${activeGroup.group_id}/members/${memberId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert("Member removed from group.");
        fetchGroupMembers();
        fetchAllMembers();
      } else {
        const err = await response.json();
        alert(err.detail || "Failed to remove member.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  if (!activeGroup) {
    return <div className="text-center mt-5 text-light opacity-75">No groups available. Please create a group first.</div>;
  }

  // Filter out members that are already in ANY group
  const availableMembersToAdd = allMembers.filter(m => !m.group_id);

  if (viewMode === 'grid') {
    return (
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bolder text-dark mb-1" style={{ fontSize: "2rem" }}>Groups Directory</h3>
            <p className="text-muted small m-0">Select a group to view its members and details.</p>
          </div>
          {onCreateGroup && (
            <button className="btn fw-bold px-4 rounded-pill text-white" style={{ background: "#198754" }} onClick={onCreateGroup}>
              + New Group
            </button>
          )}
        </div>

        {allGroups.length === 0 ? (
          <div className="text-center mt-5 text-muted">No groups found. Create one to get started.</div>
        ) : (
          <div className="row g-4">
            {allGroups.map(g => (
              <div className="col-md-6 col-lg-4" key={g.group_id}>
                <div 
                  className="card h-100 border-0 rounded-4 shadow-sm"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dee2e6",
                    cursor: "pointer",
                    transition: "transform 0.2s ease"
                  }}
                  onClick={() => {
                    setActiveGroup(g);
                    setViewMode('details');
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body p-4 text-center">
                    <div 
                      className="avatar rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bolder fs-4 text-white" 
                      style={{ width: "60px", height: "60px", background: "#198754" }}
                    >
                      {g.group_name.substring(0, 2).toUpperCase()}
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{g.group_name}</h5>
                    <p className="text-muted small mb-3" style={{ fontSize: "0.8rem" }}>{g.group_code}</p>

                    <div 
                      className="d-flex justify-content-center text-start p-3 rounded-3 mb-3"
                      style={{ background: "#f8f9fa" }}
                    >
                       <div className="text-center">
                          <p className="text-muted small fw-bold mb-1" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>LIMIT AMOUNT</p>
                          <h6 className="fw-bold m-0" style={{ color: "#198754" }}>₹{g.group_limit_amount || 0}</h6>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="mb-3">
         <button 
           className="btn btn-sm fw-bold px-3 py-2 border-0" 
           onClick={() => setViewMode('grid')}
           style={{ color: "#198754", background: "transparent" }}
         >
           ← Back to Groups List
         </button>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <div className="d-flex align-items-center gap-3 mb-2">
             <h3 className="fw-bolder text-dark mb-0" style={{ fontSize: "2rem" }}>Group Details</h3>
             
             {!isEditingName ? (
               <>
                 <select 
                   className="form-select form-select-sm text-dark fw-bold shadow-none"
                   style={{ 
                     width: "auto",
                     minWidth: "150px",
                     backgroundColor: "#ffffff",
                     border: "1px solid #198754",
                     cursor: "pointer"
                   }}
                   value={activeGroup.group_id}
                   onChange={(e) => {
                     const selected = allGroups.find(g => g.group_id === parseInt(e.target.value));
                     setActiveGroup(selected);
                   }}
                 >
                   {allGroups.map(g => (
                     <option key={g.group_id} value={g.group_id} style={{ backgroundColor: "#ffffff", color: "#333" }}>
                       {g.group_name} ({g.group_code})
                     </option>
                   ))}
                 </select>
                 <button className="btn btn-sm text-muted border-secondary" style={{ background: "transparent" }} onClick={() => { setIsEditingName(true); setEditGroupName(activeGroup.group_name); }}>✏️ Edit</button>
                 {onCreateGroup && <button className="btn btn-sm fw-bold text-white" style={{ background: "#198754" }} onClick={onCreateGroup}>+ New Group</button>}
               </>
             ) : (
               <>
                 <input 
                   type="text" 
                   className="form-control form-control-sm bg-white text-dark border-success" 
                   style={{ width: "250px" }}
                   value={editGroupName}
                   onChange={e => setEditGroupName(e.target.value)}
                 />
                 <button className="btn btn-sm fw-bold text-white" style={{ background: "#198754" }} onClick={handleRenameGroup}>Save</button>
                 <button className="btn btn-sm btn-secondary fw-bold" onClick={() => setIsEditingName(false)}>Cancel</button>
               </>
             )}
             
           </div>
           <p className="text-muted small m-0">Manage members and daily collections for {activeGroup.group_name}.</p>
        </div>
        <button className="btn fw-bold px-4 rounded-pill text-white" style={{ background: "#198754" }}>Export Report</button>
      </div>

      {/* Add Member to Group Section */}
      <div 
        className="card border-0 rounded-4 mb-4 shadow-sm"
        style={{
          background: "#ffffff",
          border: "1px solid #dee2e6"
        }}
      >
        <div className="card-body p-4">
           <h6 className="fw-bold text-dark mb-3">Add Existing Member to {activeGroup.group_name}</h6>
           <div className="d-flex gap-3">
             <select 
               className="form-select text-dark border-success flex-grow-1"
               style={{ background: "#ffffff" }}
               value={selectedMemberToAdd}
               onChange={(e) => setSelectedMemberToAdd(e.target.value)}
             >
               <option value="">-- Select a Member --</option>
               {availableMembersToAdd.map(m => (
                 <option key={m.member_id} value={m.member_id}>{m.first_name} {m.last_name} ({m.member_code})</option>
               ))}
             </select>
             <button 
               onClick={handleAddMemberToGroup}
               className="btn fw-bold px-4 rounded text-white"
               style={{ background: "#198754" }}
             >
               Add to Group
             </button>
           </div>
        </div>
      </div>

      <div 
        className="card border-0 rounded-4 shadow-sm"
        style={{
          background: "#ffffff",
          border: "1px solid #dee2e6"
        }} >
        <div className="card-header bg-transparent border-0 pt-4 pb-2 px-4">
           <h5 className="fw-bold text-dark m-0">Members List</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>MEMBER NAME</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>STATUS</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>ROLE</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>OUTSTANDING (₹)</th>
                  <th className="px-4 py-3 border-0 fw-bold" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>TODAY'S COLLECTION</th>
                  <th className="px-4 py-3 border-0 fw-bold text-end" style={{ color: "#198754", fontSize: "0.85rem", letterSpacing: "0.5px" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">Loading members...</td></tr>
                ) : members.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No members found in this group.</td></tr>
                ) : (
                  members.map(member => (
                    <tr key={member.group_member_id} style={{ borderBottom: "1px solid #e9ecef" }}>
                      <td className="px-4 py-4 text-dark fw-bold">
                        <span 
                          style={{ cursor: "pointer", color: "#198754" }} 
                          title="View Member Profile"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('NAVIGATE_TO_MEMBER', { detail: member.member_id }));
                          }}
                        >
                          {member.name}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="badge rounded-pill px-3 py-1" style={{ background: "rgba(25, 135, 84, 0.1)", color: "#198754" }}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {activeGroup.head_member_id === member.member_id ? (
                          <span className="badge rounded-pill px-3 py-1 bg-primary text-white">Group Head</span>
                        ) : activeGroup.sub_head_member_id === member.member_id ? (
                          <span className="badge rounded-pill px-3 py-1 bg-info text-dark">Sub-Head</span>
                        ) : (
                          <span className="badge rounded-pill px-3 py-1 bg-secondary text-white">Member</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-dark fw-bold">{member.outstanding}</td>
                      <td className="px-4 py-4" style={{ minWidth: "200px" }}>
                        <div className="d-flex align-items-center">
                          <input 
                            type="number" 
                            className="form-control form-control-sm bg-white text-dark border-success me-2 fw-bold"
                            style={{ maxWidth: "120px" }}
                            value={collectionInputs[member.member_id] || ''}
                            onChange={(e) => handleCollectionChange(member.member_id, e.target.value)}
                          />
                          <button 
                            onClick={() => submitCollection(member.member_id)}
                            className="btn btn-sm fw-bold px-3 rounded text-white"
                            style={{ background: "#198754" }}
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-end">
                        <div className="d-flex gap-2 justify-content-end align-items-center">
                          <div className="dropdown">
                            <button className="btn btn-sm fw-bold rounded-pill dropdown-toggle" style={{ border: "1px solid #198754", color: "#198754", background: "transparent" }} data-bs-toggle="dropdown">
                              Assign Role
                            </button>
                            <ul className="dropdown-menu shadow" style={{ background: "#fff", border: "1px solid #198754" }}>
                              <li><button className="dropdown-item fw-bold text-dark" onClick={() => handleAssignRole(member.member_id, 'head')}>Make Group Head</button></li>
                              <li><button className="dropdown-item fw-bold text-dark" onClick={() => handleAssignRole(member.member_id, 'sub-head')}>Make Sub-Head</button></li>
                            </ul>
                          </div>
                          <button 
                            onClick={() => onOpenLoanForm(member)}
                            className="btn btn-sm fw-bold rounded-pill px-3 text-white"
                            style={{ background: "#198754" }}
                          >
                            New Loan
                          </button>
                          <button 
                            onClick={() => handleRemoveMember(member.member_id)}
                            className="btn btn-sm fw-bold rounded-pill px-3"
                            style={{ background: "#dc3545", color: "#fff", border: "none" }}
                          >
                            Clear
                          </button>
                        </div>
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

export default GroupDetails;