import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';

function Messages({ state }) {
  const userMessages = state.data.messages
    .filter(m => m.toPersonId === state.currentUserId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Messages</Text>

      {userMessages.length > 0 ? (
        userMessages.map((message) => (
          <View
            key={message.id}
            style={styles.card}
          >
            <Text style={styles.sender}>
              From: {message.fromName} ({message.fromRole.toUpperCase()})
            </Text>

            <Text style={styles.message}>
              {message.body}
            </Text>

            <Text style={styles.date}>
              {formatDate(message.date)}
              {message.read ? ' • Read' : ''}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No messages yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000',
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  sender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },

  message: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },

  date: {
    fontSize: 12,
    color: '#999',
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default Messages;