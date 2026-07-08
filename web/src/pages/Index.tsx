import { useState, useEffect } from "react";
import type { AppData, Role, Session } from "@/lib/types";
import { initialData } from "@/lib/seed";
import * as api from "@/lib/api";
import Login from "./Login";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MyCommits from "./individual/MyCommits";
import LogAchievement from "./individual/LogAchievement";
import MyImpact from "./individual/MyImpact";
import Messages from "./individual/Messages";
import HrPeople from "./hr/People";
import Drilldown from "./hr/Drilldown";
import Reminders from "./hr/Reminders";
import Dashboard from "./ceo/Dashboard";
import CeoPeople from "./ceo/People";
import Heatmap from "./ceo/Heatmap";
import CeoMessage from "./ceo/Message";

const DEFAULT_PAGE: Record<Role, string> = {
  individual: "my-commits",
  hr: "people",
  ceo: "dashboard",
};

function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [activePage, setActivePage] = useState<string>("");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [data, setData] = useState<AppData>(initialData());

  const handleLoginSuccess = (role: Role, userId: string, userName: string) => {
    setSession({ role, loginRole: role, userId, userName });
    setActivePage(DEFAULT_PAGE[role]);
    setSelectedPersonId(null);
  };

  // Load data from API after login
  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      try {
        const [people, commits, achievements, messages, hrComments] = await Promise.all([
          api.getPeople(),
          api.getCommits(),
          api.getAchievements(),
          api.getMessages(),
          api.getHrComments(),
        ]);

        setData({
          people,
          commits,
          achievements,
          messages,
          hrComments,
        });
      } catch (err) {
        console.error('Failed to load data:', err);
        // Fall back to mock data on error
      }
    };

    loadData();
  }, [session]);

  const handleLogout = () => {
    setSession(null);
    setActivePage("");
    setSelectedPersonId(null);
    setData(initialData());
  };

  const handleRoleChange = (newRole: Role) => {
    if (!session) return;
    setSession({ ...session, role: newRole });
    setActivePage(DEFAULT_PAGE[newRole]);
    setSelectedPersonId(null);
  };

  const handleSelectPerson = (personId: string) => {
    setSelectedPersonId(personId);
    setActivePage("drilldown");
  };

  const handleDataChange = <K extends keyof AppData>(entity: K, newArray: AppData[K]) => {
    setData((prev) => ({ ...prev, [entity]: newArray }));

    // Save to API
    if (entity === "commits") {
      const oldArray = data.commits;
      const newItems = (newArray as any[]).filter(
        (item) => !oldArray.some((old) => old.id === item.id)
      );
      newItems.forEach((item) => {
        api.createCommit(item).catch((err) => console.error('Failed to save commit:', err));
      });
    } else if (entity === "achievements") {
      const oldArray = data.achievements;
      const newItems = (newArray as any[]).filter(
        (item) => !oldArray.some((old) => old.id === item.id)
      );
      newItems.forEach((item) => {
        api.createAchievement(item).catch((err) => console.error('Failed to save achievement:', err));
      });
    } else if (entity === "messages") {
      const oldArray = data.messages;
      const newItems = (newArray as any[]).filter(
        (item) => !oldArray.some((old) => old.id === item.id)
      );
      newItems.forEach((item) => {
        api.createMessage(item).catch((err) => console.error('Failed to save message:', err));
      });
    } else if (entity === "hrComments") {
      const oldArray = data.hrComments;
      const newItems = (newArray as any[]).filter(
        (item) => !oldArray.some((old) => old.id === item.id)
      );
      newItems.forEach((item) => {
        api.createHrComment(item).catch((err) => console.error('Failed to save HR comment:', err));
      });
    }
  };

  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    if (session.role === "individual") {
      switch (activePage) {
        case "my-commits":
          return <MyCommits data={data} currentUserId={session.userId} onDataChange={handleDataChange} />;
        case "log-achievement":
          return (
            <LogAchievement
              data={data}
              currentUserId={session.userId}
              onDataChange={handleDataChange}
            />
          );
        case "my-impact":
          return <MyImpact data={data} currentUserId={session.userId} />;
        case "messages":
          return <Messages data={data} currentUserId={session.userId} />;
        default:
          return null;
      }
    }

    if (session.role === "hr") {
      switch (activePage) {
        case "people":
          return <HrPeople data={data} onSelectPerson={handleSelectPerson} />;
        case "drilldown":
          return (
            <Drilldown
              data={data}
              selectedPersonId={selectedPersonId}
              onDataChange={handleDataChange}
            />
          );
        case "reminders":
          return <Reminders data={data} onDataChange={handleDataChange} />;
        default:
          return null;
      }
    }

    switch (activePage) {
      case "dashboard":
        return <Dashboard data={data} />;
      case "people":
        return <CeoPeople data={data} />;
      case "heatmap":
        return <Heatmap data={data} />;
      case "message":
        return <CeoMessage data={data} onDataChange={handleDataChange} />;
      default:
        return null;
    }
  };

  const page = renderPage();

  return (
    <div className="flex h-screen flex-col bg-white">
      <TopBar
        activeRole={session.role}
        loginRole={session.loginRole}
        userName={session.userName}
        onRoleChange={handleRoleChange}
        onLogout={handleLogout}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar activeRole={session.role} activePage={activePage} onPageChange={setActivePage} />

        <div className="flex-1 overflow-auto bg-white p-4 pb-24 sm:p-6 md:pb-6">
          {page ?? (
            <div className="flex h-full items-center justify-center text-[#999]">
              Page not found
            </div>
          )}
        </div>
      </div>

      <MobileNav activeRole={session.role} activePage={activePage} onPageChange={setActivePage} />
    </div>
  );
}

export default Index;
