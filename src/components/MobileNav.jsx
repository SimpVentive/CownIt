import React from 'react';
import { Home, CheckCircle, TrendingUp, MessageSquare, Users, Eye, Bell, Send, BarChart3 } from 'lucide-react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';

const NAV_MAP = {
  individual: [
    { page: 'my-commits', icon: CheckCircle, label: 'Commits' },
    { page: 'log-achievement', icon: TrendingUp, label: 'Log' },
    { page: 'my-impact', icon: BarChart3, label: 'Impact' },
    { page: 'messages', icon: MessageSquare, label: 'Messages' }
  ],
  hr: [
    { page: 'hr-people', icon: Users, label: 'People' },
    { page: 'hr-drilldown', icon: Eye, label: 'View' },
    { page: 'hr-reminders', icon: Bell, label: 'Reminders' }
  ],
  ceo: [
    { page: 'ceo-dashboard', icon: Home, label: 'Dashboard' },
    { page: 'ceo-people', icon: Users, label: 'People' },
    { page: 'ceo-heatmap', icon: BarChart3, label: 'Heatmap' },
    { page: 'ceo-message', icon: Send, label: 'Message' }
  ]
};

function MobileNav({ activeRole, activePage, onPageChange }) {
  const navItems = NAV_MAP[activeRole];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
      }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.page;

        return (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '500',
              color: isActive ? ACCENT_COLOR : SECONDARY_TEXT,
              transition: 'all 0.2s'
            }}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MobileNav;
