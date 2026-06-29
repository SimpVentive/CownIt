import React from 'react';

const CPQSDP_INFO = {
  C: { label: 'Cost', color: '#534AB7' },
  P: { label: 'Productivity', color: '#0F6E56' },
  Q: { label: 'Quality', color: '#3B6D11' },
  S: { label: 'Safety', color: '#993C1D' },
  D: { label: 'Delivery', color: '#185FA5' },
  O: { label: 'People', color: '#854F0B' }
};

function Dashboard({ state }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalPeople = state.data.people.length;
  const totalAchievements = state.data.achievements.length;
  const avgImpact = totalAchievements > 0
    ? (state.data.achievements.reduce((sum, a) => sum + a.impactRating, 0) / totalAchievements).toFixed(1)
    : '—';

  const updatedCount = state.data.people.filter(p =>
    state.data.monthlyUpdates.some(u =>
      u.personId === p.id && u.month === currentMonth && u.year === currentYear
    )
  ).length;

  const uniqueDepts = new Set(state.data.people.map(p => p.department)).size;

  // CPQSDP Scores
  const cpqsdpScores = {};
  Object.keys(CPQSDP_INFO).forEach(dim => {
    const achievementsWithDim = state.data.achievements.filter(a => a.cpqsdp.includes(dim));
    if (achievementsWithDim.length > 0) {
      cpqsdpScores[dim] = (
        achievementsWithDim.reduce((sum, a) => sum + a.impactRating, 0) / achievementsWithDim.length
      ).toFixed(1);
    } else {
      cpqsdpScores[dim] = '—';
    }
  });

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const recentAchievements = [...state.data.achievements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        Dashboard
      </h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'People committed', value: totalPeople, sub: `across ${uniqueDepts} department${uniqueDepts !== 1 ? 's' : ''}` },
          { label: 'Total achievements', value: totalAchievements, sub: 'since programme start' },
          { label: 'Avg impact score', value: avgImpact, sub: 'self-rated / 10' },
          { label: 'Updated this month', value: `${updatedCount}/${totalPeople}`, sub: 'individuals' }
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              padding: '16px',
              backgroundColor: '#fff',
              border: '0.5px solid #e0e0e0',
              borderRadius: '12px'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 400, color: '#666', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 500, marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* CPQSDP */}
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 500 }}>
        CPQSDP impact scores
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {Object.entries(CPQSDP_INFO).map(([key, info]) => {
          const score = cpqsdpScores[key];
          const isScore = score !== '—';

          return (
            <div
              key={key}
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                border: '0.5px solid #e0e0e0',
                borderRadius: '12px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 400, color: '#666', marginBottom: '8px' }}>
                {info.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 500, color: info.color, marginBottom: '8px' }}>
                {score}
              </div>
              {isScore && (
                <div style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(parseFloat(score) / 10) * 100}%`,
                    backgroundColor: info.color
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 500 }}>
        Recent achievements
      </h3>

      {recentAchievements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentAchievements.map(achievement => {
            const person = state.data.people.find(p => p.id === achievement.personId);

            return (
              <div
                key={achievement.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '0.5px solid #e0e0e0',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                      {achievement.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      By {person?.name} · {formatDate(achievement.date)}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {achievement.impactRating}/10
                  </div>
                </div>
              </div>
            );
          })}
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
          No achievements yet
        </div>
      )}
    </div>
  );
}

export default Dashboard;
