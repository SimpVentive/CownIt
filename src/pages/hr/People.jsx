import React from 'react';

function computeHealthScore(personId, data) {
  let score = 0;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const personCommits = data.commits.filter(c => c.personId === personId);
  const filledLevels = new Set(personCommits.map(c => c.level));
  score += (filledLevels.size / 3) * 40;

  const hasUpdate = data.monthlyUpdates.some(
    u => u.personId === personId && u.month === currentMonth && u.year === currentYear
  );
  if (hasUpdate) score += 40;

  const hasAchievement = data.achievements.some(
    a => a.personId === personId &&
    new Date(a.date).getMonth() + 1 === currentMonth &&
    new Date(a.date).getFullYear() === currentYear
  );
  if (hasAchievement) score += 20;

  return Math.round(score);
}

function People({ state, onSelectPerson }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });
  };

  const peopleData = state.data.people.map(person => {
    const score = computeHealthScore(person.id, state.data);
    const hasUpdate = state.data.monthlyUpdates.some(
      u => u.personId === person.id && u.month === currentMonth && u.year === currentYear
    );
    const lastUpdate = state.data.monthlyUpdates
      .filter(u => u.personId === person.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

    return {
      ...person,
      score,
      hasUpdate,
      lastUpdate
    };
  });

  const updatedCount = peopleData.filter(p => p.hasUpdate).length;
  const avgScore = Math.round(peopleData.reduce((sum, p) => sum + p.score, 0) / peopleData.length);

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        People
      </h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total people', value: state.data.people.length },
          { label: 'Updated this month', value: updatedCount, color: '#28a745' },
          { label: 'Overdue', value: state.data.people.length - updatedCount, color: '#dc3545' },
          { label: 'Avg health score', value: avgScore }
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
            <div style={{ fontSize: '24px', fontWeight: 500, color: stat.color || '#000' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          fontWeight: 400
        }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid #e0e0e0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 500 }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 500 }}>Last update</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 500 }}>Health score</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {peopleData.map(person => (
              <tr key={person.id} style={{ borderBottom: '0.5px solid #e0e0e0' }}>
                <td style={{ padding: '12px' }}>{person.name}</td>
                <td style={{ padding: '12px' }}>{person.department}</td>
                <td style={{ padding: '12px' }}>{person.lastUpdate ? formatDate(person.lastUpdate.updatedAt) : 'Never'}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{person.score}/100</span>
                    <div style={{
                      width: '60px',
                      height: '4px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${person.score}%`,
                        backgroundColor: person.score >= 75 ? '#28a745' : person.score >= 50 ? '#007bff' : '#dc3545'
                      }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: person.hasUpdate ? '#d4edda' : '#f8d7da',
                    color: person.hasUpdate ? '#28a745' : '#dc3545',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {person.hasUpdate ? 'Current' : 'Overdue'}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => onSelectPerson(person.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 400,
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default People;
