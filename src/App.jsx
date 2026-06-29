import React, { useState } from 'react';
import { people, commits, achievements, monthlyUpdates, messages, hrComments } from './data/seed';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [state, setState] = useState({
    activeRole: null,
    activePage: null,
    selectedPersonId: null,
    currentUserId: null,
    data: {
      people,
      commits,
      achievements,
      monthlyUpdates,
      messages,
      hrComments
    }
  });

  const handleLoginSuccess = (role, userId, userName) => {
    const pageMap = {
      individual: 'my-commits',
      hr: 'people',
      ceo: 'dashboard'
    };

    setIsAuthenticated(true);
    setCurrentUserRole(role);
    setCurrentUserId(userId);

    setState(prev => ({
      ...prev,
      activeRole: role,
      activePage: pageMap[role],
      currentUserId: userId
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    setCurrentUserId(null);
    setState({
      activeRole: null,
      activePage: null,
      selectedPersonId: null,
      currentUserId: null,
      data: {
        people,
        commits,
        achievements,
        monthlyUpdates,
        messages,
        hrComments
      }
    });
  };

  const handleRoleChange = (newRole) => {
    const pageMap = {
      individual: 'my-commits',
      hr: 'people',
      ceo: 'dashboard'
    };

    setState(prev => ({
      ...prev,
      activeRole: newRole,
      activePage: pageMap[newRole],
      selectedPersonId: null
    }));
  };

  const handlePageChange = (newPage) => {
    setState(prev => ({
      ...prev,
      activePage: newPage
    }));
  };

  const handleSelectPerson = (personId) => {
    setState(prev => ({
      ...prev,
      selectedPersonId: personId
    }));
  };

  const handleDataChange = (entity, newArray) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [entity]: newArray
      }
    }));
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const currentUser = state.data.people.find(p => p.id === state.currentUserId);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#fff'
    }}>
      <TopBar
        activeRole={state.activeRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          activeRole={state.activeRole}
          activePage={state.activePage}
          onPageChange={handlePageChange}
        />

        <ContentArea
          state={state}
          onNavigate={handlePageChange}
          onSelectPerson={handleSelectPerson}
          onDataChange={handleDataChange}
        />
      </div>
    </div>
  );
}

export default App;
