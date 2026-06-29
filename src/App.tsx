import React, { useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import type { AppData } from './data/seed'
import { initialData } from './data/seed'
import { CURRENT_PERSON_ID } from './utils/constants'

import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import BottomTabs from './components/BottomTabs'

import MyCommits from './pages/individual/MyCommits'
import LogAchievement from './pages/individual/LogAchievement'
import MyImpact from './pages/individual/MyImpact'
import IndividualMessages from './pages/individual/IndividualMessages'

import HRPeople from './pages/hr/HRPeople'
import HRDrilldown from './pages/hr/HRDrilldown'
import HRReminders from './pages/hr/HRReminders'

import CEODashboard from './pages/ceo/CEODashboard'
import CEOPeople from './pages/ceo/CEOPeople'
import CEOHeatmap from './pages/ceo/CEOHeatmap'
import CEOMessage from './pages/ceo/CEOMessage'

type AppState = {
  activeRole: 'individual' | 'hr' | 'ceo'
  activePage: string
  selectedPersonId: string | null
  selectedRecipientId: string | null
  data: AppData
}

const initialState: AppState = {
  activeRole: 'individual',
  activePage: 'my-commits',
  selectedPersonId: null,
  selectedRecipientId: null,
  data: initialData
}

export default function App() {
  const [state, setState] = useState<AppState>(initialState)

  const handleRoleChange = (role: 'individual' | 'hr' | 'ceo') => {
    const defaultPages = {
      individual: 'my-commits',
      hr: 'hr-people',
      ceo: 'ceo-dashboard'
    }
    setState(prev => ({
      ...prev,
      activeRole: role,
      activePage: defaultPages[role],
      selectedPersonId: null,
      selectedRecipientId: null
    }))
  }

  const handlePageChange = (page: string) => {
    setState(prev => ({ ...prev, activePage: page }))
  }

  const handleDataChange = (entity: keyof AppData, newArray: any[]) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [entity]: newArray }
    }))
  }

  const handleSelectPerson = (personId: string) => {
    setState(prev => ({ ...prev, selectedPersonId: personId }))
  }

  const handleSelectRecipient = (personId: string) => {
    setState(prev => ({ ...prev, selectedRecipientId: personId }))
  }

  const renderPage = () => {
    const props = {
      data: state.data,
      onDataChange: handleDataChange,
      onNavigate: handlePageChange,
      onSelectPerson: handleSelectPerson,
      onSelectRecipient: handleSelectRecipient,
      selectedPersonId: state.selectedPersonId,
      selectedRecipientId: state.selectedRecipientId,
      currentPersonId: CURRENT_PERSON_ID
    }

    switch (state.activePage) {
      case 'my-commits':
        return <MyCommits {...props} />
      case 'log-achievement':
        return <LogAchievement {...props} />
      case 'my-impact':
        return <MyImpact {...props} />
      case 'messages':
        return <IndividualMessages {...props} />
      case 'hr-people':
        return <HRPeople {...props} />
      case 'hr-drilldown':
        return <HRDrilldown {...props} />
      case 'hr-reminders':
        return <HRReminders {...props} />
      case 'ceo-dashboard':
        return <CEODashboard {...props} />
      case 'ceo-people':
        return <CEOPeople {...props} />
      case 'ceo-heatmap':
        return <CEOHeatmap {...props} />
      case 'ceo-message':
        return <CEOMessage {...props} />
      default:
        return <MyCommits {...props} />
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopBar activeRole={state.activeRole} onRoleChange={handleRoleChange} />

      {state.activeRole === 'individual' ? (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 1 }}>{renderPage()}</View>
          <BottomTabs activePage={state.activePage} onPageChange={handlePageChange} />
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ width: 180, borderRightWidth: 0.5, borderRightColor: '#e0e0e0' }}>
            <Sidebar activeRole={state.activeRole} activePage={state.activePage} onPageChange={handlePageChange} />
          </View>
          <View style={{ flex: 1 }}>{renderPage()}</View>
        </View>
      )}
    </SafeAreaView>
  )
}
