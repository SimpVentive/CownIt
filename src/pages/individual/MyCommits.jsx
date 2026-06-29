import React from 'react';

const COMMIT_STYLES = {
  self: { bg: '#EEEDFE', text: '#3C3489' },
  team: { bg: '#E1F5EE', text: '#085041' },
  org: { bg: '#FAEEDA', text: '#633806' }
};

const COMMIT_LABELS = {
  self: 'Self',
  team: 'Team / Dept',
  org: 'Organisation'
};

function MyCommits({ state }) {
  const userCommits = state.data.commits.filter(c => c.personId === state.currentUserId);

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        My commitments
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {Object.entries(COMMIT_LABELS).map(([key, label]) => {
          const levelCommits = userCommits.filter(c => c.level === key);
          const style = COMMIT_STYLES[key];

          return (
            <div key={key}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: style.bg,
                color: style.text,
                borderRadius: '12px',
                marginBottom: '12px',
                fontSize: '13px',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                {label}
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#fff',
                border: '0.5px solid #e0e0e0',
                borderRadius: '12px',
                minHeight: '200px'
              }}>
                {levelCommits.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {levelCommits.map(commit => (
                      <div
                        key={commit.id}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: '1.4',
                          color: '#333'
                        }}
                      >
                        {commit.statement}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    color: '#999',
                    fontSize: '13px',
                    fontWeight: 400,
                    textAlign: 'center',
                    paddingTop: '60px'
                  }}>
                    No commitments yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: 400,
        color: '#666',
        lineHeight: '1.6'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          <strong>About commitments:</strong>
        </p>
        <p style={{ margin: 0 }}>
          You can set up to 3 commitments per level. Log achievements against any commitment at any time. There is no deadline — commitments are open-ended and accumulate over time.
        </p>
      </div>
    </div>
  );
}

export default MyCommits;
