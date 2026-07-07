import type { AppData } from "@/lib/types";
import { formatDate } from "@/lib/utilsApp";

interface MessagesProps {
  data: AppData;
  currentUserId: string;
}

function Messages({ data, currentUserId }: MessagesProps) {
  const userMessages = data.messages
    .filter((m) => m.toPersonId === currentUserId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">Messages</h2>

      {userMessages.length > 0 ? (
        <div className="flex flex-col gap-3">
          {userMessages.map((message) => (
            <div key={message.id} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
              <div className="mb-2 text-[13px] font-medium text-black">
                From: {message.fromName} ({message.fromRole.toUpperCase()})
              </div>
              <div className="mb-3 text-[13px] leading-relaxed text-[#333]">{message.body}</div>
              <div className="text-xs text-[#999]">
                {formatDate(message.date)}
                {message.read && " · Read"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#e0e0e0] bg-white p-8 text-center text-[13px] text-[#999]">
          No messages yet
        </div>
      )}
    </div>
  );
}

export default Messages;
