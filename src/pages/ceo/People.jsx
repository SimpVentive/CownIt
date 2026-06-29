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

function People({ state }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const formatDate = (isoString) => {
    if (!isoString) return 'No activity';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getLastActive = (personId) => {
    const updates = state.data.monthlyUpdates
      .filter(u => u.personId === personId)
      .map(u => new Date(u.updatedAt).getTime());

    const achievements = state.data.achievements
      .filter(a => a.personId === personId)
      .map(a => new Date(a.date).getTime());

    const allDates = [...updates, ...achievements];
    if (allDates.length === 0) return 'No activity';

    return formatDate(new Date(Math.max(...allDates)).toISOString());
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        People view
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {state.data.people.map(person => {
          const commitCount = state.data.commits.filter(c => c.personId === person.id).length;
          const achievementCount = state.data.achievements.filter(a => a.personId === person.id).length;
          const healthScore = computeHealthScore(person.id, state.data);
          const isUpdated = state.data.monthlyUpdates.some(
            u => u.personId === person.id && u.month === currentMonth && u.year === currentYear
          );

          return (
            <div
              key={person.id}
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                border: '0.5px solid #e0e0e0',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                    {person.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {person.department}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  backgroundColor: isUpdated ? '#d4edda' : '#f8d7da',
                  color: isUpdated ? '#28a745' : '#dc3545',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 500
                }}>
                  {isUpdated ? 'Current' : 'Overdue'}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '24px',
                fontSize: '12px',
                color: '#666',
                paddingTop: '12px',
                borderTop: '0.5px solid #e0e0e0'
              }}>
                <span>{commitCount} commits</span>
                <span>•</span>
                <span>{achievementCount} achievements</span>
                <span>•</span>
                <span>Health: {healthScore}/100</span>
                <span>•</span>
                <span>Last active: {getLastActive(person.id)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default People;
