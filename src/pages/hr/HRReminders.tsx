import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { AppData, Message } from '../../data/seed'
import { currentMonth, currentYear, currentMonthName, formatDateShort } from '../../utils/formatDate'

interface HRRemindersProps {
  data: AppData
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
}

export default function HRReminders({
  data,
  onDataChange
}: HRRemindersProps) {
  const [sentIds, setSentIds] = useState<string[]>([])

  const overduepeople = data.people.filter(person =>
    !data.monthlyUpdates.some(
      u =>
        u.personId === person.id &&
        u.month === currentMonth() &&
        u.year === currentYear()
    )
  )

  const sendReminder = (personId: string) => {
    const newMessage: Message = {
      id: 'msg' + Date.now(),
      fromRole: 'hr',
      fromName: 'HR',
      toPersonId: personId,
      body: `Your monthly commit update is overdue. Please log your progress and at least one achievement before end of ${currentMonthName()}.`,
      date: new Date().toISOString(),
      read: false
    }
    onDataChange('messages', [...data.messages, newMessage])
    setSentIds([...sentIds, personId])
  }

  const sendToAll = () => {
    const newMessages = overduepeople
      .filter(p => !sentIds.includes(p.id))
      .map(p => ({
        id: 'msg' + Date.now() + p.id,
        fromRole: 'hr' as const,
        fromName: 'HR',
        toPersonId: p.id,
        body: `Your monthly commit update is overdue. Please log your progress and at least one achievement before end of ${currentMonthName()}.`,
        date: new Date().toISOString(),
        read: false
      }))
    onDataChange('messages', [...data.messages, ...newMessages])
    setSentIds(overduepeople.map(p => p.id))
  }

  const getLastUpdate = (personId: string): string => {
    const updates = data.monthlyUpdates
      .filter(u => u.personId === personId)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    return updates.length > 0 ? formatDateShort(updates[0].updatedAt) : 'Never'
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Reminders</Text>
      <Text style={styles.description}>
        {overduepeople.length} people overdue for {currentMonthName()}
      </Text>

      {overduepeople.length === 0 ? (
        <Text style={styles.allUpToDate}>
          All individuals are up to date.
        </Text>
      ) : (
        <>
          {/* Overdue List */}
          <View style={styles.overdueList}>
            {overduepeople.map(person => (
              <View key={person.id} style={styles.overdueCard}>
                <View style={styles.cardRow}>
                  <View
                    style={[
                      styles.avatarSmall,
                      { backgroundColor: person.avatarColor }
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarTextSmall,
                        { color: person.avatarTextColor }
                      ]}
                    >
                      {person.initials}
                    </Text>
                  </View>

                  <View style={styles.personInfoSmall}>
                    <Text style={styles.personNameSmall}>
                      {person.name}
                    </Text>
                    <Text style={styles.personMetaSmall}>
                      {person.department} · Last updated:{' '}
                      {getLastUpdate(person.id)}
                    </Text>
                  </View>

                  {sentIds.includes(person.id) ? (
                    <Text style={styles.sentText}>Sent ✓</Text>
                  ) : (
                    <TouchableOpacity
                      onPress={() => sendReminder(person.id)}
                      style={styles.reminderButton}
                    >
                      <Text style={styles.reminderButtonText}>
                        Send reminder
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Bulk Send Card */}
          <View style={styles.bulkCard}>
            <Text style={styles.bulkTitle}>Send to all overdue</Text>
            <Text style={styles.bulkDescription}>
              Send a reminder to all {overduepeople.length} overdue
              individuals at once.
            </Text>
            <TouchableOpacity
              onPress={sendToAll}
              disabled={sentIds.length === overduepeople.length}
              style={[
                styles.sendAllButton,
                sentIds.length === overduepeople.length &&
                  styles.sendAllButtonDisabled
              ]}
            >
              <Text style={styles.sendAllButtonText}>Send to all</Text>
            </TouchableOpacity>
          </View>
        </>
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
    marginBottom: 20,
    marginTop: 2
  },
  allUpToDate: {
    fontSize: 13,
    color: '#3B6D11',
    textAlign: 'center',
    paddingVertical: 40
  },
  overdueList: {
    gap: 8,
    marginBottom: 16
  },
  overdueCard: {
    backgroundColor: '#FAEEDA',
    borderWidth: 0.5,
    borderColor: '#FAC775',
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 14
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  avatarTextSmall: {
    fontSize: 11,
    fontWeight: '500'
  },
  personInfoSmall: {
    flex: 1
  },
  personNameSmall: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  personMetaSmall: {
    fontSize: 11,
    color: '#888'
  },
  sentText: {
    fontSize: 12,
    color: '#3B6D11',
    fontWeight: '500',
    flexShrink: 0
  },
  reminderButton: {
    borderWidth: 0.5,
    borderColor: '#993C1D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexShrink: 0
  },
  reminderButtonText: {
    fontSize: 12,
    color: '#993C1D',
    fontWeight: '400'
  },
  bulkCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 40
  },
  bulkTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4
  },
  bulkDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    marginBottom: 12
  },
  sendAllButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },
  sendAllButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500'
  },
  sendAllButtonDisabled: {
    opacity: 0.5
  }
})
