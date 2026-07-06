import { useState } from "react";
import type { AppData, AppMessage } from "@/lib/types";
import { formatDateShort } from "@/lib/utilsApp";

interface RemindersProps {
  data: AppData;
  onDataChange: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

const REMINDER_BODY =
  "Your monthly commit update is overdue. Please log your progress and at least one achievement before end of this month.";

function Reminders({ data, onDataChange }: RemindersProps) {
  const [sentIds, setSentIds] = useState<string[]>([]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const overduePeople = data.people.filter(
    (p) =>
      !data.monthlyUpdates.some(
        (u) => u.personId === p.id && u.month === currentMonth && u.year === currentYear
      )
  );

  const getLastUpdateDate = (personId: string): string => {
    const lastUpdate = [...data.monthlyUpdates]
      .filter((u) => u.personId === personId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
    return lastUpdate ? formatDateShort(lastUpdate.updatedAt) : "Never";
  };

  const sendReminder = (personId: string) => {
    const newMessage: AppMessage = {
      id: "msg" + Date.now(),
      fromRole: "hr",
      fromName: "HR",
      toPersonId: personId,
      body: REMINDER_BODY,
      date: new Date().toISOString(),
      read: false,
    };
    onDataChange("messages", [...data.messages, newMessage]);
    setSentIds([...sentIds, personId]);
  };

  const sendToAll = () => {
    const newMessages: AppMessage[] = overduePeople
      .filter((p) => !sentIds.includes(p.id))
      .map((person, idx) => ({
        id: "msg" + Date.now() + "-" + idx,
        fromRole: "hr" as const,
        fromName: "HR",
        toPersonId: person.id,
        body: REMINDER_BODY,
        date: new Date().toISOString(),
        read: false,
      }));

    onDataChange("messages", [...data.messages, ...newMessages]);
    setSentIds(overduePeople.map((p) => p.id));
  };

  if (overduePeople.length === 0) {
    return (
      <div>
        <h2 className="mb-6 text-lg font-medium">Reminders</h2>
        <div className="rounded-xl bg-[#d4edda] p-4 text-[13px] text-[#28a745]">
          All individuals are up to date for this month.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">Reminders</h2>

      <div className="mb-6 rounded-xl bg-[#fff3cd] px-4 py-3 text-[13px] text-[#856404]">
        {overduePeople.length} people overdue for this month's update
      </div>

      <div className="mb-8 flex flex-col gap-2">
        {overduePeople.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between rounded-xl border border-[#ffeaa7] bg-[#fff3cd] p-4"
          >
            <div>
              <div className="mb-1 text-[13px] font-medium text-black">{person.name}</div>
              <div className="text-xs text-[#666]">
                {person.department} · Last updated {getLastUpdateDate(person.id)}
              </div>
            </div>
            <div>
              {sentIds.includes(person.id) ? (
                <span className="text-[13px] text-[#28a745]">Sent</span>
              ) : (
                <button
                  onClick={() => sendReminder(person.id)}
                  className="rounded-lg bg-[#007bff] px-3.5 py-2 text-xs text-white"
                >
                  Send reminder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#e0e0e0] bg-[#f9f9f9] p-4">
        <div className="mb-2 text-[13px] font-medium">Send to all overdue</div>
        <div className="mb-3 text-xs text-[#666]">
          Send a reminder message to all {overduePeople.length} overdue individuals at once.
        </div>
        <button
          onClick={sendToAll}
          disabled={sentIds.length === overduePeople.length}
          className="rounded-lg px-4 py-2.5 text-[13px] text-white"
          style={{
            backgroundColor: sentIds.length === overduePeople.length ? "#ccc" : "#000",
            cursor: sentIds.length === overduePeople.length ? "not-allowed" : "pointer",
          }}
        >
          Send to all
        </button>
      </div>
    </div>
  );
}

export default Reminders;
