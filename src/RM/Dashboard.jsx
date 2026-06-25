import React, { useState, useEffect } from 'react';
import BASE_URL from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Dashboard = ({ onSelectGroup, onChangeTab }) => {
  const [dashboardData, setDashboardData] = useState({
    total_members: 0,
    total_groups: 0,
    active_loans: 0,
    overdue_installments: 0,
    total_collections: 0
  });
  const [groups, setGroups] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, groupsRes, loansRes] = await Promise.all([
          fetch(`${BASE_URL}/dashboard`),
          fetch(`${BASE_URL}/groups`),
          fetch(`${BASE_URL}/loan-applications`)
        ]);

        if (dashRes.ok) setDashboardData(await dashRes.json());
        if (groupsRes.ok) setGroups(await groupsRes.json());
        if (loansRes.ok) setLoans(await loansRes.json());
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Chart 1: Bar Data (Group Limits)
  const barData = groups.map(g => ({
    name: g.group_code,
    amount: g.group_limit_amount || 0
  })).slice(0, 10); // Take top 10

  // Chart 2: Pie Data (Loan Statuses)
  const loanStatusCount = loans.reduce((acc, loan) => {
    acc[loan.application_status] = (acc[loan.application_status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(loanStatusCount).map(key => ({
    name: key,
    value: loanStatusCount[key]
  }));

  // Chart 3: Line Data (Loan Requests Over Time)
  const lineData1 = loans
    .sort((a, b) => new Date(a.applied_date) - new Date(b.applied_date))
    .slice(0, 15)
    .map(loan => ({
      name: new Date(loan.applied_date).toLocaleDateString(),
      amount: loan.requested_amount
    }));

  // Chart 4: Line Data (Mock Receipts)
  const mockReceiptsData = [
    { name: 'Jan', receipts: 4000 },
    { name: 'Feb', receipts: 5000 },
    { name: 'Mar', receipts: 2000 },
    { name: 'Apr', receipts: 2780 },
    { name: 'May', receipts: 1890 },
    { name: 'Jun', receipts: 2390 },
    { name: 'Jul', receipts: 3490 },
  ];

  if (loading) {
    return <div className="text-center mt-5 text-light opacity-75">Loading dashboard data...</div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h3 className="fw-bolder mb-1" style={{ color: "#198754" }}>Company Dashboard</h3>
           <p className="text-muted">At a glance summary of operations.</p>
        </div>
        <button 
          onClick={() => onChangeTab && onChangeTab('AddGroup')}
          className="btn fw-bold px-4 rounded-pill text-white" 
          style={{ background: "#198754" }}
        >
          + Create Group
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div 
            className="card text-dark h-100 p-3 shadow-sm" 
            style={{ background: "#ffffff", border: "1px solid #dee2e6", borderRadius: "8px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="m-0 text-muted fw-bold small">Active Loans</p>
                <h2 className="fw-bold m-0">{dashboardData.active_loans}</h2>
              </div>
              <div className="fs-2 opacity-50">👥</div>
            </div>
            <div 
              className="d-flex justify-content-between align-items-center mt-auto"
              style={{ cursor: "pointer", borderTop: "1px solid #dee2e6", paddingTop: "10px" }}
              onClick={() => onChangeTab && onChangeTab('LoanRequest')}
            >
              <span className="small fw-bold" style={{ color: "#198754" }}>View Details</span>
              <span className="fw-bold" style={{ color: "#198754" }}>→</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card text-dark h-100 p-3 shadow-sm" 
            style={{ background: "#ffffff", border: "1px solid #dee2e6", borderRadius: "8px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="m-0 text-muted fw-bold small">Total Groups</p>
                <h2 className="fw-bold m-0">{dashboardData.total_groups}</h2>
              </div>
              <div className="fs-2 opacity-50">🔨</div>
            </div>
            <div 
              className="d-flex justify-content-between align-items-center mt-auto"
              style={{ cursor: "pointer", borderTop: "1px solid #dee2e6", paddingTop: "10px" }}
              onClick={() => onChangeTab && onChangeTab('GroupDetails')}
            >
              <span className="small fw-bold" style={{ color: "#198754" }}>View Details</span>
              <span className="fw-bold" style={{ color: "#198754" }}>→</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card text-dark h-100 p-3 shadow-sm" 
            style={{ background: "#ffffff", border: "1px solid #dee2e6", borderRadius: "8px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="m-0 text-muted fw-bold small">Total Collections</p>
                <h2 className="fw-bold m-0">₹{dashboardData.total_collections.toLocaleString()}</h2>
              </div>
              <div className="fs-2 opacity-50">💵</div>
            </div>
            <div 
              className="d-flex justify-content-between align-items-center mt-auto"
              style={{ cursor: "pointer", borderTop: "1px solid #dee2e6", paddingTop: "10px" }}
              onClick={() => onChangeTab && onChangeTab('PayDetails')}
            >
              <span className="small fw-bold" style={{ color: "#198754" }}>View Details</span>
              <span className="fw-bold" style={{ color: "#198754" }}>→</span>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div 
            className="card text-dark h-100 p-3 shadow-sm" 
            style={{ background: "#ffffff", border: "1px solid #dee2e6", borderRadius: "8px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="m-0 text-muted fw-bold small">Loans in Arrears</p>
                <h2 className="fw-bold m-0" style={{ color: "#dc3545" }}>{dashboardData.overdue_installments}</h2>
              </div>
              <div className="fs-2 opacity-50">⚠️</div>
            </div>
            <div 
              className="d-flex justify-content-between align-items-center mt-auto"
              style={{ cursor: "pointer", borderTop: "1px solid #dee2e6", paddingTop: "10px" }}
              onClick={() => onChangeTab && onChangeTab('PayDetails')}
            >
              <span className="small fw-bold" style={{ color: "#dc3545" }}>View Details</span>
              <span className="fw-bold" style={{ color: "#dc3545" }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Report Section */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 p-4" style={{ background: "#ffffff", border: "1px solid #dee2e6", borderRadius: "8px" }}>
            <div className="mb-4">
              <h5 className="fw-bolder text-dark m-0">Collections Report</h5>
              <p className="text-muted small m-0">Summary of recent collection activity.</p>
            </div>
            <div className="row text-center">
              
              {/* Today's Collection */}
              <div className="col-md-4 border-end">
                <p className="text-muted small fw-bold mb-1">TODAY</p>
                <h2 className="fw-bolder mb-0" style={{ color: "#198754" }}>
                  ₹0
                </h2>
                <small className="text-muted">Collected Today</small>
              </div>
              
              {/* Yesterday's Collection */}
              <div className="col-md-4 border-end">
                <p className="text-muted small fw-bold mb-1">YESTERDAY</p>
                <h2 className="fw-bolder mb-0 text-dark">
                  ₹0
                </h2>
                <small className="text-muted">Collected Yesterday</small>
              </div>
              
              {/* This Month's Collection */}
              <div className="col-md-4">
                <p className="text-muted small fw-bold mb-1">THIS MONTH</p>
                <h2 className="fw-bolder mb-0 text-dark">
                  ₹{dashboardData.total_collections.toLocaleString()}
                </h2>
                <small className="text-muted">Collected This Month</small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;