import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

function Reminders({ state, onDataChange }) {
  const [sentIds, setSentIds] = useState([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const overduePeople = state.data.people.filter(
    (p) =>
      !state.data.monthlyUpdates.some(
        (u) =>
          u.personId === p.id &&
          u.month === currentMonth &&
          u.year === currentYear
      )
  );

  const formatDate = (date) => {
    if (!date) return "Never";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  const getLastUpdateDate = (personId) => {
    const updates = state.data.monthlyUpdates
      .filter((u) => u.personId === personId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return updates.length ? formatDate(updates[0].updatedAt) : "Never";
  };

  const sendReminder = (personId) => {
    const msg = {
      id: "msg" + Date.now(),
      fromRole: "hr",
      fromName: "HR",
      toPersonId: personId,
      body:
        "Your monthly commit update is overdue. Please update before month end.",
      date: new Date().toISOString(),
      read: false,
    };

    onDataChange("messages", [...state.data.messages, msg]);
    setSentIds([...sentIds, personId]);
  };

  const sendToAll = () => {
    const msgs = overduePeople
      .filter((p) => !sentIds.includes(p.id))
      .map((p) => ({
        id: "msg" + Date.now() + Math.random(),
        fromRole: "hr",
        fromName: "HR",
        toPersonId: p.id,
        body:
          "Your monthly commit update is overdue. Please update before month end.",
        date: new Date().toISOString(),
        read: false,
      }));

    onDataChange("messages", [...state.data.messages, ...msgs]);
    setSentIds(overduePeople.map((p) => p.id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reminders</Text>

      {overduePeople.length === 0 ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            All individuals are up to date.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              {overduePeople.length} people overdue this month
            </Text>
          </View>

          {overduePeople.map((person) => (
            <View key={person.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{person.name}</Text>

                <Text style={styles.info}>
                  {person.department} • Last updated{" "}
                  {getLastUpdateDate(person.id)}
                </Text>
              </View>

              {sentIds.includes(person.id) ? (
                <Text style={styles.sent}>Sent</Text>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => sendReminder(person.id)}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[
              styles.bulkButton,
              sentIds.length === overduePeople.length && {
                backgroundColor: "#999",
              },
            ]}
            disabled={sentIds.length === overduePeople.length}
            onPress={sendToAll}
          >
            <Text style={styles.buttonText}>Send To All</Text>
          </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  successBox: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 10,
  },

  successText: {
    color: "#155724",
  },

  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  warningText: {
    color: "#856404",
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
  },

  info: {
    color: "#666",
    marginTop: 4,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },

  bulkButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  sent: {
    color: "green",
    fontWeight: "600",
  },
});

export default Reminders;