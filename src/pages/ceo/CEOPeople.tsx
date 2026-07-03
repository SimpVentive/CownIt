import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { AppData } from '../../data/seed'
import { computeHealthScore } from '../../utils/healthScore'
import { formatDate, currentMonth, currentYear } from '../../utils/formatDate'

interface CEOPeopleProps {
  data: AppData
  onNavigate: (page: string) => void
  onSelectRecipient: (personId: string) => void
}

export default function CEOPeople({
  data,
  onNavigate,
  onSelectRecipient
}: CEOPeopleProps) {
  const getLastActive = (personId: string): string => {
    const dates = [
      ...data.monthlyUpdates
        .filter(u => u.personId === personId)
        .map(u => u.updatedAt),
      ...data.achievements
        .filter(a => a.personId === personId)
        .map(a => a.date)
    ]
    if (dates.length === 0) return 'No activity'
    return formatDate(
      dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
    )
  }

  const getHealthColor = (score: number): string => {
    if (score >= 75) return '#3B6D11'
    if (score >= 50) return '#185FA5'
    return '#993C1D'
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>People view</Text>
      <Text style={styles.description}>
        Commitment and achievement summary.
      </Text>

      <View style={styles.cardsList}>
        {data.people.map(person => {
          const commitCount = data.commits.filter(
            c => c.personId === person.id
          ).length
          const achievementCount = data.achievements.filter(
            a => a.personId === person.id
          ).length
          const healthScore = computeHealthScore(person.id, data)
          const hasUpdate = data.monthlyUpdates.some(
            u =>
              u.personId === person.id &&
              u.month === currentMonth() &&
              u.year === currentYear()
          )
          const lastActive = getLastActive(person.id)

          return (
            <View key={person.id} style={styles.card}>
              {/* Row 1: Avatar, Info, Status */}
              <View style={styles.row1}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: person.avatarColor }
                  ]}
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

                <View style={styles.info}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.department}>
                    {person.department}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: hasUpdate
                        ? '#E1F5EE'
                        : '#FAECE7'
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: hasUpdate ? '#085041' : '#993C1D'
                      }
                    ]}
                  >
                    {hasUpdate ? 'Current' : 'Overdue'}
                  </Text>
                </View>
              </View>

              {/* Row 2: Stats */}
              <View style={[styles.row2, { marginTop: 10 }]}>
                <Text style={styles.statText}>
                  {commitCount} commits
                </Text>
                <Text style={styles.statText}>
                  {achievementCount} achievements
                </Text>
                <Text
                  style={[
                    styles.statText,
                    { color: getHealthColor(healthScore) }
                  ]}
                >
                  Health: {healthScore}/100
                </Text>
                <Text style={styles.statText}>
                  Last active: {lastActive}
                </Text>
              </View>

              {/* Row 3: Message Button */}
              <View style={[styles.row3, { marginTop: 10 }]}>
                <TouchableOpacity
                  onPress={() => {
                    onSelectRecipient(person.id)
                    onNavigate('ceo-message')
                  }}
                  style={styles.messageButton}
                >
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
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
  cardsList: {
    gap: 12,
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '500'
  },
  info: {
    flex: 1
  },
  personName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  department: {
    fontSize: 12,
    color: '#888'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    flexShrink: 0
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500'
  },
  row2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  statText: {
    fontSize: 12,
    color: '#666'
  },
  row3: {
    justifyContent: 'flex-end'
  },
  messageButton: {
    borderWidth: 0.5,
    borderColor: '#534AB7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6
  },
  messageButtonText: {
    fontSize: 12,
    color: '#534AB7',
    fontWeight: '400'
  }
})
