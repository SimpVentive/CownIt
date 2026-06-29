import React from 'react';
import { ListCheck, PlusCircle, ChartLine, MessageCircle, Users, Eye, Bell, LayoutDashboard, GridDots, Send } from 'lucide-react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const SURFACE_1 = '#f5f5f5';

const NAV_MAP = {
  individual: [
    { page: 'my-commits', icon: ListCheck, label: 'My commits' },
    { page: 'log-achievement', icon: PlusCircle, label: 'Log achievement' },
    { page: 'my-impact', icon: ChartLine, label: 'My impact' },
    { page: 'messages', icon: MessageCircle, label: 'Messages' }
  ],
  hr: [
    { page: 'hr-people', icon: Users, label: 'People' },
    { page: 'hr-drilldown', icon: Eye, label: 'Individual view' },
    { page: 'hr-reminders', icon: Bell, label: 'Reminders' }
  ],
  ceo: [
    { page: 'ceo-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { page: 'ceo-people', icon: Users, label: 'People view' },
    { page: 'ceo-heatmap', icon: GridDots, label: 'Impact heatmap' },
    { page: 'ceo-message', icon: Send, label: 'Send message' }
  ]
};

function Sidebar({ activeRole, activePage, onPageChange }) {
  const navItems = NAV_MAP[activeRole];

  return (
    <div style={{
      width: '180px',
      backgroundColor: '#fff',
      borderRight: '1px solid #ddd',
      padding: '16px 12px',
      overflow: 'auto'
    }}>
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
              padding: '12px',
              marginBottom: '4px',
              backgroundColor: isActive ? ACCENT_COLOR : 'transparent',
              color: isActive ? ACCENT_COLOR : SECONDARY_TEXT,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: isActive ? '500' : '400',
              transition: 'background-color 0.2s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = SURFACE_1;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Sidebar;
