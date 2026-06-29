import React from 'react';
import { Home, CheckCircle, TrendingUp, MessageSquare, Users, Eye, Bell, Send, BarChart3, Settings, LogOut } from 'lucide-react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const SIDEBAR_BG = '#f8f9fa';

const NAV_MAP = {
  individual: [
    { page: 'my-commits', icon: CheckCircle, label: 'My Commitments' },
    { page: 'log-achievement', icon: TrendingUp, label: 'Log Achievement' },
    { page: 'my-impact', icon: BarChart3, label: 'My Impact' },
    { page: 'messages', icon: MessageSquare, label: 'Messages' }
  ],
  hr: [
    { page: 'hr-people', icon: Users, label: 'People' },
    { page: 'hr-drilldown', icon: Eye, label: 'Individual View' },
    { page: 'hr-reminders', icon: Bell, label: 'Reminders' }
  ],
  ceo: [
    { page: 'ceo-dashboard', icon: Home, label: 'Dashboard' },
    { page: 'ceo-people', icon: Users, label: 'People View' },
    { page: 'ceo-heatmap', icon: BarChart3, label: 'Impact Heatmap' },
    { page: 'ceo-message', icon: Send, label: 'Send Message' }
  ]
};

function LeftSidebar({ activeRole, activePage, onPageChange, onLogout }) {
  const navItems = NAV_MAP[activeRole];

  return (
    <div
      style={{
        width: '240px',
        backgroundColor: SIDEBAR_BG,
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        boxShadow: '2px 0 8px rgba(0,0,0,0.03)'
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #ddd' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
          Cow<span style={{ color: ACCENT_COLOR }}>It</span>
        </h2>
      </div>

      {/* Navigation Items */}
      <nav style={{ flex: 1, padding: '16px 8px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.page;

          return (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                margin: '4px 0',
                backgroundColor: isActive ? ACCENT_COLOR : 'transparent',
                color: isActive ? '#fff' : SECONDARY_TEXT,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              className="sidebar-item"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div style={{ borderTop: '1px solid #ddd', padding: '12px 8px' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: '#dc3545',
            border: '1px solid #dc3545',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s',
            textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default LeftSidebar;
