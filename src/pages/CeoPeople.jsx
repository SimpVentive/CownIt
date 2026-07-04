import React from 'react';
import { computeHealthScore } from '../utils/healthScore';
import { formatDate } from '../utils/formatDate';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const GREEN_COLOR = '#28a745';
const RED_COLOR = '#dc3545';

const AVATAR_COLORS = ['#667BC6', '#6B8E99', '#B8956A', '#FF7F50'];

function CEOPeople({ data, onNavigate, onSelectRecipient }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();


  const getLastActive = (personId) => {
    const updates = data.monthlyUpdates
      .filter(u => u.personId === personId)
      .map(u => u.updatedAt);

    const achievements = data.achievements
      .filter(a => a.personId === personId)
      .map(a => a.date);

    const allDates = [...updates, ...achievements];

    if (allDates.length === 0) return 'No activity yet';

    const latest = Math.max(...allDates.map(d => new Date(d)));
    return formatDate(new Date(latest).toISOString());
  };

  const peopleWithMetrics = data.people.map(person => {
    const commitCount = data.commits.filter(c => c.personId === person.id).length;
    const achievementCount = data.achievements.filter(a => a.personId === person.id).length;
    const healthScore = computeHealthScore(person.id, data);
    const isUpdated = data.monthlyUpdates.some(
      u =>
        u.personId === person.id &&
        u.month === currentMonth &&
        u.year === currentYear
    );
    const lastActive = getLastActive(person.id);

    return {
      ...person,
      commitCount,
      achievementCount,
      healthScore,
      lastActive,
      isUpdated
    };
  });

  const handleMessage = (personId) => {
    onSelectRecipient(personId);
    onNavigate('ceo-message');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>People view</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {peopleWithMetrics.map(person => {
          const personIndex = data.people.indexOf(person);
          const avatarColor = AVATAR_COLORS[personIndex % AVATAR_COLORS.length];

          return (
            <div
              key={person.id}
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              {/* Row 1: Avatar + Name + Department + Status */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '12px'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px',
                    flexShrink: 0
                  }}
                >
                  {person.initials}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                    {person.name}
                  </div>
                  <div style={{ fontSize: '12px', color: SECONDARY_TEXT }}>
                    {person.department}
                  </div>
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: person.isUpdated ? '#d4edda' : '#f8d7da',
                    color: person.isUpdated ? GREEN_COLOR : RED_COLOR
                  }}
                >
                  {person.isUpdated ? 'Current' : 'Overdue'}
                </div>
              </div>

              {/* Row 2: Metrics */}
              <div
                style={{
                  display: 'flex',
                  gap: '24px',
                  fontSize: '12px',
                  color: SECONDARY_TEXT,
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #eee'
                }}
              >
                <span>{person.commitCount} commits</span>
                <span>·</span>
                <span>{person.achievementCount} achievements</span>
                <span>·</span>
                <span>Health: {person.healthScore}/100</span>
                <span>·</span>
                <span>Last active: {person.lastActive}</span>
              </div>

              {/* Row 3: Message Button */}
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => handleMessage(person.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: ACCENT_COLOR,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CEOPeople;
