import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import type { AppData, Message } from '../../data/seed'
import { formatDateShort } from '../../utils/formatDate'
import * as api from '../../services/api'

interface CEOMessageProps {
  data: AppData
  selectedRecipientId: string | null
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
}

export default function CEOMessage({
  data,
  selectedRecipientId,
  onDataChange
}: CEOMessageProps) {
  const [recipientId, setRecipientId] = useState<string>(
    selectedRecipientId || data.people[0]?.id || ''
  )
  const [messageBody, setMessageBody] = useState('')
  const [justSent, setJustSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (selectedRecipientId) {
      setRecipientId(selectedRecipientId)
    }
  }, [selectedRecipientId])

  const handleSendMessage = async () => {
    if (messageBody.trim().length < 5) return

    setIsSending(true)
    try {
      const newMessage: Message = {
        id: 'msg' + Date.now(),
        fromRole: 'ceo',
        fromName: 'CEO',
        toPersonId: recipientId,
        body: messageBody.trim(),
        date: new Date().toISOString(),
        read: false
      }

      await api.createMessage(newMessage)
      onDataChange('messages', [...data.messages, newMessage])
      setMessageBody('')
      setJustSent(true)
      setTimeout(() => setJustSent(false), 2000)
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const sentMessages = data.messages
    .filter(m => m.fromRole === 'ceo')
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

  const getPersonName = (personId: string): string => {
    return data.people.find(p => p.id === personId)?.name || 'Unknown'
  }

  const getPersonDept = (personId: string): string => {
    return data.people.find(p => p.id === personId)?.department || ''
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Send message</Text>
      <Text style={styles.description}>
        Direct message to any individual.
      </Text>

      {/* Recipient Selector */}
      <View style={styles.section}>
        <Text style={styles.label}>To</Text>
        <View style={styles.recipientList}>
          {data.people.map(person => (
            <TouchableOpacity
              key={person.id}
              onPress={() => {
                setRecipientId(person.id)
                setJustSent(false)
              }}
              style={[
                styles.recipientCard,
                recipientId === person.id && styles.recipientCardSelected
              ]}
            >
              <View
                style={[
                  styles.recipientAvatar,
                  { backgroundColor: person.avatarColor }
                ]}
              >
                <Text
                  style={[
                    styles.recipientAvatarText,
                    { color: person.avatarTextColor }
                  ]}
                >
                  {person.initials}
                </Text>
              </View>
              <Text style={styles.recipientName}>
                {person.name} — {person.department}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Message Form */}
      <View style={styles.section}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          multiline
          placeholder="Your message to this individual..."
          value={messageBody}
          onChangeText={setMessageBody}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={messageBody.trim().length < 5 || isSending}
          style={[
            styles.sendButton,
            (messageBody.trim().length < 5 || isSending) && styles.sendButtonDisabled
          ]}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send message</Text>
          )}
        </TouchableOpacity>
        {justSent && (
          <Text style={styles.sentConfirm}>Message sent ✓</Text>
        )}
      </View>

      {/* Sent Messages Log */}
      <View style={styles.section}>
        <Text style={styles.label}>Sent messages</Text>
        {sentMessages.length === 0 ? (
          <Text style={styles.emptyText}>No messages sent yet.</Text>
        ) : (
          sentMessages.map(message => (
            <View key={message.id} style={styles.sentMessage}>
              <Text style={styles.sentTo}>
                To: {getPersonName(message.toPersonId)} —{' '}
                {getPersonDept(message.toPersonId)}
              </Text>
              <Text style={styles.sentBody}>{message.body}</Text>
              <Text style={styles.sentDate}>
                {formatDateShort(message.date)}
              </Text>
            </View>
          ))
        )}
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
  section: {
    marginBottom: 24
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 12
  },
  recipientList: {
    gap: 6
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  recipientCardSelected: {
    borderColor: '#534AB7',
    backgroundColor: '#EEEDFE'
  },
  recipientAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  recipientAvatarText: {
    fontSize: 11,
    fontWeight: '500'
  },
  recipientName: {
    fontSize: 13,
    color: '#1A1A1A'
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minHeight: 100,
    fontSize: 13,
    textAlignVertical: 'top'
  },
  sendButton: {
    backgroundColor: '#534AB7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500'
  },
  sendButtonDisabled: {
    opacity: 0.4
  },
  sentConfirm: {
    fontSize: 13,
    color: '#3B6D11',
    textAlign: 'center',
    marginTop: 8
  },
  emptyText: {
    fontSize: 13,
    color: '#AAA'
  },
  sentMessage: {
    backgroundColor: '#EEEDFE',
    borderWidth: 0.5,
    borderColor: '#AFA9EC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8
  },
  sentTo: {
    fontSize: 11,
    fontWeight: '500',
    color: '#534AB7',
    marginBottom: 4
  },
  sentBody: {
    fontSize: 13,
    color: '#1A1A1A'
  },
  sentDate: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 4
  }
})
