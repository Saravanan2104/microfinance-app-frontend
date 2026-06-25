import React, { useState } from 'react';
import Dashboard from './Dashboard';
import GroupDetails from './GroupDetails';
import LoanRequestForm from './LoanRequestForm';
import MemberDetails from './MemberDetails';
import PayDetails from './PayDetails';

import AddGroup from './AddGroup';
import AddMember from './AddMember';

const RMMain = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setActiveTab('GroupDetails');
  };

  const handleOpenLoanForm = (member) => {
    setSelectedMember(member);
    setActiveTab('LoanRequest');
  };

  React.useEffect(() => {
    const handleNavigate = (e) => {
      // e.detail is the member_id
      // In MemberDetails, it currently shows all members. We could potentially set a selected member,
      // but for now, navigating to the MemberDetails tab is the intended action.
      setActiveTab('MemberDetails');
    };
    window.addEventListener('NAVIGATE_TO_MEMBER', handleNavigate);
    return () => window.removeEventListener('NAVIGATE_TO_MEMBER', handleNavigate);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onSelectGroup={handleSelectGroup} onChangeTab={setActiveTab} />;
      case 'GroupDetails':
        return <GroupDetails group={selectedGroup || { group_id: 1, group_name: 'Sample Group' }} onOpenLoanForm={handleOpenLoanForm} onCreateGroup={() => setActiveTab('AddGroup')} />;
      case 'LoanRequest':
        return <LoanRequestForm member={selectedMember} onCancel={() => setActiveTab('Dashboard')} />;
      case 'MemberDetails':
        return <MemberDetails onSelectGroup={handleSelectGroup} />;
      case 'PayDetails':
        return <PayDetails />;
      case 'AddGroup':
        return <AddGroup onCancel={() => setActiveTab('Dashboard')} onSuccess={() => setActiveTab('Dashboard')} />;
      case 'AddMember':
        return <AddMember onCancel={() => setActiveTab('Dashboard')} onSuccess={() => setActiveTab('Dashboard')} />;
      default:
        return <Dashboard onSelectGroup={handleSelectGroup} />;
    }
  };

  return (
    <div
      className="container-fluid vh-100 d-flex p-0 overflow-hidden"
      style={{
        background: "#f8f9fa",
        color: "#333",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Sidebar */}
      <div 
        className={`d-flex flex-column flex-shrink-0 p-3 transition-all ${isSidebarOpen ? 'w-25' : 'd-none'}`} 
        style={{
          maxWidth: "240px",
          background: "#ffffff",
          borderRight: "1px solid #e9ecef"
        }}
      >
        <div className="d-flex align-items-center mb-4 mt-2 px-2">
          <span className="fs-4 fw-bolder" style={{ color: "#198754" }}>DashLite</span>
          <span className="fs-6 fw-bold ms-1 text-dark">.RM</span>
        </div>
        
        <p className="text-muted small fw-bold mb-2 px-2">MENU</p>
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          {['Dashboard', 'GroupDetails', 'LoanRequest', 'MemberDetails', 'PayDetails', 'AddMember'].map(tab => {
            const isActive = activeTab === tab || (activeTab === 'AddGroup' && tab === 'GroupDetails') || (activeTab === 'AddMember' && tab === 'MemberDetails');
            return (
              <li className="nav-item" key={tab}>
                <button 
                  className={`nav-link w-100 text-start fw-bold rounded-2 py-2 px-3 small`}
                  style={isActive ? { background: "rgba(25, 135, 84, 0.1)", color: "#198754" } : { color: "#6c757d", background: "transparent" }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header */}
        <div 
          className="p-3 d-flex align-items-center position-relative shadow-sm"
          style={{ 
            background: "#ffffff",
            borderBottom: "1px solid #e9ecef"
          }}
        >
          <button 
            className="btn border-0 fs-5 py-1 px-2 text-dark" 
            style={{ background: "transparent" }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Sidebar"
          >
            ☰
          </button>
          
          <div className="ms-3">
            <h5 className="m-0 fw-bold text-dark">Welcome Back,</h5>
            <small className="text-muted">Here is a summary of your RM account.</small>
          </div>

          <div className="ms-auto d-flex align-items-center">
             <button className="btn fw-bold px-4 rounded-pill" style={{ background: "#198754", color: "#fff" }}>Profile</button>
          </div>
        </div>
        
        {/* Rendered View */}
        <div className="flex-grow-1 p-4 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RMMain;
