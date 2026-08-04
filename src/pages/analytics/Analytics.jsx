import { useState } from 'react';
import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { title: 'Page Views', value: '342,890', change: '+12.5%', isPositive: true, icon: 'Eye' },
    { title: 'Bounce Rate', value: '42.3%', change: '-2.1%', isPositive: true, icon: 'Info' },
    { title: 'Session Duration', value: '4m 32s', change: '+18.7%', isPositive: true, icon: 'Clock' },
    { title: 'Conversion Rate', value: '3.1%', change: '+0.4%', isPositive: true, icon: 'TrendingUp' }
  ];

  return (
    <Structure
      headerIcon={<Icon name="TrendingUp" width="22" height="22" strokeWidth="2" />}
      headerTitle="Web Analytics"
      headerSub="Monitor visitor behavior, session statistics, and conversions"
      showTabControls={false}
      quickAction={
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="border-tertiary rounded-5 px-12 py-6 bg-white text-gray font-500"
          style={{ fontSize: '13px', outline: 'none' }}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      }
    >
      <style>{`
        .analytics-wrapper {
          font-family: 'Outfit', sans-serif;
          color: #1e293b;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .stat-footer {
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .text-success { color: #10b981; }
        .text-danger { color: #ef4444; }
        .chart-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
        }
      `}</style>
      <div className="analytics-wrapper w-full">
        <div className="stats-grid">
          {stats.map((s, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-header">
                <span>{s.title}</span>
                <Icon name={s.icon} width="16" height="16" />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-footer ${s.isPositive ? 'text-success' : 'text-danger'}`}>
                <span>{s.change}</span>
                <span className="text-gray" style={{ fontWeight: 'normal' }}>vs last period</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <h3 className="mid-text font-600 mb-16 text-dark">Traffic Trend Over Time</h3>
          <div style={{ position: 'relative', width: '100%', height: '220px' }}>
            <svg viewBox="0 0 500 180" width="100%" height="100%">
              <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="150" x2="480" y2="150" stroke="#cbd5e1" strokeWidth="1" />
              <path
                d="M 20 130 L 100 80 L 180 110 L 260 50 L 340 70 L 420 30 L 480 40"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 20 130 L 100 80 L 180 110 L 260 50 L 340 70 L 420 30 L 480 40 L 480 150 L 20 150 Z"
                fill="rgba(59, 130, 246, 0.04)"
              />
            </svg>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Analytics;
