import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

const USERS = {
  individual: [
    { id: "p1", name: "John Smith", password: "password" },
    { id: "p2", name: "Sarah Johnson", password: "password" },
    { id: "p3", name: "Mike Chen", password: "password" },
    { id: "p4", name: "Lisa Davis", password: "password" },
  ],
  hr: [{ id: "hr-user", name: "HR Manager", password: "password" }],
  ceo: [{ id: "ceo-user", name: "CEO", password: "password" }],
};

export default function Login({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const currentUsers = selectedRole ? USERS[selectedRole] : [];

  const handleLogin = () => {
    setError("");

    if (!selectedRole) {
      setError("Select a role");
      return;
    }

    if (!selectedUser) {
      setError("Select a user");
      return;
    }

    if (!password) {
      setError("Enter password");
      return;
    }

    const user = USERS[selectedRole].find(
      (u) => u.id === selectedUser
    );

    if (!user || user.password !== password) {
      setError("Invalid password");
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess(selectedRole, selectedUser, user.name);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>CownIt</Text>

        <Text style={styles.subtitle}>
          Commit & Own It
        </Text>

        <Text style={styles.label}>Select Role</Text>

        <View style={styles.roleRow}>
          {["individual", "hr", "ceo"].map((role) => (
            <Pressable
              key={role}
              style={[
                styles.roleButton,
                selectedRole === role &&
                  styles.roleButtonActive,
              ]}
              onPress={() => {
                setSelectedRole(role);
                setSelectedUser("");
                setPassword("");
                setError("");
              }}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === role &&
                    styles.roleTextActive,
                ]}
              >
                {role === "individual"
                  ? "Individual"
                  : role.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {selectedRole ? (
          <>
            <Text style={styles.label}>
              Select User
            </Text>

            <View style={styles.pickerBox}>
              <Picker
                selectedValue={selectedUser}
                onValueChange={(value) =>
                  setSelectedUser(value)
                }
              >
                <Picker.Item
                  label="Choose User..."
                  value=""
                />

                {currentUsers.map((user) => (
                  <Picker.Item
                    key={user.id}
                    label={user.name}
                    value={user.id}
                  />
                ))}
              </Picker>
            </View>
          </>
        ) : null}

        {selectedUser ? (
          <>
            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}

        <Pressable
          style={[
            styles.loginButton,
            (!selectedRole ||
              !selectedUser ||
              !password) &&
              styles.loginButtonDisabled,
          ]}
          disabled={
            !selectedRole ||
            !selectedUser ||
            !password
          }
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            Login
          </Text>
        </Pressable>

        <View style={styles.helpBox}>
          <Text style={{ fontWeight: "bold" }}>
            Demo Credentials
          </Text>

          <Text style={{ marginTop: 8 }}>
            Password: password
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 3,
  },

  logo: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  roleButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },

  roleButtonActive: {
    backgroundColor: "#000",
  },

  roleText: {
    color: "#000",
  },

  roleTextActive: {
    color: "#fff",
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },

  errorBox: {
    backgroundColor: "#fdecea",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },

  errorText: {
    color: "#d32f2f",
  },

  loginButton: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  loginButtonDisabled: {
    backgroundColor: "#bbb",
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  helpBox: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
  },
});