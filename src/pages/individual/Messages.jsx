import React from 'react';

function Messages({ state }) {
  const userMessages = state.data.messages
    .filter(m => m.toPersonId === state.currentUserId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        Messages
      </h2>

      {userMessages.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {userMessages.map(message => (
            <div
              key={message.id}
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                border: '0.5px solid #e0e0e0',
                borderRadius: '12px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: '#000' }}>
                From: {message.fromName} ({message.fromRole.toUpperCase()})
              </div>

              <div style={{ fontSize: '13px', fontWeight: 400, color: '#333', marginBottom: '12px', lineHeight: '1.5' }}>
                {message.body}
              </div>

              <div style={{ fontSize: '12px', color: '#999' }}>
                {formatDate(message.date)}
                {message.read && ' · Read'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '32px',
          textAlign: 'center',
          backgroundColor: '#fff',
          border: '0.5px solid #e0e0e0',
          borderRadius: '12px',
          color: '#999',
          fontSize: '13px',
          fontWeight: 400
        }}>
          No messages yet
        </div>
      )}
    </div>
  );
}

export default Messages;
