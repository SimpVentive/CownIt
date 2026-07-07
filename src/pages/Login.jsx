import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { API_URL } from "../services/api";


export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Enter email");
      return;
    }

    if (!password) {
      setError("Enter password");
      return;
    }

    try {
      setLoading(true);      

      // data.user = { id, name, email, role }
      // data.token = JWT token

      if (onLoginSuccess) {
        onLoginSuccess(
          email,
          password
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>CownIt</Text>

        <Text style={styles.subtitle}>
          Commit & Own It
        </Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={[
            styles.loginButton,
            (!email || !password || loading) &&
              styles.loginButtonDisabled,
          ]}
          disabled={!email || !password || loading}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            {loading ? "Signing In..." : "Login"}
          </Text>
        </Pressable>
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
    marginTop: 15,
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
});