import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
  LogOut,
} from "lucide-react-native";

const ACCENT_COLOR = "#007bff";
const SECONDARY_TEXT = "#666";
const SIDEBAR_BG = "#f8f9fa";

const NAV_MAP = {
  individual: [
    { page: "my-commits", icon: CheckCircle, label: "My Commitments" },
    { page: "log-achievement", icon: TrendingUp, label: "Log Achievement" },
    { page: "my-impact", icon: BarChart3, label: "My Impact" },
    { page: "messages", icon: MessageSquare, label: "Messages" },
  ],

  hr: [
    { page: "hr-people", icon: Users, label: "People" },
    { page: "hr-drilldown", icon: Eye, label: "Individual View" },
    { page: "hr-reminders", icon: Bell, label: "Reminders" },
  ],

  ceo: [
    { page: "ceo-dashboard", icon: Home, label: "Dashboard" },
    { page: "ceo-people", icon: Users, label: "People View" },
    { page: "ceo-heatmap", icon: BarChart3, label: "Impact Heatmap" },
    { page: "ceo-message", icon: Send, label: "Send Message" },
  ],
};

export default function LeftSidebar({
  activeRole,
  activePage,
  onPageChange,
  onLogout,
}) {
  const navItems = NAV_MAP[activeRole] || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          Cow<Text style={{ color: ACCENT_COLOR }}>It</Text>
        </Text>
      </View>

      {/* Navigation */}

      <ScrollView style={styles.menu}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.page;

          return (
            <Pressable
              key={item.page}
              onPress={() => onPageChange(item.page)}
              style={[
                styles.menuItem,
                active && styles.activeMenuItem,
              ]}
            >
              <Icon
                size={20}
                color={active ? "#fff" : SECONDARY_TEXT}
              />

              <Text
                style={[
                  styles.menuText,
                  active && styles.activeMenuText,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Logout */}

      <View style={styles.footer}>
        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <LogOut size={20} color="#dc3545" />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: SIDEBAR_BG,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },

  logoContainer: {
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  logo: {
    fontSize: 22,
    fontWeight: "700",
  },

  menu: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 16,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },

  activeMenuItem: {
    backgroundColor: ACCENT_COLOR,
  },

  menuText: {
    marginLeft: 14,
    fontSize: 15,
    color: SECONDARY_TEXT,
    fontWeight: "500",
  },

  activeMenuText: {
    color: "#fff",
    fontWeight: "600",
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 12,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dc3545",
    borderRadius: 8,
    paddingVertical: 12,
  },

  logoutText: {
    marginLeft: 10,
    color: "#dc3545",
    fontWeight: "600",
    fontSize: 15,
  },
});