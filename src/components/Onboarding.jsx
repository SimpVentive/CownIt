import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import {
  ChevronRight,
  CheckCircle,
  Zap,
  TrendingUp,
  MessageSquare,
} from "lucide-react-native";

const ACCENT = "#007bff";
const SECONDARY = "#777";

const ONBOARDING_STEPS = [
  {
    icon: CheckCircle,
    title: "Log Your Commits",
    description:
      "Record your daily work achievements across Self, Team and Organization."
  },
  {
    icon: Zap,
    title: "Track Your Impact",
    description:
      "Measure impact across Cost, Productivity, Quality, Safety, Delivery and People."
  },
  {
    icon: TrendingUp,
    title: "Build Your Profile",
    description:
      "Grow your health score as you log achievements."
  },
  {
    icon: MessageSquare,
    title: "Stay Connected",
    description:
      "Receive messages from HR and leadership."
  }
];

export default function Onboarding({ userName, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const step = ONBOARDING_STEPS[stepIndex];
  const Icon = step.icon;

  const finish = () => {
    setVisible(false);
    onComplete?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">

      <SafeAreaView style={styles.overlay}>
        <View style={styles.card}>

          {stepIndex === 0 && (
            <>
              <Text style={styles.welcome}>
                Welcome, {userName?.split(" ")[0]} 👋
              </Text>

              <Text style={styles.subtitle}>
                Let's get you started with CowIt
              </Text>
            </>
          )}

          <View style={styles.iconBox}>
            <Icon size={42} color={ACCENT} />
          </View>

          <Text style={styles.title}>{step.title}</Text>

          <Text style={styles.description}>
            {step.description}
          </Text>

          <View style={styles.dots}>
            {ONBOARDING_STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i <= stepIndex ? ACCENT : "#ddd",
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>

            {stepIndex > 0 && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setStepIndex(stepIndex - 1)}
              >
                <Text style={styles.secondaryText}>Back</Text>
              </Pressable>
            )}

            {stepIndex < ONBOARDING_STEPS.length - 1 ? (
              <>
                <Pressable
                  style={styles.skipButton}
                  onPress={finish}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </Pressable>

                <Pressable
                  style={styles.primaryButton}
                  onPress={() => setStepIndex(stepIndex + 1)}
                >
                  <Text style={styles.primaryText}>Next</Text>
                  <ChevronRight color="#fff" size={18} />
                </Pressable>
              </>
            ) : (
              <Pressable
                style={styles.primaryButton}
                onPress={finish}
              >
                <Text style={styles.primaryText}>Get Started</Text>
                <ChevronRight color="#fff" size={18} />
              </Pressable>
            )}
          </View>

        </View>
      </SafeAreaView>

    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
  },

  welcome: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    color: SECONDARY,
  },

  iconBox: {
    width: 90,
    height: 90,
    backgroundColor: "#eef6ff",
    alignSelf: "center",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    marginTop: 12,
    textAlign: "center",
    color: SECONDARY,
    lineHeight: 22,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 28,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginHorizontal: 5,
  },

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  primaryButton: {
    flex: 1,
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  skipButton: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
    marginRight: 6,
  },

  secondaryText: {
    fontWeight: "700",
  },

  skipText: {
    color: SECONDARY,
    fontWeight: "600",
  },
});