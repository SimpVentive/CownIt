import { useState } from "react";
import type { AppData, AppMessage } from "@/lib/types";
import { formatDate } from "@/lib/utilsApp";

interface CeoMessageProps {
  data: AppData;
  onDataChange: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

function CeoMessage({ data, onDataChange }: CeoMessageProps) {
  const [recipientId, setRecipientId] = useState<string>(data.people[0]?.id ?? "");
  const [messageBody, setMessageBody] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  const getPersonName = (personId: string): string =>
    data.people.find((p) => p.id === personId)?.name ?? "Unknown";

  const getPersonDept = (personId: string): string =>
    data.people.find((p) => p.id === personId)?.department ?? "";

  const canSend = messageBody.trim().length >= 5;

  const handleSend = () => {
    if (!canSend) return;

    const newMessage: AppMessage = {
      id: "msg" + Date.now(),
      fromRole: "ceo",
      fromName: "CEO",
      toPersonId: recipientId,
      body: messageBody.trim(),
      date: new Date().toISOString(),
      read: false,
    };

    onDataChange("messages", [...data.messages, newMessage]);
    setMessageBody("");
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  const ceoMessages = data.messages
    .filter((m) => m.fromRole === "ceo")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-[600px]">
      <h2 className="mb-6 text-lg font-medium">Send message</h2>

      {/* Form */}
      <div className="mb-8 rounded-xl border border-[#e0e0e0] bg-white p-4">
        <div className="mb-5">
          <label className="mb-2 block text-[13px] font-medium">To</label>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2.5 text-[13px] outline-none"
          >
            {data.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} — {person.department}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-[13px] font-medium">Message</label>
          <textarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Your message..."
            className="min-h-[100px] w-full resize-y rounded-lg border border-[#e0e0e0] px-3 py-2.5 text-[13px] outline-none focus:border-[#999]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-lg px-4 py-2.5 text-[13px] text-white"
            style={{
              backgroundColor: canSend ? "#000" : "#ccc",
              cursor: canSend ? "pointer" : "not-allowed",
            }}
          >
            Send
          </button>
          {sent && <span className="text-[13px] text-[#28a745]">Message sent</span>}
        </div>
      </div>

      {/* Sent messages */}
      {ceoMessages.length > 0 && (
        <>
          <h3 className="mb-4 text-sm font-medium">Sent messages</h3>
          <div className="flex flex-col gap-3">
            {ceoMessages.map((message) => (
              <div key={message.id} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
                <div className="mb-2 text-xs font-medium text-[#007bff]">
                  To: {getPersonName(message.toPersonId)} — {getPersonDept(message.toPersonId)}
                </div>
                <div className="mb-2 text-[13px] leading-relaxed text-[#333]">{message.body}</div>
                <div className="text-xs text-[#999]">{formatDate(message.date)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CeoMessage;
