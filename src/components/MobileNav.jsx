import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Home,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Users,
  Eye,
  Bell,
  Send,
  BarChart3,
} from "lucide-react-native";

const ACCENT_COLOR = "#007bff";
const SECONDARY_TEXT = "#999";

const NAV_MAP = {
  individual: [
    { page: "my-commits", icon: CheckCircle, label: "Commits" },
    { page: "log-achievement", icon: TrendingUp, label: "Log" },
    { page: "my-impact", icon: BarChart3, label: "Impact" },
    { page: "messages", icon: MessageSquare, label: "Messages" },
  ],
  hr: [
    { page: "people", icon: Users, label: "People" },
    { page: "drilldown", icon: Eye, label: "View" },
    { page: "reminders", icon: Bell, label: "Reminders" },
  ],
  ceo: [
    { page: "dashboard", icon: Home, label: "Dashboard" },
    { page: "people", icon: Users, label: "People" },
    { page: "heatmap", icon: BarChart3, label: "Heatmap" },
    { page: "message", icon: Send, label: "Message" },
  ],
};

export default function MobileNav({
  activeRole,
  activePage,
  onPageChange,
}) {
  const navItems = NAV_MAP[activeRole] || [];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.page;

        return (
          <TouchableOpacity
            key={item.page}
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => onPageChange(item.page)}
          >
            <Icon
              size={24}
              color={active ? ACCENT_COLOR : SECONDARY_TEXT}
              strokeWidth={active ? 2.6 : 2}
            />

            <Text
              style={[
                styles.label,
                {
                  color: active
                    ? ACCENT_COLOR
                    : SECONDARY_TEXT,
                },
              ]}
            >
              {item.label}
            </Text>

            {active && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#fff",

    borderTopWidth: 1,
    borderTopColor: "#ddd",

    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -2,
    },
  },

  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  indicator: {
    position: "absolute",
    top: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_COLOR,
  },
});