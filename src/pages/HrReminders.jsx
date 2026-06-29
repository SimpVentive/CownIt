import React, { useState } from 'react';
import { formatDate, currentMonthName } from '../utils/formatDate';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const MUTED_TEXT = '#ccc';
const GREEN_COLOR = '#28a745';
const WARNING_COLOR = '#ffc107';
const WARNING_BG = '#FAEEDA';
const WARNING_BORDER = '#F4E4C1';

const AVATAR_COLORS = ['#667BC6', '#6B8E99', '#B8956A', '#FF7F50'];

function HrReminders({ data, onDataChange }) {
  const [sentIds, setSentIds] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const overduepeople = data.people.filter(person =>
    !data.monthlyUpdates.some(
      u =>
        u.personId === person.id &&
        u.month === currentMonth &&
        u.year === currentYear
    )
  );

  const monthName = currentMonthName();

  const getLastUpdateDate = (personId) => {
    const lastUpdate = data.monthlyUpdates
      .filter(u => u.personId === personId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    return lastUpdate ? formatDate(lastUpdate.updatedAt) : 'Never';
  };

  const handleSendReminder = (personId) => {
    const newMessage = {
      id: 'msg' + Date.now(),
      fromRole: 'hr',
      fromName: 'HR',
      toPersonId: personId,
      body: 'Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month.',
      date: new Date().toISOString(),
      read: false
    };

    onDataChange('messages', [...data.messages, newMessage]);
    setSentIds([...sentIds, personId]);
  };

  const handleSendToAll = () => {
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

    onDataChange('messages', [...data.messages, ...newMessages]);
    setSentIds(overduepeople.map(p => p.id));
  };

  if (overduepeople.length === 0) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Reminders</h2>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#d4edda',
            borderRadius: '4px',
            color: GREEN_COLOR,
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          All individuals are up to date for this month.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Reminders</h2>

      {/* Heading Stat */}
      <div
        style={{
          padding: '16px',
          backgroundColor: WARNING_BG,
          border: `1px solid ${WARNING_BORDER}`,
          borderRadius: '4px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}
      >
        {overduepeople.length} people overdue for {monthName} update
      </div>

      {/* Overdue List */}
      <div style={{ marginBottom: '32px' }}>
        {overduepeople.map((person, idx) => {
          const personIndex = data.people.indexOf(person);
          const avatarColor = AVATAR_COLORS[personIndex % AVATAR_COLORS.length];
          const alreadySent = sentIds.includes(person.id);

          return (
            <div
              key={person.id}
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: WARNING_BG,
                border: `1px solid ${WARNING_BORDER}`,
                borderRadius: '4px',
                marginBottom: idx < overduepeople.length - 1 ? '12px' : '0'
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '11px',
                  flexShrink: 0
                }}
              >
                {person.initials}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                  {person.name}
                </div>
                <div style={{ fontSize: '12px', color: SECONDARY_TEXT }}>
                  {person.department} · Last updated {getLastUpdateDate(person.id)}
                </div>
              </div>

              {/* Action */}
              <div>
                {alreadySent ? (
                  <div style={{ fontSize: '13px', color: GREEN_COLOR, fontWeight: '500' }}>
                    Sent ✓
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendReminder(person.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: ACCENT_COLOR,
                      border: `1px solid ${ACCENT_COLOR}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    Send reminder
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Reminder Card */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          border: `1px solid #ddd`,
          borderRadius: '4px'
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          Send to all overdue
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: SECONDARY_TEXT }}>
          Send a single reminder message to all {overduepeople.length}{' '}
          overdue individual{overduepeople.length !== 1 ? 's' : ''} at once.
        </p>
        <button
          onClick={handleSendToAll}
          disabled={sentIds.length === overduepeople.length}
          style={{
            padding: '10px 20px',
            backgroundColor:
              sentIds.length === overduepeople.length ? '#ccc' : ACCENT_COLOR,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor:
              sentIds.length === overduepeople.length
                ? 'not-allowed'
                : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          Send to all
        </button>
      </div>
    </div>
  );
}

export default HrReminders;
