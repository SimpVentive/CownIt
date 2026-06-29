import React from 'react';
import { CheckCircle, PlusCircle, TrendingUp, MessageSquare, Users, Eye, Bell, BarChart3, Send } from 'lucide-react';

const NAV_MAP = {
  individual: [
    { page: 'my-commits', icon: CheckCircle, label: 'My commits' },
    { page: 'log-achievement', icon: PlusCircle, label: 'Log achievement' },
    { page: 'my-impact', icon: TrendingUp, label: 'My impact' },
    { page: 'messages', icon: MessageSquare, label: 'Messages' }
  ],
  hr: [
    { page: 'people', icon: Users, label: 'People' },
    { page: 'drilldown', icon: Eye, label: 'Individual view' },
    { page: 'reminders', icon: Bell, label: 'Reminders' }
  ],
  ceo: [
    { page: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { page: 'people', icon: Users, label: 'People' },
    { page: 'heatmap', icon: TrendingUp, label: 'Impact heatmap' },
    { page: 'message', icon: Send, label: 'Send message' }
  ]
};

function Sidebar({ activeRole, activePage, onPageChange }) {
  const navItems = NAV_MAP[activeRole];

  return (
    <div style={{
      width: '200px',
      borderRight: '0.5px solid #e0e0e0',
      padding: '16px 0',
      backgroundColor: '#fff'
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
              padding: '12px 16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              backgroundColor: isActive ? '#f5f5f5' : 'transparent',
              border: 'none',
              color: '#000',
              fontSize: '13px',
              fontWeight: 400,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s'
            }}
          >
            <Icon size={18} strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Sidebar;
