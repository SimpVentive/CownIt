import React, { useState } from 'react';
import { formatDate } from '../utils/formatDate';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const MUTED_TEXT = '#ccc';

function CeoMessage({ data, selectedRecipientId, onDataChange }) {
  const [recipientId, setRecipientId] = useState(
    selectedRecipientId || (data.people.length > 0 ? data.people[0].id : '')
  );
  const [messageBody, setMessageBody] = useState('');
  const [sent, setSent] = useState(false);


  const getPersonName = (personId) => {
    const person = data.people.find(p => p.id === personId);
    return person?.name || 'Unknown';
  };

  const getPersonDepartment = (personId) => {
    const person = data.people.find(p => p.id === personId);
    return person?.department || 'Unknown';
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

    onDataChange('messages', [...data.messages, newMessage]);
    setMessageBody('');
    setSent(true);

    setTimeout(() => setSent(false), 2000);
  };

  const ceoMessages = data.messages
    .filter(m => m.fromRole === 'ceo')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Send message</h2>

      {/* Form */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '32px'
        }}
      >
        {/* To */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            To
          </label>
          <select
            value={recipientId}
            onChange={e => {
              setRecipientId(e.target.value);
              setSent(false);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box'
            }}
          >
            {data.people.map(person => (
              <option key={person.id} value={person.id}>
                {person.name} — {person.department}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            Message
          </label>
          <textarea
            value={messageBody}
            onChange={e => setMessageBody(e.target.value)}
            placeholder="Your message to this individual..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Send Button and Status */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleSend}
            disabled={messageBody.trim().length < 5}
            style={{
              padding: '10px 20px',
              backgroundColor:
                messageBody.trim().length < 5 ? '#ccc' : ACCENT_COLOR,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor:
                messageBody.trim().length < 5 ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
          >
            Send
          </button>

          {sent && (
            <span style={{ fontSize: '13px', color: '#28a745', fontWeight: '500' }}>
              Message sent ✓
            </span>
          )}
        </div>
      </div>

      {/* Sent Messages Log */}
      {ceoMessages.length > 0 && (
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
            Sent messages
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ceoMessages.map(message => (
              <div
                key={message.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: ACCENT_COLOR,
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}
                >
                  To: {getPersonName(message.toPersonId)} — {getPersonDepartment(message.toPersonId)}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#333',
                    marginBottom: '8px',
                    lineHeight: '1.5'
                  }}
                >
                  {message.body}
                </div>
                <div style={{ fontSize: '11px', color: MUTED_TEXT }}>
                  {formatDate(message.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CeoMessage;
