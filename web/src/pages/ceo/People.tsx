import type { AppData } from "@/lib/types";
import { computeHealthScore, formatDate } from "@/lib/utilsApp";

interface CeoPeopleProps {
  data: AppData;
}

function CeoPeople({ data }: CeoPeopleProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

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

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">People view</h2>

      <div className="flex flex-col gap-3">
        {data.people.map((person) => {
          const commitCount = commits.filter(
            (c) => c.personId === person.id
          ).length;

          const achievementCount = achievements.filter(
            (a) => a.personId === person.id
          ).length;

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
                <span>{commitCount} commits</span>
                <span>•</span>
                <span>{achievementCount} achievements</span>
                <span>•</span>
                <span>Health: {healthScore}/100</span>
                <span>•</span>
                <span>Last active: {getLastActive(person.id)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CeoPeople;