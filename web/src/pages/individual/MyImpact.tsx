import type { AppData } from "@/lib/types";
import { CPQSDP_COLORS, formatDate } from "@/lib/utilsApp";

interface MyImpactProps {
  data: AppData;
  currentUserId: string;
}

function MyImpact({ data, currentUserId }: MyImpactProps) {
  const userAchievements = data.achievements
    .filter((a) => a.personId === currentUserId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const avgRating =
    userAchievements.length > 0
      ? (
          userAchievements.reduce((sum, a) => sum + a.impactRating, 0) / userAchievements.length
        ).toFixed(1)
      : "—";

  const uniqueDims = new Set<string>();
  userAchievements.forEach((a) => a.cpqsdp.forEach((d) => uniqueDims.add(d)));
  const dimsCovered = `${uniqueDims.size}/6`;

  const stats = [
    { label: "Achievements logged", value: String(userAchievements.length) },
    { label: "Avg impact rating", value: avgRating },
    { label: "Dimensions covered", value: dimsCovered },
  ];

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">My impact</h2>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
            <div className="mb-2 text-xs text-[#666]">{stat.label}</div>
            <div className="text-2xl font-medium">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <h3 className="mb-4 text-sm font-medium">Achievements</h3>

      {userAchievements.length > 0 ? (
        <div className="flex flex-col gap-3">
          {userAchievements.map((achievement) => {
            const comments = data.hrComments.filter(
              (c) => c.achievementId === achievement.id
            );

            return (
              <div key={achievement.id} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
                <div className="mb-2 text-[13px] font-medium">{achievement.title}</div>

                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-[#666]">
                  <span>{formatDate(achievement.date)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {achievement.cpqsdp.map((dim) => (
                      <span
                        key={dim}
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: CPQSDP_COLORS[dim] }}
                      />
                    ))}
                    <span className="ml-1">{achievement.cpqsdp.join(", ")}</span>
                  </span>
                  <span>•</span>
                  <span>Impact: {achievement.impactRating}/10</span>
                </div>

                <div className="mb-3 text-xs leading-relaxed text-[#666]">
                  {achievement.evidence}
                </div>

                {achievement.fileAttachment && (
                  <div className="mb-3 text-xs text-[#999]">
                    Attachment: {achievement.fileAttachment}
                  </div>
                )}

                {comments.length > 0 && (
                  <div className="border-t border-[#e0e0e0] pt-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="mb-2 rounded-lg border-l-2 border-l-[#007bff] bg-[#f9f9f9] p-3"
                      >
                        <div className="mb-1 text-xs font-medium text-[#007bff]">HR comment</div>
                        <div className="mb-1 text-xs text-[#666]">{comment.body}</div>
                        <div className="text-[11px] text-[#999]">
                          {comment.authorName} · {formatDate(comment.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[#e0e0e0] bg-white p-8 text-center text-[13px] text-[#999]">
          No achievements logged yet
        </div>
      )}
    </div>
  );
}

export default MyImpact;
