import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { LayoutDashboard } from 'lucide-react-native'
import type { AppData } from '../../data/seed'
import { computeHealthScore } from '../../utils/healthScore'
import { formatDateShort, currentMonth, currentYear, currentMonthName, isCurrentMonth } from '../../utils/formatDate'
import { CPQSDP_COLORS, CPQSDP_LABELS } from '../../utils/constants'

interface HRDashboardProps {
  data: AppData
  onNavigate: (page: string) => void
  onSelectPerson: (personId: string) => void
}

export default function HRDashboard({
  data,
  onNavigate,
  onSelectPerson
}: HRDashboardProps) {
  const currentM = currentMonth()
  const currentY = currentYear()

  const enrichedPeople = data.people.map(p => ({
    ...p,
    healthScore: computeHealthScore(p.id, data),
    hasUpdate: data.monthlyUpdates.some(u =>
      u.personId === p.id &&
      u.month === currentM &&
      u.year === currentY
    ),
    achievementCount: data.achievements.filter(a => a.personId === p.id).length,
    thisMonthAchievements: data.achievements.filter(
      a => a.personId === p.id && isCurrentMonth(a.date)
    ).length
  }))

  const totalPeople = data.people.length
  const updatedCount = enrichedPeople.filter(p => p.hasUpdate).length
  const overdueCount = enrichedPeople.filter(p => !p.hasUpdate).length
  const avgHealth = totalPeople > 0
    ? Math.round(enrichedPeople.reduce((s, p) => s + p.healthScore, 0) / totalPeople)
    : 0
  const totalAchievementsThisMonth = data.achievements.filter(a => isCurrentMonth(a.date)).length

  const deptSummary = Array.from(
    new Set(enrichedPeople.map(p => p.department))
  ).map(dept => {
    const deptPeople = enrichedPeople.filter(p => p.department === dept)
    return {
      dept,
      count: deptPeople.length,
      updated: deptPeople.filter(p => p.hasUpdate).length,
      avgHealth: Math.round(
        deptPeople.reduce((s, p) => s + p.healthScore, 0) / deptPeople.length
      )
    }
  }).sort((a, b) => a.avgHealth - b.avgHealth)

  const getHealthColor = (score: number): string => {
    if (score >= 75) return '#3B6D11'
    if (score >= 50) return '#185FA5'
    return '#993C1D'
  }

  const attentionPeople = enrichedPeople
    .filter(p => p.healthScore < 50)
    .sort((a, b) => a.healthScore - b.healthScore)

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>HR Dashboard</Text>
      <Text style={styles.description}>{currentMonthName()} overview</Text>

      {/* Stat Cards Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total people</Text>
          <Text style={styles.statValue}>{totalPeople}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Updated this month</Text>
          <Text style={[styles.statValue, { color: '#3B6D11' }]}>{updatedCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Overdue</Text>
          <Text
            style={[
              styles.statValue,
              { color: overdueCount > 0 ? '#993C1D' : '#3B6D11' }
            ]}
          >
            {overdueCount}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg health score</Text>
          <Text style={[styles.statValue, { color: getHealthColor(avgHealth) }]}>
            {avgHealth}/100
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          onPress={() => onNavigate('hr-people')}
          style={styles.actionButtonSecondary}
        >
          <Text style={styles.actionButtonSecondaryText}>View all people</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigate('hr-reminders')}
          style={styles.actionButtonPrimary}
        >
          <Text style={styles.actionButtonPrimaryText}>Send reminders</Text>
        </TouchableOpacity>
      </View>

      {/* Department Health */}
      <Text style={styles.sectionHeading}>Department health</Text>
      {deptSummary.map(dept => (
        <View key={dept.dept} style={styles.deptCard}>
          <View style={styles.deptRow1}>
            <Text style={styles.deptName}>{dept.dept}</Text>
            <Text style={[
              styles.deptUpdated,
              { color: dept.updated === dept.count ? '#3B6D11' : '#993C1D' }
            ]}>
              {dept.updated}/{dept.count} updated
            </Text>
          </View>

          <View style={styles.deptRow2}>
            <Text style={styles.progressLabel}>Avg health</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(dept.avgHealth / 100) * 100}%`,
                    backgroundColor: getHealthColor(dept.avgHealth)
                  }
                ]}
              />
            </View>
            <Text style={styles.progressValue}>{dept.avgHealth}/100</Text>
          </View>
        </View>
      ))}

      {/* CPQSDP Participation */}
      <Text style={styles.sectionHeading}>CPQSDP participation</Text>
      <Text style={styles.participationDescription}>
        How many people have logged achievements in each dimension
      </Text>

      {(['C', 'P', 'Q', 'S', 'D', 'O'] as const).map(dim => {
        const count = data.people.filter(p =>
          data.achievements.some(a =>
            a.personId === p.id && a.cpqsdp.includes(dim)
          )
        ).length

        return (
          <View key={dim} style={styles.cpqsdpCard}>
            <View style={styles.cpqsdpRow}>
              <View
                style={[
                  styles.cpqsdpDot,
                  { backgroundColor: CPQSDP_COLORS[dim] }
                ]}
              />
              <Text style={styles.cpqsdpLabel}>{CPQSDP_LABELS[dim]}</Text>
              <Text style={styles.cpqsdpCount}>
                {count} of {totalPeople} people
              </Text>
              <View
                style={[
                  styles.cpqsdpProgressBar,
                  {
                    width: `${(count / totalPeople) * 100}%`,
                    backgroundColor: CPQSDP_COLORS[dim]
                  }
                ]}
              />
            </View>
          </View>
        )
      })}

      {/* Needs Attention */}
      <Text style={styles.sectionHeading}>Needs attention</Text>
      <Text style={styles.attentionDescription}>
        People with health score below 50
      </Text>

      {attentionPeople.length === 0 ? (
        <Text style={styles.successText}>Everyone is on track.</Text>
      ) : (
        attentionPeople.map(person => (
          <View key={person.id} style={styles.attentionCard}>
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

            <View style={styles.attentionInfo}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={styles.departmentText}>{person.department}</Text>
            </View>

            <Text style={styles.healthScoreLow}>
              {person.healthScore}/100
            </Text>

            <TouchableOpacity
              onPress={() => {
                onSelectPerson(person.id)
                onNavigate('hr-drilldown')
              }}
              style={styles.viewButton}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
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
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FAFAFA',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6
  },
  statValue: {
    fontSize: 24,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  actionButtonSecondary: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#534AB7',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  actionButtonSecondaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#534AB7'
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: '#534AB7',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  actionButtonPrimaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff'
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12
  },
  deptCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8
  },
  deptRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  deptName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  deptUpdated: {
    fontSize: 12
  },
  deptRow2: {
    marginTop: 8
  },
  progressLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: 6,
    borderRadius: 4
  },
  progressValue: {
    fontSize: 11,
    color: '#888',
    marginTop: 3
  },
  participationDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10
  },
  cpqsdpCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6
  },
  cpqsdpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  cpqsdpDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  cpqsdpLabel: {
    fontSize: 13,
    color: '#444',
    flex: 1
  },
  cpqsdpCount: {
    fontSize: 12,
    color: '#666',
    marginRight: 8
  },
  cpqsdpProgressBar: {
    height: 4,
    borderRadius: 4,
    width: 60
  },
  attentionDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10
  },
  successText: {
    fontSize: 13,
    color: '#3B6D11'
  },
  attentionCard: {
    backgroundColor: '#FAECE7',
    borderWidth: 0.5,
    borderColor: '#F5C4B3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '500'
  },
  attentionInfo: {
    flex: 1
  },
  personName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  departmentText: {
    fontSize: 11,
    color: '#888'
  },
  healthScoreLow: {
    fontSize: 13,
    fontWeight: '500',
    color: '#993C1D'
  },
  viewButton: {
    borderWidth: 0.5,
    borderColor: '#993C1D',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 12
  },
  viewButtonText: {
    fontSize: 12,
    color: '#993C1D'
  }
})
