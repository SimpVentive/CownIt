import React, { useState } from 'react';
import { people, commits, achievements, monthlyUpdates, messages, hrComments } from './data/seed';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import Auth from './pages/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(null);

  const [state, setState] = useState({
    activeRole: 'individual',
    activePage: 'my-commits',
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

  const handleLoginSuccess = (userId, phoneNumber) => {
    setIsAuthenticated(true);
    setCurrentUserId(userId);
    setCurrentPhoneNumber(phoneNumber);
    setState(prev => ({
      ...prev,
      currentUserId: userId
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setCurrentPhoneNumber(null);
    setState({
      activeRole: 'individual',
      activePage: 'my-commits',
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
      hr: 'hr-people',
      ceo: 'ceo-dashboard'
    };

    setState({
      ...state,
      activeRole: newRole,
      activePage: pageMap[newRole],
      selectedPersonId: null
    });
  };

  const handlePageChange = (newPage) => {
    setState({
      ...state,
      activePage: newPage
    });
  };

  const handleSelectPerson = (personId) => {
    setState({
      ...state,
      selectedPersonId: personId
    });
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
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        activeRole={state.activeRole}
        onRoleChange={handleRoleChange}
        currentUser={state.data.people.find(p => p.id === state.currentUserId)}
        onLogout={handleLogout}
      />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activeRole={state.activeRole} activePage={state.activePage} onPageChange={handlePageChange} />
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
