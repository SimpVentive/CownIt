import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Paperclip } from 'lucide-react-native'
import type { AppData, HRComment } from '../../data/seed'
import { computeHealthScore } from '../../utils/healthScore'
import { formatDateShort } from '../../utils/formatDate'
import { LEVEL_COLORS, CPQSDP_COLORS } from '../../utils/constants'
import * as api from '../../services/api'

interface HRDrilldownProps {
  data: AppData
  selectedPersonId: string | null
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
  onNavigate: (page: string) => void
}

export default function HRDrilldown({
  data,
  selectedPersonId,
  onDataChange,
  onNavigate
}: HRDrilldownProps) {
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [savingComments, setSavingComments] = useState<Record<string, boolean>>({})

  if (!selectedPersonId) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Select a person from the People screen.</Text>
        <TouchableOpacity
          onPress={() => onNavigate('hr-people')}
          style={styles.emptyButton}
        >
          <Text style={styles.emptyButtonText}>Go to People</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const person = data.people.find(p => p.id === selectedPersonId)
  const personCommits = data.commits.filter(c => c.personId === selectedPersonId)
  const personAchievements = data.achievements
    .filter(a => a.personId === selectedPersonId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (!person) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Person not found.</Text>
      </View>
    )
  }

  const handlePostComment = async (achievementId: string) => {
    const body = commentDrafts[achievementId]?.trim()
    if (!body) return

    setSavingComments({ ...savingComments, [achievementId]: true })
    try {
      const newComment: HRComment = {
        id: 'hrc' + Date.now(),
        achievementId,
        authorName: 'HR',
        body,
        date: new Date().toISOString()
      }
      await api.createHRComment(newComment)
      onDataChange('hrComments', [...data.hrComments, newComment])
      setCommentDrafts({ ...commentDrafts, [achievementId]: '' })
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setSavingComments({ ...savingComments, [achievementId]: false })
    }
  }

  const healthScore = computeHealthScore(selectedPersonId, data)

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View
          style={[styles.avatar, { backgroundColor: person.avatarColor }]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: person.avatarTextColor }
            ]}
          >
            {person.initials}
          </Text>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.personName}>{person.name}</Text>
          <Text style={styles.department}>{person.department}</Text>
        </View>

        <View style={styles.healthBadge}>
          <Text style={styles.healthBadgeText}>{healthScore}/100</Text>
        </View>
      </View>

      {/* Commits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Commits</Text>
        {['self', 'team', 'org'].map(level => {
          const levelCommits = personCommits.filter(c => c.level === level)
          const levelColor = LEVEL_COLORS[level]

          return (
            <View key={level}>
              <View style={styles.levelBadgeSmall}>
                <Text
                  style={[
                    styles.levelBadgeText,
                    { color: levelColor.text }
                  ]}
                >
                  {levelColor.label}
                </Text>
              </View>

              {levelCommits.length === 0 ? (
                <Text style={styles.emptyCommitText}>
                  No commits added yet.
                </Text>
              ) : (
                levelCommits.map(commit => (
                  <Text key={commit.id} style={styles.commitBullet}>
                    · {commit.statement}
                  </Text>
                ))
              )}
            </View>
          )
        })}
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Achievements</Text>

        {personAchievements.length === 0 ? (
          <Text style={styles.emptyText}>No achievements logged yet.</Text>
        ) : (
          personAchievements.map(achievement => {
            const commit = data.commits.find(c => c.id === achievement.commitId)
            const comments = data.hrComments.filter(c => c.achievementId === achievement.id)
            const getImpactLabel = (rating: number): string => {
              if (rating <= 3) return 'Minor impact'
              if (rating <= 6) return 'Moderate impact'
              if (rating <= 8) return 'Significant impact'
              return 'Transformational impact'
            }

            return (
              <View key={achievement.id} style={styles.achievementCard}>
                {/* ROW 1 — Title + Impact Badge */}
                <View style={styles.titleRow}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <View style={styles.impactBadge}>
                    <Text style={styles.impactBadgeText}>
                      {achievement.impactRating}/10
                    </Text>
                  </View>
                </View>

                {/* ROW 2 — Meta: Date, Level, CPQSDP */}
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {formatDateShort(achievement.date)}
                  </Text>
                  {commit && (
                    <View style={[
                      styles.levelPill,
                      { backgroundColor: LEVEL_COLORS[commit.level].bg }
                    ]}>
                      <Text style={[
                        styles.levelPillText,
                        { color: LEVEL_COLORS[commit.level].text }
                      ]}>
                        {LEVEL_COLORS[commit.level].label}
                      </Text>
                    </View>
                  )}
                  <View style={styles.cpqsdpDotsRow}>
                    {achievement.cpqsdp.map(tag => (
                      <View
                        key={tag}
                        style={[
                          styles.cpqsdpDot,
                          { backgroundColor: CPQSDP_COLORS[tag] }
                        ]}
                      />
                    ))}
                    <Text style={styles.cpqsdpLabels}>
                      {achievement.cpqsdp.join(', ')}
                    </Text>
                  </View>
                </View>

                {/* ROW 3 — Impact Guide Label */}
                <Text style={styles.impactGuideLabel}>
                  {getImpactLabel(achievement.impactRating)}
                </Text>

                {/* ROW 4 — Evidence */}
                <View style={styles.evidenceSection}>
                  <Text style={styles.evidenceLabel}>Evidence</Text>
                  <Text style={styles.evidenceText}>{achievement.evidence}</Text>
                </View>

                {/* ROW 5 — File Attachment */}
                {achievement.fileAttachment && (
                  <View style={styles.attachmentRow}>
                    <Paperclip size={13} color="#534AB7" />
                    <Text style={styles.attachmentText}>
                      {achievement.fileAttachment}
                    </Text>
                  </View>
                )}

                {/* DIVIDER */}
                <View style={styles.divider} />

                {/* EXISTING COMMENTS */}
                {comments.map(comment => (
                  <View key={comment.id} style={styles.commentBox}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentLabel}>HR comment</Text>
                      <Text style={styles.commentMeta}>
                        {comment.authorName} · {formatDateShort(comment.date)}
                      </Text>
                    </View>
                    <Text style={styles.commentBody}>{comment.body}</Text>
                  </View>
                ))}

                {/* ADD COMMENT ROW */}
                <View style={styles.commentInputRow}>
                  <TextInput
                    placeholder="Add a comment on this achievement..."
                    value={commentDrafts[achievement.id] || ''}
                    onChangeText={text =>
                      setCommentDrafts({
                        ...commentDrafts,
                        [achievement.id]: text
                      })
                    }
                    style={styles.commentTextInput}
                  />
                  <TouchableOpacity
                    onPress={() => handlePostComment(achievement.id)}
                    disabled={!commentDrafts[achievement.id]?.trim() || savingComments[achievement.id]}
                    style={[
                      styles.postButton,
                      (!commentDrafts[achievement.id]?.trim() || savingComments[achievement.id]) &&
                        styles.postButtonDisabled
                    ]}
                  >
                    {savingComments[achievement.id] ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.postButtonText}>Post</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 12
  },
  emptyButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500'
  },
  headerInfo: {
    flex: 1
  },
  personName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  department: {
    fontSize: 13,
    color: '#888'
  },
  healthBadge: {
    backgroundColor: '#EEEDFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexShrink: 0
  },
  healthBadgeText: {
    fontSize: 12,
    color: '#3C3489',
    fontWeight: '500'
  },
  section: {
    marginBottom: 24
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888',
    marginBottom: 12
  },
  levelBadgeSmall: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
    marginTop: 8
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '500'
  },
  emptyCommitText: {
    fontSize: 12,
    color: '#AAA',
    paddingLeft: 8,
    marginBottom: 8
  },
  commitBullet: {
    fontSize: 13,
    color: '#444',
    paddingLeft: 8,
    marginBottom: 4,
    lineHeight: 20
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1
  },
  impactBadge: {
    backgroundColor: '#EEEDFE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  impactBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3C3489'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    alignItems: 'center'
  },
  metaText: {
    fontSize: 11,
    color: '#AAA'
  },
  levelPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20
  },
  levelPillText: {
    fontSize: 11,
    fontWeight: '500'
  },
  cpqsdpDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  cpqsdpDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  cpqsdpLabels: {
    fontSize: 11,
    color: '#666'
  },
  impactGuideLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic'
  },
  evidenceSection: {
    marginTop: 8
  },
  evidenceLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    marginBottom: 3
  },
  evidenceText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6
  },
  attachmentText: {
    fontSize: 12,
    color: '#534AB7'
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginBottom: 0
  },
  commentBox: {
    borderLeftWidth: 2,
    borderLeftColor: '#534AB7',
    backgroundColor: '#EEEDFE',
    borderRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#534AB7'
  },
  commentBody: {
    fontSize: 13,
    color: '#444',
    marginTop: 3,
    lineHeight: 18
  },
  commentMeta: {
    fontSize: 11,
    color: '#888'
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'center'
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#FAFAFA'
  },
  postButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8
  },
  postButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500'
  },
  postButtonDisabled: {
    opacity: 0.4
  }
})
