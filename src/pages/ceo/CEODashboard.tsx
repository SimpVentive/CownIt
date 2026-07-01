import React from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import type { AppData } from '../../data/seed'
import { currentMonth, currentYear, formatDateShort } from '../../utils/formatDate'
import { CPQSDP_COLORS, CPQSDP_LABELS } from '../../utils/constants'

interface CEODashboardProps {
  data: AppData
}

export default function CEODashboard({ data }: CEODashboardProps) {
  const totalPeople = data.people.length
  const totalAchievements = data.achievements.length
  const avgImpact =
    totalAchievements > 0
      ? (
          data.achievements.reduce((s, a) => s + a.impactRating, 0) /
          totalAchievements
        ).toFixed(1)
      : '—'

  const uniqueDepts = new Set(data.people.map(p => p.department)).size

  const updatedCount = data.people.filter(p =>
    data.monthlyUpdates.some(
      u =>
        u.personId === p.id &&
        u.month === currentMonth() &&
        u.year === currentYear()
    )
  ).length
  const updatedPct = Math.round((updatedCount / totalPeople) * 100)

  const getValueColor = (pct: number): string => {
    if (pct >= 75) return '#3B6D11'
    if (pct >= 50) return '#185FA5'
    return '#993C1D'
  }

  const cpqsdpScores: Record<string, string> = {}
  const dims: Array<'C' | 'P' | 'Q' | 'S' | 'D' | 'O'> = [
    'C',
    'P',
    'Q',
    'S',
    'D',
    'O'
  ]
  dims.forEach(key => {
    const matching = data.achievements.filter(a => a.cpqsdp.includes(key))
    if (matching.length === 0) {
      cpqsdpScores[key] = '—'
    } else {
      cpqsdpScores[key] = (
        matching.reduce((s, a) => s + (a.impactRatings[key] || 0), 0) / matching.length
      ).toFixed(1)
    }
  })

  const recentAchievements = [...data.achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const getPersonName = (personId: string): string => {
    return data.people.find(p => p.id === personId)?.name || 'Unknown'
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.description}>Org-wide commitment health.</Text>

      {/* Stat Cards Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>People committed</Text>
          <Text style={styles.statValue}>{totalPeople}</Text>
          <Text style={styles.statSub}>
            across {uniqueDepts} departments
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total achievements</Text>
          <Text style={styles.statValue}>{totalAchievements}</Text>
          <Text style={styles.statSub}>since programme start</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg impact score</Text>
          <Text style={styles.statValue}>{avgImpact}</Text>
          <Text style={styles.statSub}>self-rated / 10</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Updated this month</Text>
          <Text
            style={[
              styles.statValue,
              { color: getValueColor(updatedPct) }
            ]}
          >
            {updatedPct}%
          </Text>
          <Text style={styles.statSub}>
            {updatedCount} of {totalPeople} people
          </Text>
        </View>
      </View>

      {/* CPQSDP Section */}
      <View style={styles.cpqsdpSection}>
        <Text style={styles.cpqsdpTitle}>CPQSDP impact</Text>
        <Text style={styles.cpqsdpSubtitle}>
          Cumulative average scores
        </Text>

        <View style={styles.dimensionsGrid}>
          {dims.map(dim => {
            const score = cpqsdpScores[dim]
            const numScore = score === '—' ? 0 : parseFloat(score)
            const progress = score === '—' ? 0 : (numScore / 10) * 100

            return (
              <View key={dim} style={styles.dimensionCard}>
                <Text style={styles.dimensionLabel}>
                  {CPQSDP_LABELS[dim]}
                </Text>
                <Text
                  style={[
                    styles.dimensionValue,
                    { color: CPQSDP_COLORS[dim] }
                  ]}
                >
                  {score}
                </Text>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${progress}%`,
                        backgroundColor:
                          CPQSDP_COLORS[dim] + 'CC'
                      }
                    ]}
                  />
                </View>
              </View>
            )
          })}
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>Recent achievements</Text>

        {recentAchievements.map(achievement => (
          <View key={achievement.id} style={styles.achievementRow}>
            <View style={styles.achievementHeader}>
              <Text style={styles.personNameBadge}>
                {getPersonName(achievement.personId)}
              </Text>
              <Text style={styles.achievementDate}>
                {formatDateShort(achievement.date)}
              </Text>
            </View>

            <Text style={styles.achievementTitle}>
              {achievement.title}
            </Text>

            <View style={styles.achievementMeta}>
              <Text style={styles.metaText}>
                {achievement.cpqsdp.join(', ')} · Avg impact:{' '}
                {achievement.cpqsdp.length > 0
                  ? (achievement.cpqsdp.reduce((sum, key) => sum + (achievement.impactRatings[key] || 0), 0) / achievement.cpqsdp.length).toFixed(1)
                  : 0}/10
              </Text>
            </View>
          </View>
        ))}
      </View>
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
    marginBottom: 20,
    marginTop: 2
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#FAFAFA',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4
  },
  statValue: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  statSub: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 3
  },
  cpqsdpSection: {
    marginBottom: 24
  },
  cpqsdpTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2
  },
  cpqsdpSubtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12
  },
  dimensionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  dimensionCard: {
    flex: 1,
    minWidth: '31%',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center'
  },
  dimensionLabel: {
    fontSize: 11,
    color: '#888'
  },
  dimensionValue: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 2
  },
  progressBg: {
    width: '100%',
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden'
  },
  progressBar: {
    height: 4,
    borderRadius: 4
  },
  recentSection: {
    marginBottom: 40
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10
  },
  achievementRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 10
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  personNameBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: '#534AB7'
  },
  achievementDate: {
    fontSize: 11,
    color: '#AAA'
  },
  achievementTitle: {
    fontSize: 13,
    color: '#1A1A1A',
    marginTop: 2
  },
  achievementMeta: {
    marginTop: 3
  },
  metaText: {
    fontSize: 12,
    color: '#666'
  }
})
