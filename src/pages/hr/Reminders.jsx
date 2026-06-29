import React, { useState } from 'react';

function Reminders({ state, onDataChange }) {
  const [sentIds, setSentIds] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const overduepeople = state.data.people.filter(p =>
    !state.data.monthlyUpdates.some(u =>
      u.personId === p.id && u.month === currentMonth && u.year === currentYear
    )
  );

  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const getLastUpdateDate = (personId) => {
    const lastUpdate = state.data.monthlyUpdates
      .filter(u => u.personId === personId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    return lastUpdate ? formatDate(lastUpdate.updatedAt) : 'Never';
  };

  const sendReminder = (personId) => {
    const newMessage = {
      id: 'msg' + Date.now(),
      fromRole: 'hr',
      fromName: 'HR',
      toPersonId: personId,
      body: 'Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month.',
      date: new Date().toISOString(),
      read: false
    };

    onDataChange('messages', [...state.data.messages, newMessage]);
    setSentIds([...sentIds, personId]);
  };

  const sendToAll = () => {
    const newMessages = overduepeople
      .filter(p => !sentIds.includes(p.id))
      .map(person => ({
        id: 'msg' + Date.now() + Math.random(),
        fromRole: 'hr',
        fromName: 'HR',
        toPersonId: person.id,
        body: 'Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month.',
        date: new Date().toISOString(),
        read: false
      }));

    onDataChange('messages', [...state.data.messages, ...newMessages]);
    setSentIds(overduepeople.map(p => p.id));
  };

  if (overduepeople.length === 0) {
    return (
      <div>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
          Reminders
        </h2>
        <div style={{
          padding: '16px',
          backgroundColor: '#d4edda',
          color: '#28a745',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 400
        }}>
          All individuals are up to date for this month.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        Reminders
      </h2>

      <div style={{
        padding: '12px 16px',
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderRadius: '12px',
        marginBottom: '24px',
        fontSize: '13px',
        fontWeight: 400
      }}>
        {overduepeople.length} people overdue for this month's update
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        {overduepeople.map(person => (
          <div
            key={person.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#fff3cd',
              border: '0.5px solid #ffeaa7',
              borderRadius: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>
                {person.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {person.department} · Last updated {getLastUpdateDate(person.id)}
              </div>
            </div>

            <div>
              {sentIds.includes(person.id) ? (
                <div style={{ fontSize: '13px', fontWeight: 400, color: '#28a745' }}>
                  Sent
                </div>
              ) : (
                <button
                  onClick={() => sendReminder(person.id)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 400,
                    cursor: 'pointer'
                  }}
                >
                  Send reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Action */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f9f9f9',
        border: '0.5px solid #e0e0e0',
        borderRadius: '12px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
          Send to all overdue
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          Send a reminder message to all {overduepeople.length} overdue individuals at once.
        </div>
        <button
          onClick={sendToAll}
          disabled={sentIds.length === overduepeople.length}
          style={{
            padding: '10px 16px',
            backgroundColor: sentIds.length === overduepeople.length ? '#ccc' : '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 400,
            cursor: sentIds.length === overduepeople.length ? 'not-allowed' : 'pointer'
          }}
        >
          Send to all
        </button>
      </div>
    </div>
  );
}

export default Reminders;
