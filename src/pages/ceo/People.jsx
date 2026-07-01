import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView
} from 'react-native';

function computeHealthScore(personId, data) {
  let score = 0;
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const personCommits = data.commits.filter(
    c => c.personId === personId
  );

  const filledLevels = new Set(personCommits.map(c => c.level));
  score += (filledLevels.size / 3) * 40;

  const hasUpdate = data.monthlyUpdates.some(
    u =>
      u.personId === personId &&
      u.month === currentMonth &&
      u.year === currentYear
  );

  if (hasUpdate) score += 40;

  const hasAchievement = data.achievements.some(
    a =>
      a.personId === personId &&
      new Date(a.date).getMonth() + 1 === currentMonth &&
      new Date(a.date).getFullYear() === currentYear
  );

  if (hasAchievement) score += 20;

  return Math.round(score);
}

export default function People({ state }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const formatDate = isoString => {
    if (!isoString) return 'No activity';

    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getLastActive = personId => {
    const updates = state.data.monthlyUpdates
      .filter(u => u.personId === personId)
      .map(u => new Date(u.updatedAt).getTime());

    const achievements = state.data.achievements
      .filter(a => a.personId === personId)
      .map(a => new Date(a.date).getTime());

    const dates = [...updates, ...achievements];

    if (dates.length === 0) return 'No activity';

    return formatDate(
      new Date(Math.max(...dates)).toISOString()
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>People View</Text>

      {state.data.people.map(person => {
        const commitCount = state.data.commits.filter(
          c => c.personId === person.id
        ).length;

        const achievementCount = state.data.achievements.filter(
          a => a.personId === person.id
        ).length;

        const healthScore = computeHealthScore(
          person.id,
          state.data
        );

        const isUpdated = state.data.monthlyUpdates.some(
          u =>
            u.personId === person.id &&
            u.month === currentMonth &&
            u.year === currentYear
        );

        return (
          <View key={person.id} style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.name}>
                  {person.name}
                </Text>

                <Text style={styles.department}>
                  {person.department}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isUpdated
                      ? '#d4edda'
                      : '#f8d7da',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isUpdated
                        ? '#28a745'
                        : '#dc3545',
                    },
                  ]}
                >
                  {isUpdated ? 'Current' : 'Overdue'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.info}>
              Commits: {commitCount}
            </Text>

            <Text style={styles.info}>
              Achievements: {achievementCount}
            </Text>

            <Text style={styles.info}>
              Health Score: {healthScore}/100
            </Text>

            <Text style={styles.info}>
              Last Active: {getLastActive(person.id)}
            </Text>
          </View>
        );
      })}
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

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
  },

  department: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  divider: {
    marginVertical: 14,
    height: 1,
    backgroundColor: '#e5e5e5',
  },

  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
});