import { useState } from "react";
import type { AppData } from "@/lib/types";
import { computeHealthScore, formatDate } from "@/lib/utilsApp";

interface CeoPeopleProps {
  data: AppData;
}

function CeoPeople({ data }: CeoPeopleProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [modalType, setModalType] = useState<"commits" | "achievements" | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // Safe defaults
  const commits = data.commits ?? [];
  const monthlyUpdates = data.monthlyUpdates ?? [];
  const achievements = data.achievements ?? [];

  const getLastActive = (personId: string): string => {
    const updateDates = monthlyUpdates
      .filter((u) => u.personId === personId)
      .map((u) => new Date(u.updatedAt).getTime());

    const achievementDates = achievements
      .filter((a) => a.personId === personId)
      .map((a) => new Date(a.date).getTime());

    const allDates = [...updateDates, ...achievementDates];

    if (allDates.length === 0) return "No activity";

    return formatDate(new Date(Math.max(...allDates)).toISOString());
  };

  const openModal = (type: "commits" | "achievements", personId: string) => {
    setModalType(type);
    setSelectedPersonId(personId);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPersonId(null);
  };

  const selectedPerson = selectedPersonId ? data.people.find((p) => p.id === selectedPersonId) : null;
  const personCommits = selectedPersonId ? commits.filter((c) => c.personId === selectedPersonId) : [];
  const personAchievements = selectedPersonId ? achievements.filter((a) => a.personId === selectedPersonId) : [];

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">People view</h2>

      <div className="flex flex-col gap-3">
        {data.people.map((person) => {
          const commitCount = commits.filter((c) => c.personId === person.id).length;
          const achievementCount = achievements.filter((a) => a.personId === person.id).length;
          const healthScore = computeHealthScore(person.id, data);
          const isUpdated = monthlyUpdates.some(
            (u) =>
              u.personId === person.id &&
              u.month === currentMonth &&
              u.year === currentYear
          );

          return (
            <div
              key={person.id}
              className="rounded-xl border border-[#e0e0e0] bg-white p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="mb-1 text-[13px] font-medium">
                    {person.name}
                  </div>
                  <div className="text-xs text-[#666]">
                    {person.department}
                  </div>
                </div>

                <span
                  className="rounded-lg px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    backgroundColor: isUpdated ? "#d4edda" : "#f8d7da",
                    color: isUpdated ? "#28a745" : "#dc3545",
                  }}
                >
                  {isUpdated ? "Current" : "Overdue"}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-[#e0e0e0] pt-3 text-xs text-[#666]">
                <button
                  onClick={() => openModal("commits", person.id)}
                  className="cursor-pointer font-medium text-[#0066cc] hover:underline"
                >
                  {commitCount} commits
                </button>
                <span>•</span>
                <button
                  onClick={() => openModal("achievements", person.id)}
                  className="cursor-pointer font-medium text-[#0066cc] hover:underline"
                >
                  {achievementCount} achievements
                </button>
                <span>•</span>
                <span>Health: {healthScore}/100</span>
                <span>•</span>
                <span>Last active: {getLastActive(person.id)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Commits Modal */}
      {modalType === "commits" && selectedPerson && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50 p-4">
          <div className="w-full max-w-2xl max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e0e0e0] bg-white px-6 py-4">
              <h3 className="font-medium text-[#222]">
                {selectedPerson.name}'s Commitments
              </h3>
              <button
                onClick={closeModal}
                className="text-xl text-[#999] hover:text-[#222]"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              {personCommits.length > 0 ? (
                personCommits.map((commit) => (
                  <div key={commit.id} className="rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] p-4">
                    <div className="mb-2 text-sm font-medium text-[#222]">
                      {commit.statement}
                    </div>
                    <div className="text-xs text-[#999]">
                      {formatDate(commit.createdAt)} • {commit.level.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#999]">No commitments yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {modalType === "achievements" && selectedPerson && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50 p-4">
          <div className="w-full max-w-2xl max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#e0e0e0] bg-white px-6 py-4">
              <h3 className="font-medium text-[#222]">
                {selectedPerson.name}'s Achievements
              </h3>
              <button
                onClick={closeModal}
                className="text-xl text-[#999] hover:text-[#222]"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              {personAchievements.length > 0 ? (
                personAchievements.map((achievement) => (
                  <div key={achievement.id} className="rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] p-4">
                    <div className="mb-1 text-sm font-medium text-[#222]">
                      {achievement.title}
                    </div>
                    <div className="mb-2 text-xs text-[#666] leading-relaxed">
                      {achievement.evidence}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-[#999]">
                      <span>{formatDate(achievement.date)}</span>
                      <span>•</span>
                      <span>Impact: {achievement.impactRating}/10</span>
                      <span>•</span>
                      <span>{achievement.cpqsdp.join(", ")}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#999]">No achievements yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CeoPeople;