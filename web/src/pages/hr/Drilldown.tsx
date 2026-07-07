import { useState } from "react";
import type { AppData, HrComment } from "@/lib/types";
import { COMMIT_LEVELS, COMMIT_LABELS, COMMIT_STYLES, formatDate } from "@/lib/utilsApp";

interface DrilldownProps {
  data: AppData;
  selectedPersonId: string | null;
  onDataChange: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

function Drilldown({ data, selectedPersonId, onDataChange }: DrilldownProps) {
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  if (!selectedPersonId) {
    return (
      <div className="p-8 text-center text-[#666]">
        Select a person from the People list to view details
      </div>
    );
  }

  const person = data.people.find((p) => p.id === selectedPersonId);
  if (!person) {
    return <div className="p-8 text-center text-[#666]">Person not found</div>;
  }

  const personCommits = data.commits.filter((c) => c.personId === selectedPersonId);
  const personAchievements = data.achievements
    .filter((a) => a.personId === selectedPersonId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePostComment = (achievementId: string) => {
    const body = commentDrafts[achievementId]?.trim();
    if (!body) return;

    const newComment: HrComment = {
      id: "hrc" + Date.now(),
      achievementId,
      authorName: "HR",
      body,
      date: new Date().toISOString(),
    };

    onDataChange("hrComments", [...data.hrComments, newComment]);
    setCommentDrafts({ ...commentDrafts, [achievementId]: "" });
  };

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">{person.name}</h2>

      {/* Commitments */}
      <h3 className="mb-4 text-sm font-medium">Commitments</h3>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COMMIT_LEVELS.map((level) => {
          const levelCommits = personCommits.filter((c) => c.level === level);
          const style = COMMIT_STYLES[level];

          return (
            <div key={level}>
              <div
                className="mb-3 rounded-xl px-4 py-3 text-center text-[13px] font-medium"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {COMMIT_LABELS[level]}
              </div>
              <div className="min-h-[120px] rounded-xl border border-[#e0e0e0] bg-white p-3">
                {levelCommits.length > 0 ? (
                  levelCommits.map((commit) => (
                    <div key={commit.id} className="mb-2 text-xs leading-snug text-[#333]">
                      • {commit.statement}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#999]">None</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <h3 className="mb-4 text-sm font-medium">Achievements</h3>

      {personAchievements.length > 0 ? (
        <div className="flex flex-col gap-4">
          {personAchievements.map((achievement) => {
            const achievementComments = data.hrComments.filter(
              (c) => c.achievementId === achievement.id
            );
            const draft = commentDrafts[achievement.id] ?? "";

            return (
              <div key={achievement.id} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
                <div className="mb-2 text-[13px] font-medium">{achievement.title}</div>

                <div className="mb-2 flex gap-3 text-xs text-[#666]">
                  <span>{formatDate(achievement.date)}</span>
                  <span>•</span>
                  <span>Impact: {achievement.impactRating}/10</span>
                </div>

                <div className="mb-3 text-xs leading-relaxed text-[#666]">
                  {achievement.evidence}
                </div>

                {achievementComments.length > 0 && (
                  <div className="mb-3 border-t border-[#e0e0e0] pt-3">
                    {achievementComments.map((comment) => (
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

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={draft}
                    onChange={(e) =>
                      setCommentDrafts({ ...commentDrafts, [achievement.id]: e.target.value })
                    }
                    className="flex-1 rounded-lg border border-[#e0e0e0] px-3 py-2 text-xs outline-none focus:border-[#999]"
                  />
                  <button
                    onClick={() => handlePostComment(achievement.id)}
                    disabled={!draft.trim()}
                    className="rounded-lg px-4 py-2 text-xs text-white"
                    style={{
                      backgroundColor: draft.trim() ? "#000" : "#ccc",
                      cursor: draft.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Post
                  </button>
                </div>
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

export default Drilldown;
