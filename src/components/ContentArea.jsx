import React from 'react';
import MyCommits from '../pages/MyCommits';
import LogAchievement from '../pages/LogAchievement';
import MyImpact from '../pages/MyImpact';
import Messages from '../pages/Messages';
import HrPeople from '../pages/HrPeople';
import HrDrilldown from '../pages/HrDrilldown';
import HrReminders from '../pages/HrReminders';
import CeoDashboard from '../pages/CeoDashboard';
import CeoPeople from '../pages/CeoPeople';
import CeoHeatmap from '../pages/CeoHeatmap';
import CeoMessage from '../pages/CeoMessage';

function ContentArea({ state, onNavigate, onSelectPerson, onDataChange }) {
  const pageMap = {
    'my-commits': MyCommits,
    'log-achievement': LogAchievement,
    'my-impact': MyImpact,
    'messages': Messages,
    'hr-people': HrPeople,
    'hr-drilldown': HrDrilldown,
    'hr-reminders': HrReminders,
    'ceo-dashboard': CeoDashboard,
    'ceo-people': CeoPeople,
    'ceo-heatmap': CeoHeatmap,
    'ceo-message': CeoMessage
  };

  const Page = pageMap[state.activePage];

  const getPageProps = () => {
    const commonProps = {
      data: state.data,
      onNavigate,
      onSelectPerson,
      onDataChange
    };

    switch (state.activePage) {
      case 'my-commits':
      case 'log-achievement':
      case 'my-impact':
      case 'messages':
        return {
          ...commonProps,
          currentPersonId: state.currentUserId
        };
      case 'hr-people':
      case 'hr-drilldown':
      case 'hr-reminders':
        return commonProps;
      case 'ceo-dashboard':
      case 'ceo-people':
      case 'ceo-heatmap':
      case 'ceo-message':
        return commonProps;
      default:
        return commonProps;
    }
  };

  const pageProps = getPageProps();

  return (
    <div
      style={{
        flex: 1,
        padding: '24px 16px 90px 16px',
        overflow: 'auto',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <Page {...pageProps} />
    </div>
  );
}

export default ContentArea;
