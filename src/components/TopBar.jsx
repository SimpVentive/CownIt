import React from 'react';

function TopBar({ activeRole, onRoleChange, currentUser }) {
  const roles = [
    { value: 'individual', label: 'Individual' },
    { value: 'hr', label: 'HR' },
    { value: 'ceo', label: 'CEO' }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '0.5px solid #e0e0e0',
      backgroundColor: '#fff'
    }}>
      {/* Logo */}
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 500,
          color: '#000'
        }}>
          CownIt
        </h1>
      </div>

      {/* Role Switcher */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {roles.map(role => {
          const isActive = activeRole === role.value;
          return (
            <button
              key={role.value}
              onClick={() => onRoleChange(role.value)}
              style={{
                padding: '8px 16px',
                backgroundColor: isActive ? '#000' : '#f5f5f5',
                color: isActive ? '#fff' : '#000',
                border: '0.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 400,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      {/* User Info */}
      {currentUser && (
        <div style={{ fontSize: '13px', fontWeight: 400, color: '#666' }}>
          {currentUser.name}
        </div>
      )}
    </div>
  );
}

export default TopBar;
