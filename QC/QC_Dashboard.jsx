import React, { useState } from 'react';
import QCChecklistTable from './QC_ChecklistTable';
import { qcChecklistData, membersListData, activeLoansData } from './qcData.mock';

const accent = '#0a9f0a';

const sections = {
  Dashboard: {
    label: 'Dashboard',
    marker: 'DB',
    description: 'Quality control command center',
    data: []
  },
  'QC Verification': {
    label: 'QC Verification',
    marker: 'QC',
    description: 'Pre-disbursement audit checklist',
    data: qcChecklistData
  },
  'Members List': {
    label: 'Members List',
    marker: 'MB',
    description: 'Verified group member records',
    data: membersListData
  },
  'Active Loans': {
    label: 'Active Loans',
    marker: 'LN',
    description: 'Disbursed and active loan files',
    data: activeLoansData
  }
};

export default function QCDashboard() {
  const [activeTab, setActiveTab] = useState('All');
  const [currentSection, setCurrentSection] = useState('QC Verification');
  const [selectedRecord, setSelectedRecord] = useState(qcChecklistData[0]);

  const currentData = sections[currentSection].data;
  const clearedCount = currentData.filter((item) =>
    ['Passed', 'Active', 'Disbursed'].includes(item.status)
  ).length;

  const handleSectionChange = (sectionName) => {
    const nextData = sections[sectionName].data;
    setCurrentSection(sectionName);
    setSelectedRecord(nextData[0] || null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8', color: '#111111', fontFamily: 'Inter, Arial, sans-serif' }}>
      <aside style={{ width: '280px', backgroundColor: '#ffffff', color: '#111111', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderRight: '1px solid #e7e7e7', boxShadow: '8px 0 30px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ padding: '0 8px 22px', borderBottom: '1px solid #ececec' }}>
          <div style={{ color: accent, fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Quality Control
          </div>
          <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 900, lineHeight: 1.2 }}>
            Women's Group MFI
          </div>
          <div style={{ marginTop: '8px', color: '#666666', fontSize: '13px' }}>
            Loan review and verification desk
          </div>
        </div>

        <nav style={{ flexGrow: 1, marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(sections).map(([sectionName, section]) => {
            const isActive = currentSection === sectionName;

            return (
              <button
                key={sectionName}
                onClick={() => handleSectionChange(sectionName)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '13px 12px',
                  border: isActive ? `1px solid ${accent}` : '1px solid #eeeeee',
                  borderRadius: '8px',
                  backgroundColor: isActive ? accent : '#ffffff',
                  color: isActive ? '#ffffff' : '#111111',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 10px 20px rgba(10, 159, 10, 0.18)' : 'none'
                }}
              >
                <span style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isActive ? '#ffffff' : '#f3f4f6', color: isActive ? accent : '#111111', fontSize: '12px', fontWeight: 900, border: isActive ? 'none' : '1px solid #e5e7eb' }}>
                  {section.marker}
                </span>
                <span>
                  <span style={{ display: 'block' }}>{section.label}</span>
                  <span style={{ display: 'block', marginTop: '2px', color: isActive ? '#eaffea' : '#707070', fontSize: '11px', fontWeight: 600 }}>
                    {section.data.length} records
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '18px 8px 0', borderTop: '1px solid #ececec', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 900, fontSize: '13px' }}>
            PS
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 900 }}>Priya Sharma</div>
            <div style={{ fontSize: '12px', color: '#666666' }}>Branch Manager</div>
          </div>
        </div>
      </aside>

      <main style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ minHeight: '74px', borderBottom: '1px solid #e7e7e7', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 32px', backgroundColor: '#ffffff' }}>
          <div>
            <span style={{ color: '#707070', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Microfinance Controls / </span>
            <span style={{ color: '#0a9f0a', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>{currentSection}</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ backgroundColor: '#edffed', color: '#057405', border: '1px solid #c8ffc8', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 900 }}>
              Live Status: Connected
            </span>
          </div>
        </header>

        <div style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <section style={{ backgroundColor: '#ffffff', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '24px', boxShadow: '0 14px 35px rgba(15, 23, 42, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 360px' }}>
                <h1 style={{ fontSize: '30px', fontWeight: 900, color: accent, margin: 0, letterSpacing: 0 }}>
                  {currentSection === 'Dashboard' ? 'Branch Dashboard Summary' : `${currentSection} Panel`}
                </h1>
                <p style={{ color: '#626262', fontSize: '14px', margin: '8px 0 0 0' }}>
                  {sections[currentSection].description}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '120px', padding: '12px 14px', border: '1px solid #ececec', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  <div style={{ color: '#6d6d6d', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Records</div>
                  <div style={{ marginTop: '4px', color: '#000000', fontSize: '24px', fontWeight: 900 }}>{currentData.length}</div>
                </div>
                <div style={{ minWidth: '120px', padding: '12px 14px', border: '1px solid #ececec', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  <div style={{ color: '#6d6d6d', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Clear</div>
                  <div style={{ marginTop: '4px', color: '#0a9f0a', fontSize: '24px', fontWeight: 900 }}>{clearedCount}</div>
                </div>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['All', 'Unread', 'Loan', 'Repayment'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  minWidth: '96px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: activeTab === tab ? `1px solid ${accent}` : '1px solid #dcdcdc',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab ? accent : '#ffffff',
                  color: activeTab === tab ? '#ffffff' : '#111111',
                  boxShadow: activeTab === tab ? '0 8px 20px rgba(10, 159, 10, 0.18)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {currentSection === 'Dashboard' ? (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {Object.entries(sections).filter(([name]) => name !== 'Dashboard').map(([name, section]) => (
                <button
                  key={name}
                  onClick={() => handleSectionChange(name)}
                  style={{ padding: '22px', border: '1px solid #e5e5e5', borderRadius: '8px', backgroundColor: '#ffffff', textAlign: 'left', cursor: 'pointer', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)' }}
                >
                  <div style={{ color: accent, fontSize: '28px', fontWeight: 900 }}>{section.data.length}</div>
                  <div style={{ marginTop: '8px', color: '#000000', fontSize: '16px', fontWeight: 900 }}>{section.label}</div>
                  <div style={{ marginTop: '6px', color: '#6b6b6b', fontSize: '13px' }}>{section.description}</div>
                </button>
              ))}
            </section>
          ) : (
            <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px', alignItems: 'start' }}>
              <QCChecklistTable
                data={currentData}
                selectedId={selectedRecord?.id}
                onSelect={setSelectedRecord}
              />

              <aside style={{ backgroundColor: '#ffffff', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '20px', boxShadow: '0 14px 35px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ color: '#6b6b6b', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>Selected Details</div>
                {selectedRecord ? (
                  <>
                    <h2 style={{ margin: '10px 0 14px', color: '#000000', fontSize: '20px', fontWeight: 900, lineHeight: 1.25 }}>
                      {selectedRecord.item}
                    </h2>
                    <dl style={{ display: 'grid', gap: '12px', margin: 0 }}>
                      <div>
                        <dt style={{ color: '#707070', fontSize: '12px', fontWeight: 800 }}>Checked By / Info</dt>
                        <dd style={{ margin: '4px 0 0', color: '#111111', fontWeight: 800 }}>{selectedRecord.checkedBy}</dd>
                      </div>
                      <div>
                        <dt style={{ color: '#707070', fontSize: '12px', fontWeight: 800 }}>Status</dt>
                        <dd style={{ margin: '4px 0 0', color: '#0a9f0a', fontWeight: 900 }}>{selectedRecord.status}</dd>
                      </div>
                      <div>
                        <dt style={{ color: '#707070', fontSize: '12px', fontWeight: 800 }}>Risk Level</dt>
                        <dd style={{ margin: '4px 0 0', color: selectedRecord.riskLevel === 'High' ? '#dc2626' : '#111111', fontWeight: 900 }}>{selectedRecord.riskLevel}</dd>
                      </div>
                      <div>
                        <dt style={{ color: '#707070', fontSize: '12px', fontWeight: 800 }}>Notes</dt>
                        <dd style={{ margin: '4px 0 0', color: '#333333', lineHeight: 1.55 }}>{selectedRecord.notes}</dd>
                      </div>
                    </dl>
                    <button style={{ width: '100%', marginTop: '18px', padding: '12px 14px', border: `1px solid ${accent}`, borderRadius: '8px', backgroundColor: accent, color: '#ffffff', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}>
                      Open Full Details
                    </button>
                  </>
                ) : (
                  <p style={{ color: '#6b6b6b', lineHeight: 1.5 }}>Choose a record from the table to view details.</p>
                )}
              </aside>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
