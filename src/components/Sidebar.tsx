import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Users, User, Bell, LayoutDashboard, Grid, Send } from 'lucide-react-native'

interface SidebarProps {
  activeRole: 'hr' | 'ceo'
  activePage: string
  onPageChange: (page: string) => void
}

interface NavItem {
  page: string
  icon: React.ReactNode
  label: string
}

export default function Sidebar({ activeRole, activePage, onPageChange }: SidebarProps) {
  const getNavItems = (): NavItem[] => {
    if (activeRole === 'hr') {
      return [
        { page: 'hr-people', icon: <Users size={16} />, label: 'People' },
        { page: 'hr-drilldown', icon: <User size={16} />, label: 'Individual view' },
        { page: 'hr-reminders', icon: <Bell size={16} />, label: 'Reminders' }
      ]
    }
    return [
      { page: 'ceo-dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
      { page: 'ceo-people', icon: <Users size={16} />, label: 'People view' },
      { page: 'ceo-heatmap', icon: <Grid size={16} />, label: 'Impact heatmap' },
      { page: 'ceo-message', icon: <Send size={16} />, label: 'Send message' }
    ]
  }

  const navItems = getNavItems()
  const roleLabel = activeRole === 'hr' ? 'HR' : 'CEO'

  return (
    <View style={styles.container}>
      <Text style={styles.roleLabel}>{roleLabel}</Text>
      <ScrollView style={styles.navContainer}>
        {navItems.map(item => {
          const isActive = activePage === item.page
          return (
            <TouchableOpacity
              key={item.page}
              onPress={() => onPageChange(item.page)}
              style={[
                styles.navItem,
                isActive && styles.navItemActive
              ]}
            >
              <View style={[
                styles.iconWrapper,
                isActive && styles.iconWrapperActive
              ]}>
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  color: isActive ? '#534AB7' : '#888'
                })}
              </View>
              <Text style={[
                styles.label,
                isActive && styles.labelActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: '100%',
    backgroundColor: '#FAFAFA',
    borderRightWidth: 0.5,
    borderRightColor: '#E0E0E0'
  },
  roleLabel: {
    fontSize: 10,
    color: '#AAA',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  navContainer: {
    flex: 1
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: 'transparent'
  },
  navItemActive: {
    backgroundColor: '#EEEDFE'
  },
  iconWrapper: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWrapperActive: {
    backgroundColor: 'transparent'
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
    flex: 1
  },
  labelActive: {
    color: '#534AB7',
    fontWeight: '500'
  }
})
