import React, { useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { Crown, Users } from 'lucide-react-native'
import type { AppData } from '../../data/seed'
import { formatDateShort } from '../../utils/formatDate'
import * as api from '../../services/api'

interface IndividualMessagesProps {
  data: AppData
  currentPersonId: string
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
}

export default function IndividualMessages({
  data,
  currentPersonId,
  onDataChange
}: IndividualMessagesProps) {
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessages = data.messages.filter(
        m => m.toPersonId === currentPersonId && !m.read
      )
      for (const message of unreadMessages) {
        try {
          await api.markMessageAsRead(message.id)
        } catch (err) {
          console.error(`Failed to mark message ${message.id} as read:`, err)
        }
      }
      const updated = data.messages.map(m =>
        m.toPersonId === currentPersonId ? { ...m, read: true } : m
      )
      onDataChange('messages', updated)
    }

    markMessagesAsRead()
  }, [])

  const myMessages = data.messages
    .filter(m => m.toPersonId === currentPersonId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Messages</Text>
      <Text style={styles.description}>From HR and CEO.</Text>

      {myMessages.length === 0 ? (
        <Text style={styles.emptyText}>No messages yet.</Text>
      ) : (
        <View style={styles.messageList}>
          {myMessages.map(message => (
            <View key={message.id} style={styles.messageCard}>
              {/* Header Row */}
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  {message.fromRole === 'ceo' ? (
                    <Crown size={14} color="#534AB7" />
                  ) : (
                    <Users size={14} color="#534AB7" />
                  )}
                  <Text style={styles.fromName}>{message.fromName}</Text>
                </View>
                <Text style={styles.date}>{formatDateShort(message.date)}</Text>
              </View>

              {/* Body */}
              <Text style={styles.body}>{message.body}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
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
    marginBottom: 24,
    marginTop: 2
  },
  emptyText: {
    fontSize: 13,
    color: '#AAA',
    textAlign: 'center',
    paddingVertical: 40
  },
  messageList: {
    gap: 10,
    paddingBottom: 40
  },
  messageCard: {
    backgroundColor: '#EEEDFE',
    borderWidth: 0.5,
    borderColor: '#AFA9EC',
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  fromName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#534AB7'
  },
  date: {
    fontSize: 11,
    color: '#AAA'
  },
  body: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 20
  }
})
