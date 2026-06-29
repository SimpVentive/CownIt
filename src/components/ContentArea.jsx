import React from 'react';

// Individual pages
import MyCommits from '../pages/individual/MyCommits';
import LogAchievement from '../pages/individual/LogAchievement';
import MyImpact from '../pages/individual/MyImpact';
import Messages from '../pages/individual/Messages';

// HR pages
import HRPeople from '../pages/hr/People';
import HRDrilldown from '../pages/hr/Drilldown';
import HRReminders from '../pages/hr/Reminders';

// CEO pages
import CEODashboard from '../pages/ceo/Dashboard';
import CEOPeople from '../pages/ceo/People';
import CEOHeatmap from '../pages/ceo/Heatmap';
import CEOMessage from '../pages/ceo/Message';

const PAGE_MAP = {
  individual: {
    'my-commits': MyCommits,
    'log-achievement': LogAchievement,
    'my-impact': MyImpact,
    'messages': Messages
  },
  hr: {
    'people': HRPeople,
    'drilldown': HRDrilldown,
    'reminders': HRReminders
  },
  ceo: {
    'dashboard': CEODashboard,
    'people': CEOPeople,
    'heatmap': CEOHeatmap,
    'message': CEOMessage
  }
};

function ContentArea({ state, onNavigate, onSelectPerson, onDataChange }) {
  const pages = PAGE_MAP[state.activeRole];
  const Page = pages?.[state.activePage];

  if (!Page) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        Page not found
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      padding: '24px',
      overflow: 'auto',
      backgroundColor: '#fff'
    }}>
      <Page
        state={state}
        onNavigate={onNavigate}
        onSelectPerson={onSelectPerson}
        onDataChange={onDataChange}
      />
    </div>
  );
}

export default ContentArea;
