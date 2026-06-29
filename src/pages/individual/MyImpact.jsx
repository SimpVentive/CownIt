import React from 'react';

const CPQSDP_COLORS = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
};

const CPQSDP_LABELS = {
  C: 'Cost',
  P: 'Productivity',
  Q: 'Quality',
  S: 'Safety',
  D: 'Delivery',
  O: 'People'
};

function MyImpact({ state }) {
  const userAchievements = state.data.achievements
    .filter(a => a.personId === state.currentUserId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const avgRating = userAchievements.length > 0
    ? (userAchievements.reduce((sum, a) => sum + a.impactRating, 0) / userAchievements.length).toFixed(1)
    : '—';

  const uniqueDims = new Set();
  userAchievements.forEach(a => a.cpqsdp.forEach(d => uniqueDims.add(d)));
  const dimsCovered = `${uniqueDims.size}/6`;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getCommitLevel = (commitId) => {
    return state.data.commits.find(c => c.id === commitId)?.level || null;
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        My impact
      </h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Achievements logged', value: userAchievements.length },
          { label: 'Avg impact rating', value: avgRating },
          { label: 'Dimensions covered', value: dimsCovered }
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
            <div style={{ fontSize: '24px', fontWeight: 500 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 500 }}>
        Achievements
      </h3>

      {userAchievements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {userAchievements.map(achievement => {
            const level = getCommitLevel(achievement.commitId);
            const hrComments = state.data.hrComments.filter(c => c.achievementId === achievement.id);

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
                {/* Title */}
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                  {achievement.title}
                </div>

                {/* Meta */}
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>{formatDate(achievement.date)}</span>
                  <span>•</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {achievement.cpqsdp.map(dim => (
                      <div
                        key={dim}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: CPQSDP_COLORS[dim]
                        }}
                      />
                    ))}
                    <span>{achievement.cpqsdp.join(', ')}</span>
                  </div>
                  <span>•</span>
                  <span>Impact: {achievement.impactRating}/10</span>
                </div>

                {/* Evidence */}
                <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
                  {achievement.evidence}
                </div>

                {/* File */}
                {achievement.fileAttachment && (
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                    Attachment: {achievement.fileAttachment}
                  </div>
                )}

                {/* HR Comments */}
                {hrComments.length > 0 && (
                  <div style={{ borderTop: '0.5px solid #e0e0e0', paddingTop: '12px' }}>
                    {hrComments.map(comment => (
                      <div
                        key={comment.id}
                        style={{
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          borderLeft: `2px solid #007bff`
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#007bff', marginBottom: '4px' }}>
                          HR comment
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                          {comment.body}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {comment.authorName} · {formatDate(comment.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
          No achievements logged yet
        </div>
      )}
    </div>
  );
}

export default MyImpact;
