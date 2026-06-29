import React from 'react';
import { formatDate } from '../utils/formatDate';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const MUTED_TEXT = '#ccc';

const COMMIT_COLORS = {
  self: '#534AB7',
  team: '#0F6E56',
  org: '#854F0B'
};

const CPQSDP_COLORS = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
};

function MyImpact({ data, currentPersonId }) {
  const myAchievements = data.achievements
    .filter(a => a.personId === currentPersonId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const avgRating =
    myAchievements.length > 0
      ? (
          myAchievements.reduce((sum, a) => sum + a.impactRating, 0) /
          myAchievements.length
        ).toFixed(1)
      : '—';

  const uniqueDimensions = new Set();
  myAchievements.forEach(a => {
    a.cpqsdp.forEach(tag => uniqueDimensions.add(tag));
  });
  const dimensionsCovered = `${uniqueDimensions.size}/6`;


  const getCommitLevel = (commitId) => {
    const commit = data.commits.find(c => c.id === commitId);
    return commit?.level || null;
  };

  const getCommitLevelText = (level) => {
    const map = {
      self: 'Self commit',
      team: 'Team commit',
      org: 'Org commit'
    };
    return map[level] || '';
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>My impact</h2>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[
          {
            label: 'Achievements logged',
            value: myAchievements.length
          },
          {
            label: 'Avg impact rating',
            value: avgRating
          },
          {
            label: 'Dimensions covered',
            value: dimensionsCovered
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#fff',
              border: `1px solid #ddd`,
              borderRadius: '4px'
            }}
          >
            <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Log */}
      {myAchievements.length > 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
          {myAchievements.map((achievement, idx) => {
            const commitLevel = getCommitLevel(achievement.commitId);
            const hrComments = data.hrComments.filter(
              c => c.achievementId === achievement.id
            );

            return (
              <div
                key={achievement.id}
                style={{
                  borderBottom: idx < myAchievements.length - 1 ? '0.5px solid #ddd' : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
                  {/* Colored dot */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: COMMIT_COLORS[commitLevel] || '#ccc',
                      flexShrink: 0,
                      marginTop: '5px'
                    }}
                  />

                  {/* Right content */}
                  <div style={{ flex: 1 }}>
                    {/* Title */}
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                      {achievement.title}
                    </div>

                    {/* Meta row */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '11px',
                        color: SECONDARY_TEXT,
                        marginBottom: '8px',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}
                    >
                      {/* Date */}
                      <span>{formatDate(achievement.date)}</span>

                      {/* Commit level */}
                      <span>{getCommitLevelText(commitLevel)}</span>

                      {/* CPQSDP */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {achievement.cpqsdp.map(tag => (
                          <div
                            key={tag}
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: CPQSDP_COLORS[tag]
                            }}
                          />
                        ))}
                        <span>{achievement.cpqsdp.join(', ')}</span>
                      </div>

                      {/* Impact rating */}
                      <span>
                        Impact: <span style={{ fontWeight: '700' }}>{achievement.impactRating}/10</span>
                      </span>
                    </div>

                    {/* Evidence */}
                    <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '8px' }}>
                      {achievement.evidence}
                    </div>

                    {/* File attachment */}
                    {achievement.fileAttachment && (
                      <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '8px' }}>
                        📎 {achievement.fileAttachment}
                      </div>
                    )}

                    {/* HR Comments */}
                    {hrComments.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        {hrComments.map(comment => (
                          <div
                            key={comment.id}
                            style={{
                              borderLeft: `2px solid ${ACCENT_COLOR}`,
                              backgroundColor: '#f0f7ff',
                              borderRadius: '0 4px 4px 0',
                              padding: '12px',
                              marginBottom: '8px'
                            }}
                          >
                            <div
                              style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                color: ACCENT_COLOR,
                                marginBottom: '4px'
                              }}
                            >
                              HR comment
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: SECONDARY_TEXT,
                                marginBottom: '4px'
                              }}
                            >
                              {comment.body}
                            </div>
                            <div style={{ fontSize: '11px', color: MUTED_TEXT }}>
                              {comment.authorName} · {formatDate(comment.date)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: SECONDARY_TEXT
          }}
        >
          <p>No achievements logged yet.</p>
        </div>
      )}
    </div>
  );
}

export default MyImpact;
