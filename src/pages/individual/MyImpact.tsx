import React from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import type { AppData } from '../../data/seed'
import { formatDateShort } from '../../utils/formatDate'
import { CPQSDP_COLORS, LEVEL_COLORS } from '../../utils/constants'

interface MyImpactProps {
  data: AppData
  currentPersonId: string
}

export default function MyImpact({ data, currentPersonId }: MyImpactProps) {
  const myAchievements = data.achievements
    .filter(a => a.personId === currentPersonId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const avgRating =
    myAchievements.length > 0
      ? (myAchievements.reduce((s, a) => s + a.impactRating, 0) / myAchievements.length).toFixed(1)
      : '—'

  const allDimensions = Array.from(
    new Set(myAchievements.flatMap(a => a.cpqsdp))
  )
  const dimensionsCovered = `${allDimensions.length}/6`

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My impact</Text>
      <Text style={styles.description}>Your achievement log.</Text>

      {/* Stat Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Achievements</Text>
          <Text style={styles.statValue}>{myAchievements.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg rating</Text>
          <Text style={styles.statValue}>{avgRating}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Dimensions</Text>
          <Text style={styles.statValue}>{dimensionsCovered}</Text>
        </View>
      </ScrollView>

      {/* Achievement Log */}
      {myAchievements.length === 0 ? (
        <Text style={styles.emptyText}>No achievements logged yet.</Text>
      ) : (
        <View style={styles.log}>
          {myAchievements.map((achievement, idx) => {
            const commit = data.commits.find(c => c.id === achievement.commitId)
            const dotColor = commit
              ? commit.level === 'self'
                ? '#534AB7'
                : commit.level === 'team'
                  ? '#0F6E56'
                  : '#854F0B'
              : '#CCC'
            const levelLabel = commit ? LEVEL_COLORS[commit.level].label : 'Unknown'
            const comments = data.hrComments.filter(
              c => c.achievementId === achievement.id
            )

            return (
              <View
                key={achievement.id}
                style={[
                  styles.achievementRow,
                  idx === myAchievements.length - 1 && styles.achievementRowLast
                ]}
              >
                {/* Dot */}
                <View style={[styles.dot, { backgroundColor: dotColor }]} />

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.title}>{achievement.title}</Text>

                  {/* Meta Row */}
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      {formatDateShort(achievement.date)}
                    </Text>
                    <Text style={styles.metaText}>{levelLabel}</Text>
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
                    </View>
                    <Text style={styles.metaText}>
                      {achievement.cpqsdp.join(', ')}
                    </Text>
                    <Text style={styles.impactText}>
                      Impact: {achievement.impactRating}/10
                    </Text>
                  </View>

                  {/* Evidence */}
                  <Text style={styles.evidence}>{achievement.evidence}</Text>

                  {/* File Attachment */}
                  {achievement.fileAttachment && (
                    <Text style={styles.fileText}>
                      📎 {achievement.fileAttachment}
                    </Text>
                  )}

                  {/* HR Comments */}
                  {comments.map(comment => (
                    <View key={comment.id} style={styles.hrCommentBox}>
                      <Text style={styles.hrCommentLabel}>HR comment</Text>
                      <Text style={styles.hrCommentBody}>{comment.body}</Text>
                      <Text style={styles.hrCommentMeta}>
                        {comment.authorName} · {formatDateShort(comment.date)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )
          })}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 16,
    marginTop: 2
  },
  statsScroll: {
    marginBottom: 24
  },
  statsContainer: {
    gap: 12,
    paddingRight: 16
  },
  statCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 100,
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6
  },
  statValue: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  emptyText: {
    fontSize: 13,
    color: '#AAA',
    textAlign: 'center',
    paddingVertical: 40
  },
  log: {
    paddingBottom: 40
  },
  achievementRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0'
  },
  achievementRowLast: {
    borderBottomWidth: 0
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 3,
    alignItems: 'center'
  },
  metaText: {
    fontSize: 11,
    color: '#AAA'
  },
  cpqsdpDotsRow: {
    flexDirection: 'row',
    gap: 3
  },
  cpqsdpDot: {
    width: 4,
    height: 4,
    borderRadius: 2
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
  fileText: {
    fontSize: 11,
    color: '#534AB7',
    marginTop: 3
  },
  hrCommentBox: {
    backgroundColor: '#EEEDFE',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8
  },
  hrCommentLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#534AB7'
  },
  hrCommentBody: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
    lineHeight: 18
  },
  hrCommentMeta: {
    fontSize: 11,
    color: '#888',
    marginTop: 3
  }
})
