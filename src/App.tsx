import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, ActivityIndicator, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import type { AppData } from './data/seed'
import * as api from './services/api'

import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import BottomTabs from './components/BottomTabs'
import CommitmentModal from './components/CommitmentModal'

import MyCommits from './pages/individual/MyCommits'
import LogAchievement from './pages/individual/LogAchievement'
import MyImpact from './pages/individual/MyImpact'
import IndividualMessages from './pages/individual/IndividualMessages'

import HRDashboard from './pages/hr/HRDashboard'
import HRPeople from './pages/hr/HRPeople'
import HRDrilldown from './pages/hr/HRDrilldown'
import HRReminders from './pages/hr/HRReminders'

import CEODashboard from './pages/ceo/CEODashboard'
import CEOPeople from './pages/ceo/CEOPeople'
import CEOHeatmap from './pages/ceo/CEOHeatmap'
import CEOMessage from './pages/ceo/CEOMessage'

type AppState = {
  isAuthenticated: boolean
  currentUserId: string | null
  activeRole: 'individual' | 'hr' | 'ceo'
  activePage: string
  selectedPersonId: string | null
  selectedRecipientId: string | null
  data: AppData
  isLoading: boolean
  error: string | null
}

const initialState: AppState = {
  isAuthenticated: false,
  currentUserId: null,
  activeRole: 'individual',
  activePage: 'my-commits',
  selectedPersonId: null,
  selectedRecipientId: null,
  data: {
    people: [],
    commits: [],
    achievements: [],
    monthlyUpdates: [],
    messages: [],
    hrComments: []
  },
  isLoading: false,
  error: null
}

export default function App() {
  const [state, setState] = useState<AppState>(initialState)
  const [loginUserId, setLoginUserId] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async () => {
    if (!loginUserId.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a user ID' }))
      return
    }

    setLoginLoading(true)
    try {
      // Attempt login
      await api.login(loginUserId, 'individual')

      // Fetch all data in parallel
      const [people, commits, achievements, monthlyUpdates, messages, hrComments] = await Promise.all([
        api.fetchPeople(),
        api.fetchCommits(),
        api.fetchAchievements(),
        api.fetchMonthlyUpdates(),
        api.fetchMessages(),
        api.fetchHRComments()
      ])

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentUserId: loginUserId,
        data: {
          people,
          commits,
          achievements,
          monthlyUpdates,
          messages,
          hrComments
        },
        isLoading: false,
        error: null
      }))
      setLoginUserId('')
    } catch (err) {
      console.error('Failed to login:', err)
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Login failed'
      }))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRoleChange = (role: 'individual' | 'hr' | 'ceo') => {
    const defaultPages = {
      individual: 'my-commits',
      hr: 'hr-dashboard',
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

  // Calculate commitment count for current individual
  const commitmentCount = state.data.commits.filter(
    c => c.personId === state.currentUserId
  ).length

  // Show commitment modal if individual has less than 3 commitments
  const showCommitmentModal = state.activeRole === 'individual' && commitmentCount < 3

  const renderPage = () => {
    const props = {
      data: state.data,
      onDataChange: handleDataChange,
      onNavigate: handlePageChange,
      onSelectPerson: handleSelectPerson,
      onSelectRecipient: handleSelectRecipient,
      selectedPersonId: state.selectedPersonId,
      selectedRecipientId: state.selectedRecipientId,
      currentPersonId: state.currentUserId || ''
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
      case 'hr-dashboard':
        return <HRDashboard {...props} />
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

  if (state.isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#534AB7" />
      </SafeAreaView>
    )
  }

  if (!state.isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, styles.loginContainer]}>
        <View style={styles.loginForm}>
          <Text style={styles.loginTitle}>CownIt</Text>
          <Text style={styles.loginSubtitle}>Commit & Own It</Text>

          <Text style={styles.loginLabel}>Enter User ID</Text>
          <TextInput
            placeholder="e.g., p1, p2, p3, p4"
            value={loginUserId}
            onChangeText={setLoginUserId}
            style={styles.loginInput}
            editable={!loginLoading}
          />

          {state.error && <Text style={styles.loginError}>{state.error}</Text>}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loginLoading}
            style={[styles.loginButton, loginLoading && styles.loginButtonDisabled]}
          >
            {loginLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.loginHint}>Demo users: p1, p2, p3, p4</Text>
        </View>
      </SafeAreaView>
    )
  }

  const currentUser = state.data.people.find(p => p.id === state.currentUserId)
  const userRole = currentUser?.role || 'individual'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopBar activeRole={state.activeRole} onRoleChange={handleRoleChange} userRole={userRole} userName={currentUser?.name} />

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

      <CommitmentModal
        visible={showCommitmentModal}
        commitmentCount={commitmentCount}
        onNavigateToAddCommitment={() => {
          handlePageChange('my-commits')
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  loginForm: {
    width: '100%',
    maxWidth: 350,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4
  },
  loginSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30
  },
  loginLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  loginInput: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  loginButton: {
    backgroundColor: '#534AB7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16
  },
  loginButtonDisabled: {
    opacity: 0.5
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  loginError: {
    color: '#993C1D',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center'
  },
  loginHint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center'
  }
})
