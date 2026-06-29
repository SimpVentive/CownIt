import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface TopBarProps {
  activeRole: 'individual' | 'hr' | 'ceo'
  onRoleChange: (role: 'individual' | 'hr' | 'ceo') => void
}

export default function TopBar({ activeRole, onRoleChange }: TopBarProps) {
  const roles = [
    { value: 'individual' as const, label: 'Individual' },
    { value: 'hr' as const, label: 'HR' },
    { value: 'ceo' as const, label: 'CEO' }
  ]

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.logoText}>
          <Text style={styles.cown}>Cown</Text>
          <Text style={styles.it}>It</Text>
        </Text>
        <Text style={styles.tagline}>Commit & Own It</Text>
      </View>

      <View style={styles.right}>
        {roles.map(role => (
          <TouchableOpacity
            key={role.value}
            onPress={() => onRoleChange(role.value)}
            style={[
              styles.button,
              activeRole === role.value ? styles.buttonActive : styles.buttonInactive
            ]}
          >
            <Text style={[
              styles.buttonLabel,
              activeRole === role.value ? styles.buttonLabelActive : styles.buttonLabelInactive
            ]}>
              {role.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0'
  },
  left: {
    flex: 1
  },
  logoText: {
    fontSize: 18,
    fontWeight: '500'
  },
  cown: {
    color: '#1A1A1A'
  },
  it: {
    color: '#534AB7'
  },
  tagline: {
    fontSize: 10,
    color: '#888',
    marginTop: 2
  },
  right: {
    flexDirection: 'row',
    gap: 6
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6
  },
  buttonActive: {
    backgroundColor: '#534AB7'
  },
  buttonInactive: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#D0D0D0'
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '400'
  },
  buttonLabelActive: {
    color: '#fff',
    fontWeight: '500'
  },
  buttonLabelInactive: {
    color: '#666'
  }
})
