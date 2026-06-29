import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ListChecks, PlusCircle, TrendingUp, MessageCircle } from 'lucide-react-native'

interface BottomTabsProps {
  activePage: string
  onPageChange: (page: string) => void
}

interface TabItem {
  page: string
  icon: React.ReactNode
  label: string
}

export default function BottomTabs({ activePage, onPageChange }: BottomTabsProps) {
  const tabs: TabItem[] = [
    { page: 'my-commits', icon: <ListChecks size={22} />, label: 'Commits' },
    { page: 'log-achievement', icon: <PlusCircle size={22} />, label: 'Log' },
    { page: 'my-impact', icon: <TrendingUp size={22} />, label: 'Impact' },
    { page: 'messages', icon: <MessageCircle size={22} />, label: 'Messages' }
  ]

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activePage === tab.page
        return (
          <TouchableOpacity
            key={tab.page}
            onPress={() => onPageChange(tab.page)}
            style={styles.tab}
          >
            {React.cloneElement(tab.icon as React.ReactElement<any>, {
              color: isActive ? '#534AB7' : '#AAA'
            })}
            <Text style={[
              styles.label,
              isActive && styles.labelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0'
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3
  },
  label: {
    fontSize: 10,
    color: '#AAA',
    fontWeight: '400'
  },
  labelActive: {
    color: '#534AB7',
    fontWeight: '500'
  }
})
