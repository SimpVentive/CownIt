import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  login,
  setToken,
  fetchPeople,
  fetchCommits,
  fetchAchievements,
  fetchMonthlyUpdates,
  fetchMessages,
  fetchHRComments,
} from "./services/api";

import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import ContentArea from "./components/ContentArea";
import Login from "./pages/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const [state, setState] = useState({
    activeRole: null,
    loginRole: null,
    activePage: null,
    selectedPersonId: null,
    currentUserId: null,

    data: {
      people: [],
      commits: [],
      achievements: [],
      monthlyUpdates: [],
      messages: [],
      hrComments: [],
    },
  });

  const handleLoginSuccess = async (role, userId) => {
    const pageMap = {
      individual: "my-commits",
      hr: "people",
      ceo: "dashboard",
    };

    setLoginError("");

    try {
      await login(userId, role);
      const [people, commits, achievements, monthlyUpdates, messages, hrComments] = await Promise.all([
        fetchPeople(),
        fetchCommits(),
        fetchAchievements(),
        fetchMonthlyUpdates(),
        fetchMessages(),
        fetchHRComments(),
      ]);

      setState((prev) => ({
        ...prev,
        loginRole: role,
        activeRole: role,
        activePage: pageMap[role],
        currentUserId: userId,
        data: {
          people,
          commits,
          achievements,
          monthlyUpdates,
          messages,
          hrComments,
        },
      }));
      setIsAuthenticated(true);
    } catch (err) {
      setToken(null);
      setIsAuthenticated(false);
      setLoginError(err?.message || "Login failed")
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);

    setState({
      activeRole: null,
      loginRole: null,
      activePage: null,
      selectedPersonId: null,
      currentUserId: null,

      data: {
        people: [],
        commits: [],
        achievements: [],
        monthlyUpdates: [],
        messages: [],
        hrComments: [],
      },
    });
  };

  const handleRoleChange = (role) => {
    const pageMap = {
      individual: "my-commits",
      hr: "people",
      ceo: "dashboard",
    };

    setState((prev) => ({
      ...prev,
      activeRole: role,
      activePage: pageMap[role],
      selectedPersonId: null,
    }));
  };

  const handlePageChange = (page) => {
    setState((prev) => ({
      ...prev,
      activePage: page,
    }));
  };

  const handleSelectPerson = (personId) => {
    setState((prev) => ({
      ...prev,
      selectedPersonId: personId,
    }));
  };

  const handleDataChange = (entity, newArray) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [entity]: newArray,
      },
    }));
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        errorMessage={loginError}
      />
    );
  }

  const currentUser = state.data.people.find(
    (p) => p.id === state.currentUserId
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TopBar
          activeRole={state.activeRole}
          loginRole={state.loginRole}
          onRoleChange={handleRoleChange}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        <View style={styles.body}>
          {isTablet && (
            <Sidebar
              activeRole={state.activeRole}
              activePage={state.activePage}
              onPageChange={handlePageChange}
            />
          )}

          <View style={styles.content}>
            <ContentArea
              state={state}
              onNavigate={handlePageChange}
              onSelectPerson={handleSelectPerson}
              onDataChange={handleDataChange}
            />
          </View>
        </View>

        {!isTablet && (
          <MobileNav
            activeRole={state.activeRole}
            activePage={state.activePage}
            onPageChange={handlePageChange}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  body: {
    flex: 1,
    flexDirection: "row",
  },

  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 70, // Space for MobileNav
  },
});