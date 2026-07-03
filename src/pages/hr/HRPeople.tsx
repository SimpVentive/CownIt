import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import type { AppData, Message } from '../../data/seed'
import { computeHealthScore } from '../../utils/healthScore'
import { formatDateShort, currentMonth, currentYear } from '../../utils/formatDate'
import * as api from '../../services/api'

interface HRPeopleProps {
  data: AppData
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
  onNavigate: (page: string) => void
  onSelectPerson: (personId: string) => void
}

export default function HRPeople({
  data,
  onDataChange,
  onNavigate,
  onSelectPerson
}: HRPeopleProps) {
  const [reminderSent, setReminderSent] = useState<string[]>([])
  const [sendingReminders, setSendingReminders] = useState<Record<string, boolean>>({})

  const enrichedPeople = data.people.map(person => ({
    ...person,
    healthScore: computeHealthScore(person.id, data),
    hasUpdate: data.monthlyUpdates.some(
      u =>
        u.personId === person.id &&
        u.month === currentMonth() &&
        u.year === currentYear()
    ),
    lastUpdate: (() => {
      const updates = data.monthlyUpdates
        .filter(u => u.personId === person.id)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      return updates.length > 0 ? formatDateShort(updates[0].updatedAt) : 'Never'
    })(),
    achievementCount: data.achievements.filter(
      a => a.personId === person.id
    ).length
  }))

  const updatedCount = enrichedPeople.filter(p => p.hasUpdate).length
  const overdueCount = enrichedPeople.filter(p => !p.hasUpdate).length
  const avgHealth = Math.round(
    enrichedPeople.reduce((s, p) => s + p.healthScore, 0) /
      enrichedPeople.length
  )

  const handleSendReminder = async (personId: string) => {
    setSendingReminders({ ...sendingReminders, [personId]: true })
    try {
      const newMessage: Message = {
        id: 'msg' + Date.now(),
        fromRole: 'hr',
        fromName: 'HR',
        toPersonId: personId,
        body: 'Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month.',
        date: new Date().toISOString(),
        read: false
      }
      await api.createMessage(newMessage)
      onDataChange('messages', [...data.messages, newMessage])
      setReminderSent([...reminderSent, personId])
    } catch (err) {
      console.error('Failed to send reminder:', err)
    } finally {
      setSendingReminders({ ...sendingReminders, [personId]: false })
    }
  }

  const getHealthBarColor = (score: number): string => {
    if (score >= 75) return '#3B6D11'
    if (score >= 50) return '#185FA5'
    return '#993C1D'
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>People</Text>
      <Text style={styles.description}>
        Commitment health across your organisation.
      </Text>

      {/* Stat Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{data.people.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Updated</Text>
          <Text style={[styles.statValue, { color: '#3B6D11' }]}>
            {updatedCount}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Overdue</Text>
          <Text style={[styles.statValue, { color: '#993C1D' }]}>
            {overdueCount}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg health</Text>
          <Text style={styles.statValue}>{avgHealth}</Text>
        </View>
      </ScrollView>

      {/* People List */}
      <View style={styles.peopleList}>
        {enrichedPeople.map(person => (
          <View key={person.id} style={styles.personCard}>
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
                <Text style={styles.department}>{person.department}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: person.hasUpdate
                      ? '#E1F5EE'
                      : '#FAECE7'
                  }
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: person.hasUpdate ? '#085041' : '#993C1D'
                    }
                  ]}
                >
                  {person.hasUpdate ? 'Current' : 'Overdue'}
                </Text>
              </View>
            </View>

            {/* Row 2: Health, Last update, Achievements */}
            <View style={[styles.row2, { marginTop: 10 }]}>
              <View style={styles.healthScore}>
                <Text style={styles.healthText}>
                  {person.healthScore}/100
                </Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: (person.healthScore / 100) * 80,
                        backgroundColor: getHealthBarColor(
                          person.healthScore
                        )
                      }
                    ]}
                  />
                </View>
              </View>

              <Text style={styles.metaText}>
                Last update: {person.lastUpdate}
              </Text>

              <Text style={styles.metaText}>
                {person.achievementCount} achievements
              </Text>
            </View>

            {/* Row 3: Buttons */}
            <View style={[styles.row3, { marginTop: 10 }]}>
              <TouchableOpacity
                onPress={() => {
                  onSelectPerson(person.id)
                  onNavigate('hr-drilldown')
                }}
                style={styles.viewButton}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>

              {!person.hasUpdate && !reminderSent.includes(person.id) ? (
                <TouchableOpacity
                  onPress={() => handleSendReminder(person.id)}
                  disabled={sendingReminders[person.id]}
                  style={[styles.reminderButton, sendingReminders[person.id] && styles.reminderButtonDisabled]}
                >
                  {sendingReminders[person.id] ? (
                    <ActivityIndicator size="small" color="#993C1D" />
                  ) : (
                    <Text style={styles.reminderButtonText}>Send reminder</Text>
                  )}
                </TouchableOpacity>
              ) : reminderSent.includes(person.id) ? (
                <Text style={styles.reminderSentText}>Reminder sent ✓</Text>
              ) : null}
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
    marginBottom: 16,
    marginTop: 2
  },
  statsScroll: {
    marginBottom: 24
  },
  statsContainer: {
    gap: 10,
    paddingRight: 16
  },
  statCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 90,
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
  peopleList: {
    gap: 10,
    paddingBottom: 40
  },
  personCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 14,
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
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  healthScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  healthText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  progressBarBg: {
    width: 80,
    height: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBar: {
    height: 5,
    borderRadius: 4
  },
  metaText: {
    fontSize: 12,
    color: '#888'
  },
  row3: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end'
  },
  viewButton: {
    borderWidth: 0.5,
    borderColor: '#534AB7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6
  },
  viewButtonText: {
    fontSize: 12,
    color: '#534AB7',
    fontWeight: '400'
  },
  reminderButton: {
    borderWidth: 0.5,
    borderColor: '#993C1D',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reminderButtonDisabled: {
    opacity: 0.5
  },
  reminderButtonText: {
    fontSize: 12,
    color: '#993C1D',
    fontWeight: '400'
  },
  reminderSentText: {
    fontSize: 12,
    color: '#3B6D11',
    fontWeight: '500'
  }
})
