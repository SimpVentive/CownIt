import { useState } from "react";
import type { AppData, Dim } from "@/lib/types";
import { CPQSDP_DIMS, formatDate } from "@/lib/utilsApp";

interface DashboardProps {
  data: AppData;
}

function Dashboard({ data }: DashboardProps) {
  const [selectedDim, setSelectedDim] = useState<Dim | null>(null);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalPeople = data.people.length;
  const totalAchievements = data.achievements.length;
  const avgImpact =
    totalAchievements > 0
      ? (
          data.achievements.reduce((sum, a) => sum + a.impactRating, 0) / totalAchievements
        ).toFixed(1)
      : "—";

  const updatedCount = data.people.filter((p) =>
    (data.monthlyUpdates ?? []).some(
      (u) =>
        u.personId === p.id &&
        u.month === currentMonth &&
        u.year === currentYear
    )
  ).length;

  const uniqueDepts = new Set(data.people.map((p) => p.department)).size;

  const cpqsdpScore = (dim: Dim): string => {
    const withDim = data.achievements.filter((a) => a.cpqsdp.includes(dim));
    if (withDim.length === 0) return "—";
    return (withDim.reduce((sum, a) => sum + a.impactRating, 0) / withDim.length).toFixed(1);
  };

  const recentAchievements = [...data.achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "People committed",
      value: String(totalPeople),
      sub: `across ${uniqueDepts} department${uniqueDepts !== 1 ? "s" : ""}`,
    },
    { label: "Total achievements", value: String(totalAchievements), sub: "since programme start" },
    { label: "Avg impact score", value: avgImpact, sub: "self-rated / 10" },
    { label: "Updated this month", value: `${updatedCount}/${totalPeople}`, sub: "individuals" },
  ];

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">Dashboard</h2>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
            <div className="mb-2 text-xs text-[#666]">{stat.label}</div>
            <div className="mb-1 text-2xl font-medium">{stat.value}</div>
            <div className="text-[11px] text-[#999]">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* CPQSDP */}
      <h3 className="mb-4 text-sm font-medium">CPQSDP impact scores</h3>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CPQSDP_DIMS.map((dim) => {
          const score = cpqsdpScore(dim.key);
          const isScore = score !== "—";

          return (
            <button
              key={dim.key}
              onClick={() => setSelectedDim(dim.key)}
              className="rounded-xl border border-[#e0e0e0] bg-white p-4 text-left transition hover:border-[#999] hover:shadow-md"
            >
              <div className="mb-2 text-xs text-[#666]">{dim.label}</div>
              <div className="mb-2 text-xl font-medium cursor-pointer" style={{ color: dim.color }}>
                {score}
              </div>
              {isScore && (
                <div className="h-[3px] w-full overflow-hidden rounded-sm bg-[#e0e0e0]">
                  <div
                    className="h-full"
                    style={{
                      width: `${(parseFloat(score) / 10) * 100}%`,
                      backgroundColor: dim.color,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Recent achievements */}
      <h3 className="mb-4 text-sm font-medium">Recent achievements</h3>

      {recentAchievements.length > 0 ? (
        <div className="flex flex-col gap-3">
          {recentAchievements.map((achievement) => {
            const person = data.people.find((p) => p.id === achievement.personId);
            return (
              <div key={achievement.id} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-1 text-[13px] font-medium">{achievement.title}</div>
                    <div className="text-xs text-[#666]">
                      By {person?.name} · {formatDate(achievement.date)}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#f9f9f9] px-2.5 py-1 text-xs font-medium">
                    {achievement.impactRating}/10
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[#e0e0e0] bg-white p-8 text-center text-[13px] text-[#999]">
          No achievements yet
        </div>
      )}

      {/* Dimension Breakdown Modal */}
      {selectedDim && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50 p-4">
          <div className="w-full max-w-2xl max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg">
            {(() => {
              const dim = CPQSDP_DIMS.find((d) => d.key === selectedDim);
              const achievementsWithDim = data.achievements.filter((a) =>
                a.cpqsdp.includes(selectedDim)
              );
              const score =
                achievementsWithDim.length > 0
                  ? (
                      achievementsWithDim.reduce((sum, a) => sum + a.impactRating, 0) /
                      achievementsWithDim.length
                    ).toFixed(1)
                  : "—";

              return (
                <>
                  <div className="sticky top-0 flex items-center justify-between border-b border-[#e0e0e0] bg-white px-6 py-4">
                    <div>
                      <h3 className="font-medium text-[#222]">{dim?.label} Breakdown</h3>
                      <p className="text-sm text-[#999] mt-1">
                        Average score: <span className="font-medium" style={{ color: dim?.color }}>
                          {score}
                        </span> / 10
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDim(null)}
                      className="text-xl text-[#999] hover:text-[#222]"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6 space-y-3">
                    {achievementsWithDim.length > 0 ? (
                      achievementsWithDim
                        .sort((a, b) => b.impactRating - a.impactRating)
                        .map((achievement) => {
                          const person = data.people.find((p) => p.id === achievement.personId);
                          return (
                            <div
                              key={achievement.id}
                              className="rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-[#222]">
                                    {achievement.title}
                                  </div>
                                  <div className="text-xs text-[#666] mt-1">
                                    {person?.name} • {formatDate(achievement.date)}
                                  </div>
                                </div>
                                <div
                                  className="rounded-lg px-2.5 py-1 text-xs font-medium text-white ml-3 flex-shrink-0"
                                  style={{ backgroundColor: dim?.color }}
                                >
                                  {achievement.impactRating}/10
                                </div>
                              </div>
                              <p className="text-xs text-[#666] mb-2 leading-relaxed">
                                {achievement.evidence}
                              </p>
                              <div className="text-xs text-[#999]">
                                Impacts: {achievement.cpqsdp.join(", ")}
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-8 text-[#999]">
                        No achievements for this dimension
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
