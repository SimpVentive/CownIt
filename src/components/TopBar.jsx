import React from 'react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const BORDER_COLOR = '#ddd';

function TopBar({ activeRole, onRoleChange, currentUser, onLogout, isAdmin }) {
  return (
    <div style={{
      padding: '16px 24px',
      backgroundColor: '#fff',
      borderBottom: `1px solid ${BORDER_COLOR}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div>
        <h1 style={{
          margin: '0 0 2px 0',
          fontSize: '20px',
          fontWeight: '700',
          lineHeight: '1.2'
        }}>
          Cow
          <span style={{ color: ACCENT_COLOR }}>It</span>
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* User Info */}
        {currentUser && (
          <div style={{ textAlign: 'right', borderRight: `1px solid ${BORDER_COLOR}`, paddingRight: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '10px', color: SECONDARY_TEXT }}>
              {activeRole === 'individual' ? 'Individual' : activeRole.toUpperCase()}
            </div>
          </div>
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: '#dc3545',
              border: '1px solid #dc3545',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default TopBar;
