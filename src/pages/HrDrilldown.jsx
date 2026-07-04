import React, { useState } from 'react';
import { computeHealthScore } from '../utils/healthScore';
import { formatDate } from '../utils/formatDate';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const MUTED_TEXT = '#ccc';
const GREEN_COLOR = '#28a745';
const RED_COLOR = '#dc3545';

const AVATAR_COLORS = ['#667BC6', '#6B8E99', '#B8956A', '#FF7F50'];

const COMMIT_LEVEL_COLORS = {
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

function HrDrilldown({ data, selectedPersonId, onDataChange, onNavigate }) {
  const [commentDrafts, setCommentDrafts] = useState({});
  const [reminderSent, setReminderSent] = useState(false);

  if (!selectedPersonId) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: SECONDARY_TEXT, marginBottom: '16px' }}>
          Select a person from the People screen to view their profile.
        </p>
        <button
          onClick={() => onNavigate('hr-people')}
          style={{
            padding: '10px 20px',
            backgroundColor: ACCENT_COLOR,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Go to People
        </button>
      </div>
    );
  }

  const person = data.people.find(p => p.id === selectedPersonId);
  const personCommits = data.commits.filter(c => c.personId === selectedPersonId);
  const personAchievements = data.achievements
    .filter(a => a.personId === selectedPersonId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const personIndex = data.people.indexOf(person);
  const avatarColor = AVATAR_COLORS[personIndex % AVATAR_COLORS.length];
  const healthScore = computeHealthScore(selectedPersonId, data);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const isOverdue = !data.monthlyUpdates.some(
    u =>
      u.personId === selectedPersonId &&
      u.month === currentMonth &&
      u.year === currentYear
  );


  const handleSendReminder = () => {
    const newMessage = {
      id: 'msg' + Date.now(),
      fromRole: 'hr',
      fromName: 'HR',
      toPersonId: selectedPersonId,
      body: 'Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month.',
      date: new Date().toISOString(),
      read: false
    };

    onDataChange('messages', [...data.messages, newMessage]);
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 2000);
  };

  const handleCommentChange = (achievementId, value) => {
    setCommentDrafts({ ...commentDrafts, [achievementId]: value });
  };

  const handlePostComment = (achievementId) => {
    const body = commentDrafts[achievementId]?.trim();
    if (!body) return;

    const newComment = {
      id: 'hrc' + Date.now(),
      achievementId: achievementId,
      authorName: 'HR',
      body: body,
      date: new Date().toISOString()
    };

    onDataChange('hrComments', [...data.hrComments, newComment]);
    setCommentDrafts({ ...commentDrafts, [achievementId]: '' });
  };

  const getCommitLevelText = (level) => {
    const map = {
      self: 'Self',
      team: 'Team / dept',
      org: 'Organisation'
    };
    return map[level] || '';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            flexShrink: 0
          }}
        >
          {person.initials}
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '500' }}>
            {person.name}
          </h1>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: SECONDARY_TEXT }}>
            {person.department}
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                backgroundColor: '#f0f7ff',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                color: ACCENT_COLOR
              }}
            >
              Health: {healthScore}/100
            </div>

            {isOverdue && (
              <button
                onClick={handleSendReminder}
                style={{
                  padding: '6px 12px',
                  backgroundColor: RED_COLOR,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Send reminder
              </button>
            )}

            {reminderSent && (
              <span style={{ fontSize: '12px', color: GREEN_COLOR }}>
                Reminder sent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Commits Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>
          Commits
        </h2>

        {['self', 'team', 'org'].map(level => {
          const levelCommits = personCommits.filter(c => c.level === level);
          return (
            <div key={level} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: COMMIT_LEVEL_COLORS[level]
                  }}
                />
                {getCommitLevelText(level)}
              </div>

              {levelCommits.length > 0 ? (
                <ul style={{ margin: '0 0 0 16px', padding: 0, listStyle: 'none' }}>
                  {levelCommits.map(commit => (
                    <li
                      key={commit.id}
                      style={{
                        marginBottom: '6px',
                        fontSize: '13px',
                        color: '#333'
                      }}
                    >
                      • {commit.statement}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '13px', color: SECONDARY_TEXT, marginLeft: '16px' }}>
                  No commits added yet
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievements Section */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>
          Achievements
        </h2>

        {personAchievements.length > 0 ? (
          personAchievements.map((achievement, idx) => {
            const achievementComments = data.hrComments.filter(
              c => c.achievementId === achievement.id
            );

            return (
              <div
                key={achievement.id}
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                {/* Achievement Title */}
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
                  <span>{formatDate(achievement.date)}</span>

                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        COMMIT_LEVEL_COLORS[
                          data.commits.find(c => c.id === achievement.commitId)?.level
                        ]
                    }}
                  />

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                    <span>{achievement.cpqsdp.join(', ')}</span>
                  </div>

                  <span>
                    Impact: <span style={{ fontWeight: '700' }}>{achievement.impactRating}/10</span>
                  </span>
                </div>

                {/* Evidence */}
                <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '12px' }}>
                  {achievement.evidence}
                </div>

                {/* File attachment */}
                {achievement.fileAttachment && (
                  <div style={{ fontSize: '12px', color: SECONDARY_TEXT, marginBottom: '12px' }}>
                    📎 {achievement.fileAttachment}
                  </div>
                )}

                {/* Existing comments */}
                {achievementComments.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    {achievementComments.map(comment => (
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

                {/* Comment form */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Add a comment on this achievement..."
                    value={commentDrafts[achievement.id] || ''}
                    onChange={e => handleCommentChange(achievement.id, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid #ddd`,
                      borderRadius: '4px',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={() => handlePostComment(achievement.id)}
                    disabled={
                      !commentDrafts[achievement.id] ||
                      !commentDrafts[achievement.id].trim()
                    }
                    style={{
                      padding: '8px 16px',
                      backgroundColor:
                        !commentDrafts[achievement.id] ||
                        !commentDrafts[achievement.id].trim()
                          ? '#ccc'
                          : ACCENT_COLOR,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor:
                        !commentDrafts[achievement.id] ||
                        !commentDrafts[achievement.id].trim()
                          ? 'not-allowed'
                          : 'pointer',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ fontSize: '13px', color: SECONDARY_TEXT }}>
            No achievements logged yet
          </div>
        )}
      </div>
    </div>
  );
}

export default HrDrilldown;
