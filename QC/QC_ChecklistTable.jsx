import React from 'react';

const accent = '#0a9f0a';

function getStatusStyle(status) {
  const isClear = ['Passed', 'Active', 'Disbursed'].includes(status);

  return {
    backgroundColor: isClear ? '#edffed' : '#fff7e6',
    border: isClear ? '1px solid #c8ffc8' : '1px solid #ffe0a3',
    color: isClear ? '#087a08' : '#9a5b00'
  };
}

function getRiskStyle(riskLevel) {
  if (riskLevel === 'High') {
    return {
      backgroundColor: '#fff1f1',
      border: '1px solid #ffc9c9',
      color: '#b91c1c'
    };
  }

  if (riskLevel === 'Medium') {
    return {
      backgroundColor: '#fff7e6',
      border: '1px solid #ffe0a3',
      color: '#9a5b00'
    };
  }

  return {
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    color: '#111111'
  };
}

export default function QCChecklistTable({ data, selectedId, onSelect }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: '#6b6b6b', padding: '30px', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid #e8e8e8', borderRadius: '8px' }}>
        No records found for this section.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e8e8e8', overflowX: 'auto', boxShadow: '0 14px 35px rgba(15, 23, 42, 0.06)' }}>
      <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', color: '#111111' }}>
        <thead>
          <tr style={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <th style={{ padding: '15px 18px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Title / Name</th>
            <th style={{ padding: '15px 18px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Checked By / Info</th>
            <th style={{ padding: '15px 18px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Status</th>
            <th style={{ padding: '15px 18px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Risk</th>
            <th style={{ padding: '15px 18px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isSelected = selectedId === row.id;

            return (
              <tr
                key={row.id}
                onClick={() => onSelect?.(row)}
                style={{
                  borderBottom: '1px solid #eeeeee',
                  backgroundColor: isSelected ? '#f1fff1' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <td style={{ padding: '16px 18px', fontWeight: 900, color: '#000000' }}>{row.item}</td>
                <td style={{ padding: '16px 18px', color: '#4b4b4b', fontWeight: 700 }}>{row.checkedBy}</td>
                <td style={{ padding: '16px 18px' }}>
                  <span style={{ ...getStatusStyle(row.status), display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 900 }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <span style={{ ...getRiskStyle(row.riskLevel), display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 900 }}>
                    {row.riskLevel}
                  </span>
                </td>
                <td style={{ padding: '16px 18px' }}>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect?.(row);
                    }}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: isSelected ? `1px solid ${accent}` : '1px solid #000000',
                      backgroundColor: isSelected ? accent : '#000000',
                      color: isSelected ? '#ffffff' : accent,
                      fontSize: '12px',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
