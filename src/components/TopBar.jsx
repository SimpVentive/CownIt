import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

export default function TopBar({
  activeRole,
  loginRole,
  onRoleChange,
  currentUser,
  onLogout,
}) {
  const allRoles = [
    { value: "individual", label: "Individual" },
    { value: "hr", label: "HR" },
    { value: "ceo", label: "CEO" },
  ];

  const roles = allRoles.filter((role) => {
    if (loginRole === "individual") {
      return role.value === "individual";
    }
    if (loginRole === "hr") {
      return role.value === "individual" || role.value === "hr";
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Text style={styles.logo}>CownIt</Text>

      {/* Role Switcher */}
      <View style={styles.roleContainer}>
        {roles.map((role) => {
          const isActive = activeRole === role.value;

          return (
            <Pressable
              key={role.value}
              onPress={() => onRoleChange(role.value)}
              style={[
                styles.roleButton,
                isActive && styles.activeRoleButton,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  isActive && styles.activeRoleText,
                ]}
              >
                {role.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* User Info */}
      <View style={styles.userContainer}>
        {currentUser && (
          <Text style={styles.userName}>
            {currentUser.name}
          </Text>
        )}

        {onLogout && (
          <Pressable
            style={styles.logoutButton}
            onPress={onLogout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },

  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  roleButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  activeRoleButton: {
    backgroundColor: "#000",
  },

  roleText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "500",
  },

  activeRoleText: {
    color: "#fff",
  },

  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userName: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },

  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc3545",
  },

  logoutText: {
    color: "#dc3545",
    fontSize: 13,
    fontWeight: "500",
  },
});