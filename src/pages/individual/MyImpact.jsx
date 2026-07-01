import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

const CPQSDP_COLORS = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
};

const CPQSDP_LABELS = {
  C: 'Cost',
  P: 'Productivity',
  Q: 'Quality',
  S: 'Safety',
  D: 'Delivery',
  O: 'People'
};

function MyImpact({ state }) {
  const userAchievements = state.data.achievements
    .filter(a => a.personId === state.currentUserId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const avgRating = userAchievements.length > 0
    ? (userAchievements.reduce((sum, a) => sum + a.impactRating, 0) / userAchievements.length).toFixed(1)
    : '—';

  const uniqueDims = new Set();
  userAchievements.forEach(a => a.cpqsdp.forEach(d => uniqueDims.add(d)));
  const dimsCovered = `${uniqueDims.size}/6`;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getCommitLevel = (commitId) => {
    return state.data.commits.find(c => c.id === commitId)?.level || null;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.title}>My Impact</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {[
          {
            label: 'Achievements logged',
            value: userAchievements.length,
          },
          {
            label: 'Avg impact rating',
            value: avgRating,
          },
          {
            label: 'Dimensions covered',
            value: dimsCovered,
          },
        ].map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Achievements</Text>

      {userAchievements.length > 0 ? (
        userAchievements.map((achievement) => {
          const hrComments = state.data.hrComments.filter(
            (c) => c.achievementId === achievement.id
          );

          return (
            <View key={achievement.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {achievement.title}
              </Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {formatDate(achievement.date)}
                </Text>

                <Text style={styles.metaText}>
                  Impact: {achievement.impactRating}/10
                </Text>
              </View>

              <View style={styles.dimensionRow}>
                {achievement.cpqsdp.map((dim) => (
                  <View
                    key={dim}
                    style={[
                      styles.dimensionBadge,
                      {
                        backgroundColor: CPQSDP_COLORS[dim],
                      },
                    ]}
                  >
                    <Text style={styles.dimensionText}>
                      {dim}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.evidence}>
                {achievement.evidence}
              </Text>

              {achievement.fileAttachment && (
                <Text style={styles.attachment}>
                  📎 {achievement.fileAttachment}
                </Text>
              )}

              {hrComments.length > 0 && (
                <View style={styles.commentSection}>
                  {hrComments.map((comment) => (
                    <View
                      key={comment.id}
                      style={styles.commentCard}
                    >
                      <Text style={styles.commentTitle}>
                        HR Comment
                      </Text>

                      <Text style={styles.commentBody}>
                        {comment.body}
                      </Text>

                      <Text style={styles.commentMeta}>
                        {comment.authorName} ·{' '}
                        {formatDate(comment.date)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No achievements logged yet
          </Text>
        </View>
      )}
    </ScrollView>

    
  );
  
}
const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
      },

      title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
      },

      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
      },

      statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 4,
      },

      statLabel: {
        color: '#666',
        fontSize: 12,
      },

      statValue: {
        marginTop: 8,
        fontSize: 24,
        fontWeight: '700',
      },

      sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
      },

      card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 16,
        marginBottom: 15,
      },

      cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
      },

      metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },

      metaText: {
        color: '#666',
        fontSize: 12,
      },

      dimensionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
      },

      dimensionBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
      },

      dimensionText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 11,
      },

      evidence: {
        color: '#555',
        lineHeight: 20,
        marginBottom: 10,
      },

      attachment: {
        color: '#777',
        marginBottom: 10,
      },

      commentSection: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
      },

      commentCard: {
        backgroundColor: '#F5F9FF',
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
      },

      commentTitle: {
        color: '#007AFF',
        fontWeight: '700',
        marginBottom: 5,
      },

      commentBody: {
        color: '#444',
      },

      commentMeta: {
        marginTop: 5,
        color: '#888',
        fontSize: 11,
      },

      emptyCard: {
        padding: 30,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
      },

      emptyText: {
        color: '#888',
      },
    });
export default MyImpact;
