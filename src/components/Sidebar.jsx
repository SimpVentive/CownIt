import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  CheckCircle,
  PlusCircle,
  TrendingUp,
  MessageSquare,
  Users,
  Eye,
  Bell,
  BarChart3,
  Send,
} from "lucide-react-native";

const NAV_MAP = {
  individual: [
    {
      page: "my-commits",
      icon: CheckCircle,
      label: "My commits",
    },
    {
      page: "log-achievement",
      icon: PlusCircle,
      label: "Log achievement",
    },
    {
      page: "my-impact",
      icon: TrendingUp,
      label: "My impact",
    },
    {
      page: "messages",
      icon: MessageSquare,
      label: "Messages",
    },
  ],

  hr: [
    {
      page: "people",
      icon: Users,
      label: "People",
    },
    {
      page: "drilldown",
      icon: Eye,
      label: "Individual view",
    },
    {
      page: "reminders",
      icon: Bell,
      label: "Reminders",
    },
  ],

  ceo: [
    {
      page: "dashboard",
      icon: BarChart3,
      label: "Dashboard",
    },
    {
      page: "people",
      icon: Users,
      label: "People",
    },
    {
      page: "heatmap",
      icon: TrendingUp,
      label: "Impact heatmap",
    },
    {
      page: "message",
      icon: Send,
      label: "Send message",
    },
  ],
};

export default function Sidebar({
  activeRole,
  activePage,
  onPageChange,
}) {
  const navItems = NAV_MAP[activeRole] || [];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.page;

        return (
          <Pressable
            key={item.page}
            onPress={() => onPageChange(item.page)}
            style={[
              styles.item,
              isActive && styles.activeItem,
            ]}
          >
            <Icon
              size={20}
              color={isActive ? "#000" : "#555"}
              strokeWidth={1.8}
            />

            <Text
              style={[
                styles.label,
                isActive && styles.activeLabel,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    paddingVertical: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  activeItem: {
    backgroundColor: "#f5f5f5",
  },

  label: {
    marginLeft: 12,
    fontSize: 14,
    color: "#444",
  },

  activeLabel: {
    fontWeight: "600",
    color: "#000",
  },
});