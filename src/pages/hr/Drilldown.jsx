import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';

const COMMIT_STYLES = {
  self: { bg: '#EEEDFE', text: '#3C3489' },
  team: { bg: '#E1F5EE', text: '#085041' },
  org: { bg: '#FAEEDA', text: '#633806' }
};

function Drilldown({ state, onDataChange }) {
  const [commentDrafts, setCommentDrafts] = useState({});

  if (!state.selectedPersonId) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Select a person from the People list to view details
        </Text>
      </View>
    );
  }

  const person = state.data.people.find(
    p => p.id === state.selectedPersonId
  );

  const personCommits = state.data.commits.filter(
    c => c.personId === state.selectedPersonId
  );

  const personAchievements = state.data.achievements
    .filter(a => a.personId === state.selectedPersonId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

  const handlePostComment = (achievementId) => {
    const body = commentDrafts[achievementId]?.trim();

    if (!body) return;

    const newComment = {
      id: 'hrc' + Date.now(),
      achievementId,
      authorName: 'HR',
      body,
      date: new Date().toISOString()
    };

    onDataChange('hrComments', [
      ...state.data.hrComments,
      newComment
    ]);

    setCommentDrafts({
      ...commentDrafts,
      [achievementId]: ''
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>{person.name}</Text>

      <Text style={styles.sectionTitle}>Commitments</Text>

      {['self', 'team', 'org'].map(level => {
        const commits = personCommits.filter(
          c => c.level === level
        );

        const style = COMMIT_STYLES[level];

        return (
          <View
            key={level}
            style={styles.commitCard}
          >
            <View
              style={[
                styles.commitHeader,
                { backgroundColor: style.bg }
              ]}
            >
              <Text
                style={[
                  styles.commitHeaderText,
                  { color: style.text }
                ]}
              >
                {level === 'self'
                  ? 'Self'
                  : level === 'team'
                  ? 'Team / Dept'
                  : 'Organisation'}
              </Text>
            </View>

            {commits.length ? (
              commits.map(commit => (
                <Text
                  key={commit.id}
                  style={styles.commitText}
                >
                  • {commit.statement}
                </Text>
              ))
            ) : (
              <Text style={styles.noneText}>None</Text>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>
        Achievements
      </Text>

      {personAchievements.length ? (
        personAchievements.map(achievement => {
          const comments =
            state.data.hrComments.filter(
              c => c.achievementId === achievement.id
            );

          return (
            <View
              key={achievement.id}
              style={styles.card}
            >
              <Text style={styles.title}>
                {achievement.title}
              </Text>

              <Text style={styles.meta}>
                {formatDate(achievement.date)} • Impact:{' '}
                {achievement.impactRating}/10
              </Text>

              <Text style={styles.evidence}>
                {achievement.evidence}
              </Text>

              {comments.map(comment => (
                <View
                  key={comment.id}
                  style={styles.commentBox}
                >
                  <Text style={styles.commentTitle}>
                    HR Comment
                  </Text>

                  <Text style={styles.commentBody}>
                    {comment.body}
                  </Text>

                  <Text style={styles.commentDate}>
                    {comment.authorName} •{' '}
                    {formatDate(comment.date)}
                  </Text>
                </View>
              ))}

              <View style={styles.commentRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Add a comment..."
                  value={
                    commentDrafts[achievement.id] || ''
                  }
                  onChangeText={(text) =>
                    setCommentDrafts({
                      ...commentDrafts,
                      [achievement.id]: text
                    })
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        commentDrafts[
                          achievement.id
                        ]?.trim()
                          ? '#000'
                          : '#CCC'
                    }
                  ]}
                  disabled={
                    !commentDrafts[
                      achievement.id
                    ]?.trim()
                  }
                  onPress={() =>
                    handlePostComment(
                      achievement.id
                    )
                  }
                >
                  <Text style={styles.buttonText}>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#fff',
    padding: 16
  },

  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10
  },

  commitCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },

  commitHeader: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  commitHeaderText: {
    textAlign: 'center',
    fontWeight: '600'
  },

  commitText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20
  },

  noneText: {
    color: '#999'
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8
  },

  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10
  },

  evidence: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12
  },

  commentBox: {
    backgroundColor: '#F7F7F7',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },

  commentTitle: {
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4
  },

  commentBody: {
    color: '#444',
    marginBottom: 6
  },

  commentDate: {
    fontSize: 12,
    color: '#888'
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 10
  },

  button: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center'
  },

  emptyText: {
    color: '#999',
    fontSize: 14
  }
});

export default Drilldown;