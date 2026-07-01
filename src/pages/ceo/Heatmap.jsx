import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

const CPQSDP_LABELS = {
  C: "Cost",
  P: "Productivity",
  Q: "Quality",
  S: "Safety",
  D: "Delivery",
  O: "People",
};

function getColor(score) {
  if (score === null)
    return { bg: "#f5f5f5", text: "#999" };

  if (score >= 8)
    return { bg: "#e8f5e9", text: "#2e7d32" };

  if (score >= 6)
    return { bg: "#e3f2fd", text: "#1565c0" };

  if (score >= 4)
    return { bg: "#fff3e0", text: "#e65100" };

  return { bg: "#ffebee", text: "#c62828" };
}

export default function Heatmap({ state }) {
  const personDimensionScore = (personId, dimension) => {
    const achievements = state.data.achievements.filter(
      (a) =>
        a.personId === personId &&
        a.cpqsdp.includes(dimension)
    );

    if (!achievements.length) return null;

    return Number(
      (
        achievements.reduce(
          (sum, a) => sum + a.impactRating,
          0
        ) / achievements.length
      ).toFixed(1)
    );
  };

  const orgAvg = (dimension) => {
    const achievements =
      state.data.achievements.filter((a) =>
        a.cpqsdp.includes(dimension)
      );

    if (!achievements.length) return null;

    return Number(
      (
        achievements.reduce(
          (sum, a) => sum + a.impactRating,
          0
        ) / achievements.length
      ).toFixed(1)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Impact Heatmap
      </Text>

      <ScrollView horizontal>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.row}>
            <View style={styles.nameCell} />

            {Object.keys(CPQSDP_LABELS).map((dim) => (
              <View
                key={dim}
                style={styles.headerCell}
              >
                <Text style={styles.headerText}>
                  {dim}
                </Text>
              </View>
            ))}
          </View>

          {/* People */}
          {state.data.people.map((person) => (
            <View
              style={styles.row}
              key={person.id}
            >
              <View style={styles.nameCell}>
                <Text style={styles.personName}>
                  {person.name.split(" ")[0]}
                </Text>
              </View>

              {Object.keys(CPQSDP_LABELS).map(
                (dim) => {
                  const score =
                    personDimensionScore(
                      person.id,
                      dim
                    );

                  const color =
                    getColor(score);

                  return (
                    <View
                      key={dim}
                      style={[
                        styles.scoreCell,
                        {
                          backgroundColor:
                            color.bg,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: color.text,
                          fontWeight: "600",
                        }}
                      >
                        {score ?? "—"}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          ))}

          {/* Average */}
          <View
            style={[
              styles.row,
              { marginTop: 8 },
            ]}
          >
            <View style={styles.nameCell}>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                Org Avg
              </Text>
            </View>

            {Object.keys(CPQSDP_LABELS).map(
              (dim) => {
                const score = orgAvg(dim);
                const color =
                  getColor(score);

                return (
                  <View
                    key={dim}
                    style={[
                      styles.scoreCell,
                      {
                        backgroundColor:
                          color.bg,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: color.text,
                        fontWeight: "700",
                      }}
                    >
                      {score ?? "—"}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}

      <View style={styles.legend}>
        {[
          {
            bg: "#e8f5e9",
            label: "8-10 High",
          },
          {
            bg: "#e3f2fd",
            label: "6-7 Good",
          },
          {
            bg: "#fff3e0",
            label: "4-5 Moderate",
          },
          {
            bg: "#ffebee",
            label: "1-3 Low",
          },
        ].map((item) => (
          <View
            key={item.label}
            style={styles.legendItem}
          >
            <View
              style={[
                styles.legendBox,
                {
                  backgroundColor:
                    item.bg,
                },
              ]}
            />
            <Text>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const CELL_WIDTH = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center",
  },

  nameCell: {
    width: 110,
    padding: 8,
  },

  personName: {
    fontWeight: "500",
  },

  headerCell: {
    width: CELL_WIDTH,
    alignItems: "center",
    padding: 8,
  },

  headerText: {
    fontWeight: "700",
    color: "#666",
  },

  scoreCell: {
    width: CELL_WIDTH,
    height: 40,
    marginHorizontal: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  legend: {
    marginTop: 24,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 10,
  },
});