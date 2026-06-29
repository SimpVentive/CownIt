import React, { useState } from 'react';

function Message({ state, onDataChange }) {
  const [recipientId, setRecipientId] = useState(state.data.people[0]?.id || '');
  const [messageBody, setMessageBody] = useState('');
  const [sent, setSent] = useState(false);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getPersonName = (personId) => {
    return state.data.people.find(p => p.id === personId)?.name || 'Unknown';
  };

  const getPersonDept = (personId) => {
    return state.data.people.find(p => p.id === personId)?.department || '';
  };

  const handleSend = () => {
    if (messageBody.trim().length < 5) return;

    const newMessage = {
      id: 'msg' + Date.now(),
      fromRole: 'ceo',
      fromName: 'CEO',
      toPersonId: recipientId,
      body: messageBody.trim(),
      date: new Date().toISOString(),
      read: false
    };

    onDataChange('messages', [...state.data.messages, newMessage]);
    setMessageBody('');
    setSent(true);

    setTimeout(() => setSent(false), 2000);
  };

  const ceoMessages = state.data.messages
    .filter(m => m.fromRole === 'ceo')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        Send message
      </h2>

      {/* Form */}
      <div style={{
        padding: '16px',
        backgroundColor: '#fff',
        border: '0.5px solid #e0e0e0',
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        {/* Recipient */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
            To
          </label>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
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
            {state.data.people.map(person => (
              <option key={person.id} value={person.id}>
                {person.name} — {person.department}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
            Message
          </label>
          <textarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Your message..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px 12px',
              border: '0.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 400,
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Send */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleSend}
            disabled={messageBody.trim().length < 5}
            style={{
              padding: '10px 16px',
              backgroundColor: messageBody.trim().length < 5 ? '#ccc' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 400,
              cursor: messageBody.trim().length < 5 ? 'not-allowed' : 'pointer'
            }}
          >
            Send
          </button>
          {sent && (
            <span style={{ fontSize: '13px', color: '#28a745', fontWeight: 400 }}>
              Message sent
            </span>
          )}
        </div>
      </div>

      {/* Sent Messages */}
      {ceoMessages.length > 0 && (
        <>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 500 }}>
            Sent messages
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ceoMessages.map(message => (
              <div
                key={message.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '0.5px solid #e0e0e0',
                  borderRadius: '12px'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#007bff', marginBottom: '8px' }}>
                  To: {getPersonName(message.toPersonId)} — {getPersonDept(message.toPersonId)}
                </div>
                <div style={{ fontSize: '13px', color: '#333', marginBottom: '8px', lineHeight: '1.5' }}>
                  {message.body}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {formatDate(message.date)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Message;
