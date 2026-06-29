import React, { useState } from 'react';

const COMMIT_STYLES = {
  self: { bg: '#EEEDFE', text: '#3C3489' },
  team: { bg: '#E1F5EE', text: '#085041' },
  org: { bg: '#FAEEDA', text: '#633806' }
};

const CPQSDP_COLORS = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
};

function Drilldown({ state, onDataChange }) {
  const [commentDrafts, setCommentDrafts] = useState({});

  if (!state.selectedPersonId) {
    return (
      <div style={{ padding: '32px', color: '#666', textAlign: 'center' }}>
        Select a person from the People list to view details
      </div>
    );
  }

  const person = state.data.people.find(p => p.id === state.selectedPersonId);
  const personCommits = state.data.commits.filter(c => c.personId === state.selectedPersonId);
  const personAchievements = state.data.achievements
    .filter(a => a.personId === state.selectedPersonId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handlePostComment = (achievementId) => {
    const body = commentDrafts[achievementId]?.trim();
    if (!body) return;

    const newComment = {
      id: 'hrc' + Date.now(),
      achievementId,
      authorName: 'HR',
      body,
      date: new Date().toISOString()
    };

    onDataChange('hrComments', [...state.data.hrComments, newComment]);
    setCommentDrafts({ ...commentDrafts, [achievementId]: '' });
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        {person.name}
      </h2>

      {/* Commits */}
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 500 }}>Commitments</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {['self', 'team', 'org'].map(level => {
          const levelCommits = personCommits.filter(c => c.level === level);
          const style = COMMIT_STYLES[level];

          return (
            <div key={level}>
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
                {level === 'self' ? 'Self' : level === 'team' ? 'Team / Dept' : 'Organisation'}
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#fff',
                border: '0.5px solid #e0e0e0',
                borderRadius: '12px',
                minHeight: '120px'
              }}>
                {levelCommits.length > 0 ? (
                  levelCommits.map(commit => (
                    <div key={commit.id} style={{ fontSize: '12px', lineHeight: '1.4', marginBottom: '8px', color: '#333' }}>
                      • {commit.statement}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#999' }}>None</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 500 }}>Achievements</h3>

      {personAchievements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {personAchievements.map(achievement => {
            const achievementComments = state.data.hrComments.filter(c => c.achievementId === achievement.id);

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
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                  {achievement.title}
                </div>

                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', display: 'flex', gap: '12px' }}>
                  <span>{formatDate(achievement.date)}</span>
                  <span>•</span>
                  <span>Impact: {achievement.impactRating}/10</span>
                </div>

                <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                  {achievement.evidence}
                </div>

                {/* Existing Comments */}
                {achievementComments.length > 0 && (
                  <div style={{ marginBottom: '12px', borderTop: '0.5px solid #e0e0e0', paddingTop: '12px' }}>
                    {achievementComments.map(comment => (
                      <div
                        key={comment.id}
                        style={{
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          borderLeft: '2px solid #007bff'
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

                {/* Comment Form */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentDrafts[achievement.id] || ''}
                    onChange={(e) => setCommentDrafts({ ...commentDrafts, [achievement.id]: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '0.5px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 400
                    }}
                  />
                  <button
                    onClick={() => handlePostComment(achievement.id)}
                    disabled={!commentDrafts[achievement.id]?.trim()}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: commentDrafts[achievement.id]?.trim() ? '#000' : '#ccc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 400,
                      cursor: commentDrafts[achievement.id]?.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Post
                  </button>
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
          No achievements logged yet
        </div>
      )}
    </div>
  );
}

export default Drilldown;
