import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Message({ state, onDataChange }) {
  const [recipientId, setRecipientId] = useState(
    state.data.people[0]?.id || ''
  );
  const [messageBody, setMessageBody] = useState('');
  const [sent, setSent] = useState(false);

  const formatDate = iso =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  const getPersonName = id =>
    state.data.people.find(p => p.id === id)?.name || 'Unknown';

  const getPersonDept = id =>
    state.data.people.find(p => p.id === id)?.department || '';

  const handleSend = () => {
    if (messageBody.trim().length < 5) return;

    const newMessage = {
      id: 'msg' + Date.now(),
      fromRole: 'ceo',
      fromName: 'CEO',
      toPersonId: recipientId,
      body: messageBody.trim(),
      date: new Date().toISOString(),
      read: false,
    };

    onDataChange('messages', [...state.data.messages, newMessage]);

    setMessageBody('');
    setSent(true);

    setTimeout(() => setSent(false), 2000);
  };

  const ceoMessages = state.data.messages
    .filter(m => m.fromRole === 'ceo')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Send Message</Text>

      <View style={styles.card}>
        <Text style={styles.label}>To</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={recipientId}
            onValueChange={setRecipientId}
          >
            {state.data.people.map(person => (
              <Picker.Item
                key={person.id}
                label={`${person.name} - ${person.department}`}
                value={person.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>
          Message
        </Text>

        <TextInput
          style={styles.input}
          multiline
          numberOfLines={5}
          value={messageBody}
          placeholder="Your message..."
          onChangeText={setMessageBody}
          textAlignVertical="top"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  messageBody.trim().length < 5 ? '#ccc' : '#000',
              },
            ]}
            disabled={messageBody.trim().length < 5}
            onPress={handleSend}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>

          {sent && (
            <Text style={styles.success}>
              ✓ Message Sent
            </Text>
          )}
        </View>
      </View>

      {ceoMessages.length > 0 && (
        <>
          <Text style={styles.subtitle}>Sent Messages</Text>

          {ceoMessages.map(message => (
            <View key={message.id} style={styles.messageCard}>
              <Text style={styles.recipient}>
                To: {getPersonName(message.toPersonId)} -{' '}
                {getPersonDept(message.toPersonId)}
              </Text>

              <Text style={styles.body}>
                {message.body}
              </Text>

              <Text style={styles.date}>
                {formatDate(message.date)}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 25,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
  },

  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 15,
    marginTop: 8,
  },

  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  button: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  success: {
    marginLeft: 15,
    color: '#28a745',
    fontWeight: '600',
  },

  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 12,
  },

  recipient: {
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },

  body: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },

  date: {
    color: '#888',
    fontSize: 12,
  },
});