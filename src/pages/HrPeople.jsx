import React, { useState } from 'react';
import { computeHealthScore } from '../utils/healthScore';
import { formatDate } from '../utils/formatDate';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const MUTED_TEXT = '#ccc';
const GREEN_COLOR = '#28a745';
const RED_COLOR = '#dc3545';

const AVATAR_COLORS = ['#667BC6', '#6B8E99', '#B8956A', '#FF7F50'];

function HrPeople({ data, onNavigate, onSelectPerson, onDataChange }) {
  const [reminderSent, setReminderSent] = useState({});

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const healthScores = data.people.map(p => computeHealthScore(p.id, data));
  const avgHealthScore =
    healthScores.length > 0
      ? Math.round(healthScores.reduce((a, b) => a + b, 0) / healthScores.length)
      : 0;

  const peopleWithStatus = data.people.map(person => {
    const hasUpdate = data.monthlyUpdates.some(
      u =>
        u.personId === person.id &&
        u.month === currentMonth &&
        u.year === currentYear
    );

    const lastUpdate = data.monthlyUpdates
      .filter(u => u.personId === person.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    return {
      ...person,
      hasUpdate,
      lastUpdate,
      healthScore: computeHealthScore(person.id, data)
    };
  });

  const updatedCount = peopleWithStatus.filter(p => p.hasUpdate).length;
  const overdueCount = data.people.length - updatedCount;


  const handleRemind = (personId) => {
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

    setReminderSent({ ...reminderSent, [personId]: true });
    setTimeout(() => {
      setReminderSent(prev => {
        const updated = { ...prev };
        delete updated[personId];
        return updated;
      });
    }, 2000);
  };

  const handleView = (personId) => {
    onSelectPerson(personId);
    onNavigate('hr-drilldown');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>People</h2>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[
          {
            label: 'Total people',
            value: data.people.length,
            valueColor: '#000'
          },
          {
            label: 'Updated this month',
            value: updatedCount,
            valueColor: GREEN_COLOR
          },
          {
            label: 'Overdue',
            value: overdueCount,
            valueColor: RED_COLOR
          },
          {
            label: 'Avg health score',
            value: avgHealthScore,
            valueColor: '#000'
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: stat.valueColor }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fafafa' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: SECONDARY_TEXT }}>
                Name
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: SECONDARY_TEXT }}>
                Last update
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: SECONDARY_TEXT }}>
                Health score
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: SECONDARY_TEXT }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: SECONDARY_TEXT }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {peopleWithStatus.map((person, idx) => (
              <tr
                key={person.id}
                style={{
                  borderBottom: idx < peopleWithStatus.length - 1 ? '1px solid #ddd' : 'none'
                }}
              >
                {/* Avatar + Name + Dept */}
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: AVATAR_COLORS[data.people.indexOf(person) % AVATAR_COLORS.length],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '600',
                        fontSize: '12px',
                        flexShrink: 0
                      }}
                    >
                      {person.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>
                        {person.name}
                      </div>
                      <div style={{ fontSize: '11px', color: SECONDARY_TEXT }}>
                        {person.department}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Last update */}
                <td style={{ padding: '12px', fontSize: '13px', color: SECONDARY_TEXT }}>
                  {person.lastUpdate ? formatDate(person.lastUpdate.updatedAt) : 'Never'}
                </td>

                {/* Health score */}
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', minWidth: '50px' }}>
                      {person.healthScore}/100
                    </div>
                    <div
                      style={{
                        width: '80px',
                        height: '5px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${person.healthScore}%`,
                          backgroundColor:
                            person.healthScore >= 75
                              ? GREEN_COLOR
                              : person.healthScore >= 50
                              ? ACCENT_COLOR
                              : RED_COLOR
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: '12px' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: person.hasUpdate
                        ? '#d4edda'
                        : '#f8d7da',
                      color: person.hasUpdate ? GREEN_COLOR : RED_COLOR
                    }}
                  >
                    {person.hasUpdate ? 'Current' : 'Overdue'}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleView(person.id)}
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
                      View
                    </button>
                    {!person.hasUpdate && (
                      <button
                        onClick={() => handleRemind(person.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'transparent',
                          color: RED_COLOR,
                          border: `1px solid ${RED_COLOR}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          transition: 'all 0.2s'
                        }}
                      >
                        Remind
                      </button>
                    )}
                    {reminderSent[person.id] && (
                      <span style={{ fontSize: '12px', color: GREEN_COLOR, whiteSpace: 'nowrap' }}>
                        Reminder sent
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HrPeople;
