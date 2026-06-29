import React from 'react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const BORDER_COLOR = '#ddd';

function TopBar({ activeRole, onRoleChange }) {
  const roles = [
    { value: 'individual', label: 'Individual' },
    { value: 'hr', label: 'HR' },
    { value: 'ceo', label: 'CEO' }
  ];

  return (
    <div style={{
      padding: '20px 24px',
      backgroundColor: '#fff',
      borderBottom: `1px solid ${BORDER_COLOR}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h1 style={{
          margin: '0 0 4px 0',
          fontSize: '24px',
          fontWeight: '700',
          lineHeight: '1.2'
        }}>
          Cow
          <span style={{ color: ACCENT_COLOR }}>It</span>
        </h1>
        <p style={{
          margin: 0,
          fontSize: '11px',
          color: SECONDARY_TEXT,
          fontWeight: '400'
        }}>
          Commit & Own It
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {roles.map(role => {
          const isActive = activeRole === role.value;
          return (
            <button
              key={role.value}
              onClick={() => onRoleChange(role.value)}
              style={{
                padding: '10px 20px',
                backgroundColor: isActive ? ACCENT_COLOR : 'transparent',
                color: isActive ? ACCENT_COLOR : SECONDARY_TEXT,
                border: `1px solid ${isActive ? ACCENT_COLOR : BORDER_COLOR}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TopBar;
