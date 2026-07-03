import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface TopBarProps {
  activeRole: 'individual' | 'hr' | 'ceo'
  onRoleChange: (role: 'individual' | 'hr' | 'ceo') => void
  userRole?: 'individual' | 'hr' | 'ceo'
  userName?: string
}

export default function TopBar({ activeRole, onRoleChange, userRole = 'individual', userName = 'User' }: TopBarProps) {
  console.log('TopBar userRole:', userRole, 'userName:', userName)
  const allowedRoles = userRole ? [userRole] : ['individual', 'hr', 'ceo']
  const roleLabels: Record<'individual' | 'hr' | 'ceo', string> = {
    individual: 'Individual',
    hr: 'HR',
    ceo: 'CEO'
  }

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
        <Text style={styles.userName}>{userName}</Text>
        {allowedRoles.map(role => (
          <View
            key={role}
            style={[
              styles.button,
              styles.buttonActive
            ]}
          >
            <Text style={[
              styles.buttonLabel,
              styles.buttonLabelActive
            ]}>
              {roleLabels[role]}
            </Text>
          </View>
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
    gap: 12,
    alignItems: 'center'
  },
  userName: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400'
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
