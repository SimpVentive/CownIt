import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

// Individual pages
import MyCommits from "../pages/individual/MyCommits";
import LogAchievement from "../pages/individual/LogAchievement";
import MyImpact from "../pages/individual/MyImpact";
import Messages from "../pages/individual/Messages";

// HR pages
import HRPeople from "../pages/hr/People";
import HRDrilldown from "../pages/hr/Drilldown";
import HRReminders from "../pages/hr/Reminders";

// CEO pages
import CEODashboard from "../pages/ceo/Dashboard";
import CEOPeople from "../pages/ceo/People";
import CEOHeatmap from "../pages/ceo/Heatmap";
import CEOMessage from "../pages/ceo/Message";

const PAGE_MAP = {
  individual: {
    "my-commits": MyCommits,
    "log-achievement": LogAchievement,
    "my-impact": MyImpact,
    messages: Messages,
  },

  hr: {
    people: HRPeople,
    drilldown: HRDrilldown,
    reminders: HRReminders,
  },

  ceo: {
    dashboard: CEODashboard,
    people: CEOPeople,
    heatmap: CEOHeatmap,
    message: CEOMessage,
  },
};

export default function ContentArea({
  state,
  onNavigate,
  onSelectPerson,
  onDataChange,
}) {
  const pages = PAGE_MAP[state.activeRole];
  const Page = pages?.[state.activePage];

  if (!Page) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>
          Page not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Page
        state={state}
        onNavigate={onNavigate}
        onSelectPerson={onSelectPerson}
        onDataChange={onDataChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  notFoundText: {
    fontSize: 18,
    color: "#999",
  },
});