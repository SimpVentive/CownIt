import React from 'react';
import { formatDate } from '../utils/formatDate';

const SECONDARY_TEXT = '#999';
const MUTED_TEXT = '#ccc';
const GREEN_COLOR = '#28a745';
const AMBER_COLOR = '#ffc107';
const RED_COLOR = '#dc3545';

const CPQSDP_INFO = {
  C: { label: 'Cost', color: '#534AB7' },
  P: { label: 'Productivity', color: '#0F6E56' },
  Q: { label: 'Quality', color: '#3B6D11' },
  S: { label: 'Safety', color: '#993C1D' },
  D: { label: 'Delivery', color: '#185FA5' },
  O: { label: 'People', color: '#854F0B' }
};

const CPQSDP_COLORS = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
};

function CEODashboard({ data }) {
  // Computed values
  const totalPeople = data.people.length;
  const totalAchievements = data.achievements.length;
  const avgImpact =
    data.achievements.length > 0
      ? (
          data.achievements.reduce((sum, a) => sum + a.impactRating, 0) /
          data.achievements.length
        ).toFixed(1)
      : '—';

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const updatedCount = data.people.filter(p =>
    data.monthlyUpdates.some(
      u =>
        u.personId === p.id &&
        u.month === currentMonth &&
        u.year === currentYear
    )
  ).length;
  const updatedPct = Math.round((updatedCount / totalPeople) * 100) + '%';

  const uniqueDepartments = new Set(data.people.map(p => p.department)).size;

  // CPQSDP scores
  const cpqsdpScores = {};
  ['C', 'P', 'Q', 'S', 'D', 'O'].forEach(dimension => {
    const achievementsWithDimension = data.achievements.filter(a =>
      a.cpqsdp.includes(dimension)
    );
    if (achievementsWithDimension.length > 0) {
      cpqsdpScores[dimension] =
        (
          achievementsWithDimension.reduce((sum, a) => sum + a.impactRating, 0) /
          achievementsWithDimension.length
        ).toFixed(1);
    } else {
      cpqsdpScores[dimension] = '—';
    }
  });

  // Recent achievements
  const recentAchievements = [...data.achievements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);


  const getPersonName = (personId) => {
    const person = data.people.find(p => p.id === personId);
    return person?.name || 'Unknown';
  };

  const getUpdatedPercentColor = () => {
    const pct = parseInt(updatedPct);
    if (pct >= 75) return GREEN_COLOR;
    if (pct >= 50) return AMBER_COLOR;
    return RED_COLOR;
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Dashboard</h2>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[
          {
            label: 'People committed',
            value: totalPeople,
            sub: `across ${uniqueDepartments} department${uniqueDepartments !== 1 ? 's' : ''}`
          },
          {
            label: 'Total achievements',
            value: totalAchievements,
            sub: 'since programme start'
          },
          {
            label: 'Avg impact score',
            value: avgImpact,
            sub: 'self-rated / 10'
          },
          {
            label: 'Updated this month',
            value: updatedPct,
            sub: `${updatedCount} of ${totalPeople}`,
            valueColor: getUpdatedPercentColor()
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
            <div
              style={{
                fontSize: '12px',
                color: SECONDARY_TEXT,
                marginBottom: '8px'
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '4px',
                color: stat.valueColor || '#000'
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: SECONDARY_TEXT }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* CPQSDP Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
          CPQSDP impact — cumulative scores
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['C', 'P', 'Q', 'S', 'D', 'O'].map(dimension => {
            const score = cpqsdpScores[dimension];
            const info = CPQSDP_INFO[dimension];
            const isScore = score !== '—';
            const percentage = isScore ? (parseFloat(score) / 10) * 100 : 0;

            return (
              <div
                key={dimension}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '8px' }}>
                  {info.label}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: info.color
                  }}
                >
                  {score}
                </div>
                {isScore && (
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: info.color + '33',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: info.color
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
          Recent achievements
        </h3>
        {recentAchievements.length > 0 ? (
          <div style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
            {recentAchievements.map((achievement, idx) => (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderBottom:
                    idx < recentAchievements.length - 1 ? '1px solid #ddd' : 'none'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                    {getPersonName(achievement.personId)}
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                    {achievement.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '11px',
                      color: SECONDARY_TEXT,
                      alignItems: 'center'
                    }}
                  >
                    <span>{formatDate(achievement.date)}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {achievement.cpqsdp.map(tag => (
                        <div
                          key={tag}
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: CPQSDP_COLORS[tag]
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#f0f7ff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#007bff',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Impact: {achievement.impactRating}/10
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: SECONDARY_TEXT, fontSize: '13px' }}>
            No achievements logged yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default CEODashboard;
