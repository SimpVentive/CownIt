import React, { useState } from 'react';

const USERS = {
  individual: [
    { id: 'p1', name: 'John Smith', password: 'password' },
    { id: 'p2', name: 'Sarah Johnson', password: 'password' },
    { id: 'p3', name: 'Mike Chen', password: 'password' },
    { id: 'p4', name: 'Lisa Davis', password: 'password' }
  ],
  hr: [
    { id: 'hr-user', name: 'HR Manager', password: 'password' }
  ],
  ceo: [
    { id: 'ceo-user', name: 'CEO', password: 'password' }
  ]
};

function Login({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!selectedRole) {
      setError('Select a role');
      return;
    }

    if (!selectedUser) {
      setError('Select a user');
      return;
    }

    if (!password) {
      setError('Enter password');
      return;
    }

    const user = USERS[selectedRole].find(u => u.id === selectedUser);
    if (!user || user.password !== password) {
      setError('Invalid password');
      return;
    }

    onLoginSuccess(selectedRole, selectedUser, user.name);
  };

  const currentUsers = selectedRole ? USERS[selectedRole] : [];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '0.5px solid #e0e0e0'
      }}>
        {/* Logo */}
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: 500,
          textAlign: 'center'
        }}>
          CownIt
        </h1>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: '12px',
          fontWeight: 400,
          color: '#999',
          textAlign: 'center'
        }}>
          Commit & Own It
        </p>

        {/* Role Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '12px',
            fontSize: '13px',
            fontWeight: 500
          }}>
            Select role
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['individual', 'hr', 'ceo'].map(role => (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  setSelectedUser(null);
                  setPassword('');
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: selectedRole === role ? '#000' : '#f5f5f5',
                  color: selectedRole === role ? '#fff' : '#000',
                  border: '0.5px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 400,
                  cursor: 'pointer'
                }}
              >
                {role === 'individual' ? 'Individual' : role === 'hr' ? 'HR' : 'CEO'}
              </button>
            ))}
          </div>
        </div>

        {/* User Selection */}
        {selectedRole && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 500
            }}>
              Select user
            </label>
            <select
              value={selectedUser || ''}
              onChange={(e) => setSelectedUser(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '0.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 400,
                boxSizing: 'border-box'
              }}
            >
              <option value="">Choose user...</option>
              {currentUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Password */}
        {selectedUser && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: 500
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '0.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 400,
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 400,
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!selectedRole || !selectedUser || !password}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: selectedRole && selectedUser && password ? '#000' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: selectedRole && selectedUser && password ? 'pointer' : 'not-allowed',
            marginBottom: '24px'
          }}
        >
          Login
        </button>

        {/* Help Text */}
        <div style={{
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 400,
          color: '#666',
          lineHeight: '1.5'
        }}>
          <strong>Demo credentials:</strong>
          <p style={{ margin: '8px 0 0 0' }}>
            All passwords: <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>password</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
