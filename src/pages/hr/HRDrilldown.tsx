import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
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
            const commit = data.commits.find(
              c => c.id === achievement.commitId
            )
            const comments = data.hrComments.filter(
              c => c.achievementId === achievement.id
            )

            return (
              <View
                key={achievement.id}
                style={styles.achievementCard}
              >
                <Text style={styles.achievementTitle}>
                  {achievement.title}
                </Text>

                {/* Meta */}
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {formatDateShort(achievement.date)}
                  </Text>
                  {commit && (
                    <Text style={styles.metaText}>
                      {LEVEL_COLORS[commit.level].label}
                    </Text>
                  )}
                  <Text style={styles.metaText}>
                    {achievement.cpqsdp.join(', ')}
                  </Text>
                  <Text style={styles.impactText}>
                    Impact: {achievement.cpqsdp.length > 0 ? (achievement.cpqsdp.reduce((sum, key) => sum + (achievement.impactRatings[key] || 0), 0) / achievement.cpqsdp.length).toFixed(1) : 0}/10
                  </Text>
                </View>

                {/* Evidence */}
                <Text style={styles.evidence}>{achievement.evidence}</Text>

                {/* Comments */}
                {comments.map(comment => (
                  <View key={comment.id} style={styles.commentBox}>
                    <Text style={styles.commentLabel}>HR comment</Text>
                    <Text style={styles.commentBody}>{comment.body}</Text>
                    <Text style={styles.commentMeta}>
                      {comment.authorName} · {formatDateShort(comment.date)}
                    </Text>
                  </View>
                ))}

                {/* Add Comment */}
                <View style={styles.commentInput}>
                  <TextInput
                    placeholder="Add a comment..."
                    value={commentDrafts[achievement.id] || ''}
                    onChangeText={text =>
                      setCommentDrafts({
                        ...commentDrafts,
                        [achievement.id]: text
                      })
                    }
                    style={styles.textInput}
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 3,
    alignItems: 'center'
  },
  metaText: {
    fontSize: 11,
    color: '#AAA'
  },
  impactText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  evidence: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    lineHeight: 18
  },
  commentBox: {
    backgroundColor: '#EEEDFE',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8
  },
  commentLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#534AB7'
  },
  commentBody: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
    lineHeight: 18
  },
  commentMeta: {
    fontSize: 11,
    color: '#888',
    marginTop: 3
  },
  commentInput: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'flex-end'
  },
  textInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 13
  },
  postButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6
  },
  postButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500'
  },
  postButtonDisabled: {
    opacity: 0.5
  }
})
