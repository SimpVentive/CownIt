import { useState } from "react";
import { Users, Zap, TrendingUp, CheckCircle } from "lucide-react";
import type { AppData, Dim } from "@/lib/types";
import { CPQSDP_DIMS, formatDate } from "@/lib/utilsApp";

interface DashboardProps {
  data: AppData;
}

const STAT_ICONS = {
  people: Users,
  achievements: Zap,
  impact: TrendingUp,
  updated: CheckCircle,
};

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
      icon: STAT_ICONS.people,
      bg: "#E3F2FD",
      color: "#1976D2",
    },
    {
      label: "Total achievements",
      value: String(totalAchievements),
      sub: "since programme start",
      icon: STAT_ICONS.achievements,
      bg: "#FFF3E0",
      color: "#F57C00",
    },
    {
      label: "Avg impact score",
      value: avgImpact,
      sub: "self-rated / 10",
      icon: STAT_ICONS.impact,
      bg: "#E8F5E9",
      color: "#388E3C",
    },
    {
      label: "Updated this month",
      value: `${updatedCount}/${totalPeople}`,
      sub: "individuals",
      icon: STAT_ICONS.updated,
      bg: "#F3E5F5",
      color: "#7B1FA2",
    },
  ];

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold text-[#0B1F3A]">Dashboard</h2>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border-2 border-[#e0e0e0] bg-white p-5 transition hover:shadow-lg hover:border-[#999]"
              style={{ borderLeftWidth: "4px", borderLeftColor: stat.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg p-2.5" style={{ backgroundColor: stat.bg }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-xs font-medium text-[#999] uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="mt-2 mb-1 text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-[#999]">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* CPQSDP */}
      <h3 className="mb-6 text-xl font-bold text-[#0B1F3A]">Impact Dimensions</h3>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CPQSDP_DIMS.map((dim) => {
          const score = cpqsdpScore(dim.key);
          const isScore = score !== "—";
          const scoreNum = isScore ? parseFloat(score) : 0;

          return (
            <button
              key={dim.key}
              onClick={() => setSelectedDim(dim.key)}
              className="group relative rounded-xl border-2 border-[#e0e0e0] bg-white p-6 text-left transition duration-200 hover:border-[#999] hover:shadow-xl"
              style={{ borderTopColor: dim.color, borderTopWidth: "3px" }}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-5" style={{ backgroundColor: dim.color }} />
              <div className="relative">
                <div className="mb-3 text-xs font-semibold text-[#999] uppercase tracking-wider">
                  {dim.label}
                </div>
                <div
                  className="mb-3 text-3xl font-bold"
                  style={{ color: dim.color }}
                >
                  {score}
                </div>
                {isScore && (
                  <>
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(scoreNum / 10) * 100}%`,
                          backgroundColor: dim.color,
                        }}
                      />
                    </div>
                    <div className="text-xs text-[#999]">{(scoreNum / 10 * 100).toFixed(0)}% of max</div>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent achievements */}
      <h3 className="mb-6 text-xl font-bold text-[#0B1F3A]">Recent Achievements</h3>

      {recentAchievements.length > 0 ? (
        <div className="flex flex-col gap-3">
          {recentAchievements.map((achievement) => {
            const person = data.people.find((p) => p.id === achievement.personId);
            const isHighImpact = achievement.impactRating >= 8;
            const isMediumImpact = achievement.impactRating >= 5;

            return (
              <div
                key={achievement.id}
                className="group relative rounded-xl border-2 border-[#e0e0e0] bg-white p-5 transition duration-200 hover:shadow-lg hover:border-[#999]"
                style={{
                  borderLeftColor: isHighImpact ? "#2E7D32" : isMediumImpact ? "#F57C00" : "#1976D2",
                  borderLeftWidth: "4px",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-[#0B1F3A]">
                      {achievement.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#999]">
                      <span className="font-medium text-[#333]">{person?.name}</span>
                      <span>•</span>
                      <span>{formatDate(achievement.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {achievement.cpqsdp.map((dim) => {
                          const dimObj = CPQSDP_DIMS.find((d) => d.key === dim);
                          return (
                            <span
                              key={dim}
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: dimObj?.color }}
                            />
                          );
                        })}
                      </span>
                    </div>
                  </div>
                  <div
                    className="ml-3 flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                    style={{
                      backgroundColor: isHighImpact ? "#2E7D32" : isMediumImpact ? "#F57C00" : "#1976D2",
                    }}
                  >
                    {achievement.impactRating}/10
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] p-8 text-center text-[13px] text-[#999]">
          No achievements logged yet
        </div>
      )}

      {/* Dimension Breakdown Modal */}
      {selectedDim && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-96 overflow-y-auto rounded-2xl bg-white shadow-2xl">
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
                  <div className="sticky top-0 flex items-center justify-between border-b-2 px-6 py-5" style={{ borderBottomColor: dim?.color, backgroundColor: dim?.color + "08" }}>
                    <div>
                      <h3 className="font-bold text-lg text-[#0B1F3A]">{dim?.label} Breakdown</h3>
                      <p className="text-sm text-[#666] mt-2">
                        Average score: <span className="font-bold text-lg" style={{ color: dim?.color }}>
                          {score}
                        </span> <span className="text-[#999]">/ 10</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDim(null)}
                      className="text-2xl text-[#999] hover:text-[#222] transition"
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
                              className="rounded-lg border-2 border-[#e0e0e0] bg-white p-4 transition hover:shadow-md"
                              style={{ borderLeftColor: dim?.color, borderLeftWidth: "4px" }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-[#0B1F3A]">
                                    {achievement.title}
                                  </div>
                                  <div className="text-xs text-[#666] mt-1">
                                    <span className="font-medium">{person?.name}</span> • {formatDate(achievement.date)}
                                  </div>
                                </div>
                                <div
                                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-white ml-3 flex-shrink-0"
                                  style={{ backgroundColor: dim?.color }}
                                >
                                  {achievement.impactRating}/10
                                </div>
                              </div>
                              <p className="text-xs text-[#666] mb-2 leading-relaxed">
                                {achievement.evidence}
                              </p>
                              <div className="text-xs text-[#999]">
                                <span className="font-medium">Impacts:</span> {achievement.cpqsdp.join(", ")}
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-8 text-[#999]">
                        No achievements for this dimension yet
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
