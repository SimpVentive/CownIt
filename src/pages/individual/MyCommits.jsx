import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";
import { createCommit } from "../../services/api";

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
  const [statement, setStatement] = useState("");
  const [level, setLevel] = useState("self");
  const [saving, setSaving] = useState(false);

  const userCommits = state.data.commits.filter(
    (c) => c.personId === state.currentUserId
  );

  const addCommit = async () => {
    if (!statement.trim()) {
      Alert.alert("Validation", "Please enter a commitment.");
      return;
    }

    const levelCount = userCommits.filter(
      (c) => c.level === level
    ).length;

    if (levelCount >= 3) {
      console.error("Maximum 3 commitments are allowed for this level.");
      Alert.alert(
        "Limit Reached",
        "Maximum 3 commitments are allowed for this level."
      );
      return;
    }

    const commit = {
      id: uuid.v4().toString(),
      personId: state.currentUserId,
      level,
      statement,
      createdAt: new Date().toISOString(),
    };

    try {
      setSaving(true);
      const result = await createCommit(commit);
      /*const response = await fetch(
        "https://cownit.l-kurve.com/api/commits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Uncomment if using JWT
            // Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify(commit),
        }
      );*/

      //const result = await response.json();

      // Update local list
      state.data.commits.push(commit);

      setStatement("");

      Alert.alert("Success", "Commitment added successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My Commitments</Text>

      <View style={styles.addBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter your commitment..."
          value={statement}
          onChangeText={setStatement}
          multiline
        />

        <View style={styles.levelContainer}>
          {Object.entries(COMMIT_LABELS).map(([key, label]) => (
            <Pressable
              key={key}
              onPress={() => setLevel(key)}
              style={[
                styles.levelButton,
                level === key && styles.selectedLevel,
              ]}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  level === key && styles.selectedLevelText,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={addCommit}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : "Add Commitment"}
          </Text>
        </Pressable>
      </View>

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

  addBox: {
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 15,
    textAlignVertical: "top",
  },

  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  levelButton: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#3C3489",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },

  selectedLevel: {
    backgroundColor: "#3C3489",
  },

  levelButtonText: {
    color: "#3C3489",
    fontWeight: "600",
    fontSize: 13,
  },

  selectedLevelText: {
    color: "#fff",
  },

  saveButton: {
    backgroundColor: "#3C3489",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
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