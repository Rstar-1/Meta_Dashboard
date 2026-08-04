import { useState, useMemo } from 'react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for Dashboard metrics
  const metrics = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '₹1,248,500',
      change: '+14.2% from last month',
      isPositive: true,
      icon: 'Briefcase',
      color: 'primary',
      bgGlow: 'rgba(59, 130, 246, 0.08)',
    },
    {
      id: 2,
      title: 'Active Orders',
      value: '142',
      change: '+8.4% from yesterday',
      isPositive: true,
      icon: 'ShoppingCart',
      color: 'success',
      bgGlow: 'rgba(16, 185, 129, 0.08)',
    },
    {
      id: 3,
      title: 'Pending Enquiries',
      value: '37',
      change: '-2.1% from last week',
      isPositive: false,
      icon: 'Clipboard',
      color: 'warning',
      bgGlow: 'rgba(245, 158, 11, 0.08)',
    },
    {
      id: 4,
      title: 'Registered Suppliers',
      value: '18',
      change: '+3 new this month',
      isPositive: true,
      icon: 'Users',
      color: 'info',
      bgGlow: 'rgba(6, 182, 212, 0.08)',
    },
  ];

  // Recent Orders Data
  const orders = [
    { id: 'ORD-9842', customer: 'Rstar Industries', date: '04 Aug 2026', total: '₹45,200', status: 'Processing' },
    { id: 'ORD-9841', customer: 'Mumbai Cold Storage', date: '03 Aug 2026', total: '₹1,12,000', status: 'Shipped' },
    { id: 'ORD-9840', customer: 'Ashoka Logistics', date: '02 Aug 2026', total: '₹12,400', status: 'Delivered' },
    { id: 'ORD-9839', customer: 'Apex Food Processing', date: '02 Aug 2026', total: '₹89,600', status: 'Pending' },
    { id: 'ORD-9838', customer: 'National Distributors', date: '01 Aug 2026', total: '₹67,800', status: 'Delivered' },
  ];

  // Supplier Enquiries Data
  const enquiries = [
    { id: 'ENQ-2041', supplier: 'Evergreen Plastics Ltd', item: 'Super Clear PVC Rolls (2mm)', qty: '200 Rolls', status: 'Pending' },
    { id: 'ENQ-2040', supplier: 'Standard Hardware Corp', item: 'Stainless Steel Hanger System', qty: '500 Sets', status: 'Reviewed' },
    { id: 'ENQ-2039', supplier: 'SafeGate Industrial', item: 'Polar Grade PVC Strip Curtains', qty: '120 Rolls', status: 'Approved' },
    { id: 'ENQ-2038', supplier: 'Kolkata Polymer Solutions', item: 'Anti-Static PVC Sheets', qty: '80 Rolls', status: 'Pending' },
  ];

  // Filters search queries
  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e =>
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <Container>
      {/* CSS Styles */}
      <style>{`
        .dashboard-wrapper {
          font-family: 'Outfit', sans-serif;
          color: #1e293b;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .dashboard-title h1 {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }
        .dashboard-title p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .metric-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .metric-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .metric-card.color-primary .metric-icon-box { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .metric-card.color-success .metric-icon-box { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .metric-card.color-warning .metric-icon-box { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .metric-card.color-info .metric-icon-box { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }
        
        .metric-value {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .metric-label {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .metric-change {
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .change-positive { color: #10b981; }
        .change-negative { color: #ef4444; }

        .dashboard-content-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        @media (max-width: 991px) {
          .dashboard-content-layout {
            grid-template-columns: 1fr;
          }
        }
        
        .section-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #0f172a;
        }
        
        /* Custom Tab CSS */
        .tabs-header {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }
        .tab-btn {
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }
        
        /* Table styles */
        .search-box {
          position: relative;
          margin-bottom: 16px;
        }
        .search-input {
          width: 100%;
          padding: 10px 16px;
          font-size: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .search-input:focus {
          border-color: #3b82f6;
        }
        
        .dashboard-table-container {
          overflow-x: auto;
        }
        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .dashboard-table th {
          background: #f8fafc;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }
        .dashboard-table td {
          padding: 16px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9999px;
        }
        .badge.bg-pending { background: #fef3c7; color: #d97706; }
        .badge.bg-processing { background: #dbeafe; color: #2563eb; }
        .badge.bg-shipped { background: #e0f2fe; color: #0284c7; }
        .badge.bg-delivered { background: #d1fae5; color: #059669; }
        .badge.bg-approved { background: #d1fae5; color: #059669; }
        .badge.bg-reviewed { background: #e0e7ff; color: #4f46e5; }
        
        /* Analytics SVG Chart */
        .chart-svg-container {
          position: relative;
          width: 100%;
          height: 200px;
          margin-top: 15px;
        }
        
        /* Quick Actions Grid */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .action-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }
        .action-button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .action-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
      `}</style>

      <div className='w-full'>
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Meta Dashboard</h1>
            <p>Real-time analytics, order status, and supplier activities</p>
          </div>
          <div className="flex gap-10">
            <Button variant="outline" version="v2" onClick={() => window.print()}>
              Export PDF
            </Button>
            <Button variant="primary" version="v2">
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="metrics-grid">
          {metrics.map(m => (
            <div key={m.id} className={`metric-card color-${m.color}`}>
              <div className="metric-icon-box">
                <Icon name={m.icon} size="20" />
              </div>
              <div className="metric-label">{m.title}</div>
              <div className="metric-value">{m.value}</div>
              <div className={`metric-change ${m.isPositive ? 'change-positive' : 'change-negative'}`}>
                <Icon name={m.isPositive ? 'TrendingUp' : 'TrendingDown'} size="14" />
                <span>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-content-layout">

          {/* Main Content: Tables & Charts */}
          <div className="main-panel">

            {/* Section: Revenue Analytics */}
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Sales Analytics Overview</div>
                <span className="mini-text text-gray">Last 6 Months</span>
              </div>

              {/* SVG Line Chart */}
              <div className="chart-svg-container">
                <svg viewBox="0 0 500 200" width="100%" height="100%">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Y-Axis labels */}
                  <text x="15" y="25" fill="#94a3b8" fontSize="10" fontFamily="inherit">150k</text>
                  <text x="15" y="65" fill="#94a3b8" fontSize="10" fontFamily="inherit">100k</text>
                  <text x="15" y="105" fill="#94a3b8" fontSize="10" fontFamily="inherit">50k</text>
                  <text x="15" y="145" fill="#94a3b8" fontSize="10" fontFamily="inherit">20k</text>
                  <text x="25" y="174" fill="#94a3b8" fontSize="10" fontFamily="inherit">0</text>

                  {/* Chart Line Path */}
                  <path
                    d="M 50 150 L 130 110 L 210 130 L 290 70 L 370 80 L 450 40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Area Gradient (simulate transparent fill) */}
                  <path
                    d="M 50 150 L 130 110 L 210 130 L 290 70 L 370 80 L 450 40 L 450 170 L 50 170 Z"
                    fill="rgba(59, 130, 246, 0.05)"
                  />

                  {/* Line Nodes */}
                  <circle cx="50" cy="150" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="130" cy="110" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="210" cy="130" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="290" cy="70" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="370" cy="80" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="450" cy="40" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />

                  {/* X-Axis labels */}
                  <text x="45" y="190" fill="#64748b" fontSize="10" fontFamily="inherit">Mar</text>
                  <text x="125" y="190" fill="#64748b" fontSize="10" fontFamily="inherit">Apr</text>
                  <text x="205" y="190" fill="#64748b" fontSize="10" fontFamily="inherit">May</text>
                  <text x="285" y="190" fill="#64748b" fontSize="10" fontFamily="inherit">Jun</text>
                  <text x="365" y="190" fill="#64748b" fontSize="10" fontFamily="inherit">Jul</text>
                  <text x="445" y="190" fill="#64748b" fontSize="10" fontFamily="inherit">Aug</text>
                </svg>
              </div>
            </div>

            {/* Section: Interactive Records Table */}
            <div className="section-card">
              <div className="tabs-header">
                <button
                  className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
                >
                  Recent Customer Orders
                </button>
                <button
                  className={`tab-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}
                >
                  Recent Supplier Enquiries
                </button>
              </div>

              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder={activeTab === 'orders' ? 'Search by Order ID or Customer...' : 'Search by Enquiry ID, Supplier or Item...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="dashboard-table-container">
                {activeTab === 'orders' ? (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map(o => (
                          <tr key={o.id}>
                            <td style={{ fontWeight: '600' }}>{o.id}</td>
                            <td>{o.customer}</td>
                            <td>{o.date}</td>
                            <td style={{ fontWeight: '500' }}>{o.total}</td>
                            <td>
                              <span className={`badge bg-${o.status.toLowerCase()}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                            No matching orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Enquiry ID</th>
                        <th>Supplier</th>
                        <th>Item Requested</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.length > 0 ? (
                        filteredEnquiries.map(e => (
                          <tr key={e.id}>
                            <td style={{ fontWeight: '600' }}>{e.id}</td>
                            <td>{e.supplier}</td>
                            <td>{e.item}</td>
                            <td>{e.qty}</td>
                            <td>
                              <span className={`badge bg-${e.status.toLowerCase()}`}>
                                {e.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                            No matching enquiries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Panel: Quick Actions & Status */}
          <div className="side-panel">

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: '16px' }}>Quick Actions</div>
              <div className="actions-grid">
                <button className="action-button">
                  <div className="action-icon text-primary">
                    <Icon name="Plus" size="16" />
                  </div>
                  <span>Create New Order</span>
                </button>
                <button className="action-button">
                  <div className="action-icon text-success">
                    <Icon name="Users" size="16" />
                  </div>
                  <span>Add Supplier Profile</span>
                </button>
                <button className="action-button">
                  <div className="action-icon text-warning">
                    <Icon name="Package" size="16" />
                  </div>
                  <span>Manage Product Catalog</span>
                </button>
                <button className="action-button">
                  <div className="action-icon text-info">
                    <Icon name="Settings" size="16" />
                  </div>
                  <span>System Configuration</span>
                </button>
              </div>
            </div>

            <div className="section-card">
              <div className="section-title" style={{ marginBottom: '16px' }}>Platform Activity Feed</div>
              <div className="flex flex-column gap-16" style={{ fontSize: '13px' }}>
                <div className="flex gap-10 items-start">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '5px', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>New supplier signed up</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>10 mins ago • SafeGate Industrial</div>
                  </div>
                </div>
                <div className="flex gap-10 items-start">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginTop: '5px', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>Order #ORD-9842 confirmed</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>25 mins ago • Rstar Industries</div>
                  </div>
                </div>
                <div className="flex gap-10 items-start">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '5px', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#334155' }}>Inventory alert: low stock</div>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>2 hours ago • PVC Roll 3mm clear</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
