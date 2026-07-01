import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

const COMMIT_STYLES = {
  self: { bg: "#EEEDFE", text: "#3C3489" },
  team: { bg: "#E1F5EE", text: "#085041" },
  org: { bg: "#FAEEDA", text: "#633806" },
};

const COMMIT_LABELS = {
  self: "Self",
  team: "Team / Dept",
  org: "Organisation",
};

export default function MyCommits({ state }) {
  const userCommits = state.data.commits.filter(
    (c) => c.personId === state.currentUserId
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My Commitments</Text>

      {Object.entries(COMMIT_LABELS).map(([key, label]) => {
        const levelCommits = userCommits.filter(
          (c) => c.level === key
        );

        const colors = COMMIT_STYLES[key];

        return (
          <View key={key} style={styles.section}>
            <View
              style={[
                styles.levelHeader,
                { backgroundColor: colors.bg },
              ]}
            >
              <Text
                style={[
                  styles.levelHeaderText,
                  { color: colors.text },
                ]}
              >
                {label}
              </Text>
            </View>

            <View style={styles.card}>
              {levelCommits.length > 0 ? (
                levelCommits.map((commit) => (
                  <View
                    key={commit.id}
                    style={styles.commitCard}
                  >
                    <Text style={styles.commitText}>
                      {commit.statement}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  No commitments yet
                </Text>
              )}
            </View>
          </View>
        );
      })}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>
          About commitments:
        </Text>

        <Text style={styles.infoText}>
          You can set up to 3 commitments per level.
          Log achievements against any commitment at
          any time. There is no deadline —
          commitments are open-ended and accumulate
          over time.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
  },

  levelHeader: {
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },

  levelHeaderText: {
    fontWeight: "bold",
    fontSize: 15,
  },

  card: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    backgroundColor: "#fff",
  },

  commitCard: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  commitText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 14,
  },

  infoBox: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 30,
  },

  infoTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 15,
  },

  infoText: {
    color: "#666",
    lineHeight: 22,
    fontSize: 14,
  },
});