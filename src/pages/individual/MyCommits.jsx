import React from 'react';

function MyCommits({ state }) {
  const currentUser = state.data.people.find(p => p.id === state.currentUserId);
  const userCommits = state.data.commits.filter(c => c.personId === state.currentUserId);

  const levels = [
    { key: 'self', label: 'Self', bg: '#EEEDFE', text: '#3C3489' },
    { key: 'team', label: 'Team / Dept', bg: '#E1F5EE', text: '#085041' },
    { key: 'org', label: 'Organisation', bg: '#FAEEDA', text: '#633806' }
  ];

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        My commitments
      </h2>

      {levels.map(level => {
        const levelCommits = userCommits.filter(c => c.level === level.key);

        return (
          <div key={level.key} style={{ marginBottom: '32px' }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: level.bg,
              color: level.text,
              borderRadius: '12px',
              marginBottom: '12px',
              fontSize: '13px',
              fontWeight: 500
            }}>
              {level.label}
            </div>

            {levelCommits.length > 0 ? (
              levelCommits.map(commit => (
                <div
                  key={commit.id}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f9f9f9',
                    border: '0.5px solid #e0e0e0',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: 400
                  }}
                >
                  {commit.statement}
                </div>
              ))
            ) : (
              <div style={{
                padding: '12px 16px',
                color: '#999',
                fontSize: '13px',
                fontWeight: 400
              }}>
                No commitments yet
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MyCommits;
