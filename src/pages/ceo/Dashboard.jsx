import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

const CPQSDP_INFO = {
  C: { label: "Cost", color: "#534AB7" },
  P: { label: "Productivity", color: "#0F6E56" },
  Q: { label: "Quality", color: "#3B6D11" },
  S: { label: "Safety", color: "#993C1D" },
  D: { label: "Delivery", color: "#185FA5" },
  O: { label: "People", color: "#854F0B" },
};

function Dashboard({ state }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalPeople = state.data.people.length;
  const totalAchievements = state.data.achievements.length;

  const avgImpact =
    totalAchievements > 0
      ? (
          state.data.achievements.reduce(
            (sum, a) => sum + a.impactRating,
            0
          ) / totalAchievements
        ).toFixed(1)
      : "—";

  const updatedCount = state.data.people.filter((p) =>
    state.data.monthlyUpdates.some(
      (u) =>
        u.personId === p.id &&
        u.month === currentMonth &&
        u.year === currentYear
    )
  ).length;

  const uniqueDepts = new Set(
    state.data.people.map((p) => p.department)
  ).size;

  const cpqsdpScores = {};

  Object.keys(CPQSDP_INFO).forEach((dim) => {
    const achievements = state.data.achievements.filter((a) =>
      a.cpqsdp.includes(dim)
    );

    cpqsdpScores[dim] =
      achievements.length > 0
        ? (
            achievements.reduce(
              (sum, a) => sum + a.impactRating,
              0
            ) / achievements.length
          ).toFixed(1)
        : "—";
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const recentAchievements = [...state.data.achievements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.label}>People committed</Text>
          <Text style={styles.value}>{totalPeople}</Text>
          <Text style={styles.sub}>
            Across {uniqueDepts} department
            {uniqueDepts !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Achievements</Text>
          <Text style={styles.value}>{totalAchievements}</Text>
          <Text style={styles.sub}>Programme total</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Avg Impact</Text>
          <Text style={styles.value}>{avgImpact}</Text>
          <Text style={styles.sub}>Self-rated /10</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Updated</Text>
          <Text style={styles.value}>
            {updatedCount}/{totalPeople}
          </Text>
          <Text style={styles.sub}>This month</Text>
        </View>
      </View>

      {/* CPQSDP */}
      <Text style={styles.section}>CPQSDP Impact Scores</Text>

      <View style={styles.cpqsdpContainer}>
        {Object.entries(CPQSDP_INFO).map(([key, info]) => (
          <View key={key} style={styles.cpqsdpCard}>
            <Text style={styles.label}>{info.label}</Text>

            <Text
              style={[
                styles.score,
                {
                  color: info.color,
                },
              ]}
            >
              {cpqsdpScores[key]}
            </Text>

            {cpqsdpScores[key] !== "—" && (
              <View style={styles.progress}>
                <View
                  style={{
                    height: 4,
                    borderRadius: 2,
                    width: `${
                      (parseFloat(cpqsdpScores[key]) / 10) * 100
                    }%`,
                    backgroundColor: info.color,
                  }}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Recent */}
      <Text style={styles.section}>Recent Achievements</Text>

      {recentAchievements.length === 0 ? (
        <View style={styles.empty}>
          <Text>No achievements yet</Text>
        </View>
      ) : (
        recentAchievements.map((achievement) => {
          const person = state.data.people.find(
            (p) => p.id === achievement.personId
          );

          return (
            <View
              key={achievement.id}
              style={styles.achievementCard}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>

                  <Text style={styles.info}>
                    By {person?.name} •{" "}
                    {formatDate(achievement.date)}
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {achievement.impactRating}/10
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  label: {
    color: "#666",
    fontSize: 12,
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 5,
  },

  sub: {
    fontSize: 11,
    color: "#999",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10,
  },

  cpqsdpContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  cpqsdpCard: {
    width: "31%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  score: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 8,
  },

  progress: {
    backgroundColor: "#DDD",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },

  achievementCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },

  achievementTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  info: {
    color: "#666",
    marginTop: 5,
  },

  badge: {
    backgroundColor: "#EEE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontWeight: "700",
  },

  empty: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default Dashboard;