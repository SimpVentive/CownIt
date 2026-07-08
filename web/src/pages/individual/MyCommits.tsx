import { useState } from "react";
import type { AppData, Commit, CommitLevel } from "@/lib/types";
import { COMMIT_LEVELS, COMMIT_LABELS } from "@/lib/utilsApp";

interface MyCommitsProps {
  data: AppData;
  currentUserId: string;
  onDataChange?: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

interface LevelConfig {
  level: CommitLevel;
  label: string;
  description: string;
  placeholder: string;
}

function MyCommits({ data, currentUserId, onDataChange }: MyCommitsProps) {
  const userCommits = data.commits.filter((c) => c.personId === currentUserId);
  const [addingLevel, setAddingLevel] = useState<CommitLevel | null>(null);
  const [input, setInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const levelConfigs: LevelConfig[] = [
    {
      level: "individual",
      label: "Self",
      description: "Personal development & growth",
      placeholder: "What's your next step for growth?",
    },
    {
      level: "hr",
      label: "Team / Department",
      description: "What you'll deliver to your team",
      placeholder: "What outcome will your team see from you?",
    },
    {
      level: "ceo",
      label: "Organisation",
      description: "Your contribution to organisational goals",
      placeholder: "How will you contribute to our organisation's success?",
    },
  ];

  const getCounts = () => {
    return {
      individual: userCommits.filter((c) => c.level === "individual").length,
      hr: userCommits.filter((c) => c.level === "hr").length,
      ceo: userCommits.filter((c) => c.level === "ceo").length,
    };
  };

  const counts = getCounts();
  const allValid = counts.individual >= 3 && counts.hr >= 3 && counts.ceo >= 3;

  const handleAdd = (level: CommitLevel) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const levelCommits = userCommits.filter((c) => c.level === level);
    if (levelCommits.length >= 3) {
      alert("Maximum 3 commitments per level");
      return;
    }

    const newCommit: Commit = {
      id: `c-${Date.now()}-${level}`,
      personId: currentUserId,
      level,
      statement: trimmed,
      createdAt: new Date().toISOString(),
    };

    onDataChange?.("commits", [...data.commits, newCommit]);
    setInput("");
    setAddingLevel(null);
  };

  const removeCommitment = (commitId: string) => {
    onDataChange?.("commits", data.commits.filter((c) => c.id !== commitId));
  };

  const handleSave = () => {
    if (!allValid) {
      alert("Please complete all 3 levels with at least 3 commitments each");
      return;
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-xl font-medium">Your commitments</h2>
      <p className="mb-6 text-xs text-[#666]">
        Set at least 3 commitments at each level. HR will be notified of any changes you make.
      </p>

      {/* Validation message */}
      {!allValid && (
        <div className="mb-6 rounded-lg bg-[#fce8e8] p-3 text-xs text-[#d4524f] border border-[#d4524f]">
          You need at least 3 commitments in each level before saving.
        </div>
      )}

      {/* Each level section */}
      <div className="space-y-6 mb-6">
        {levelConfigs.map((config) => {
          const levelCommits = userCommits.filter((c) => c.level === config.level);
          const count = levelCommits.length;
          const isAdding = addingLevel === config.level;

          return (
            <div
              key={config.level}
              className="rounded-xl border border-[#e0e0e0] bg-[#fafafa] p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-[#222]">{config.label}</h3>
                  <p className="text-xs text-[#666] mt-0.5">{config.description}</p>
                </div>
                <div
                  className="flex items-center gap-2 rounded-lg bg-[#f0f0f0] px-3 py-1.5 text-sm font-medium text-[#222]"
                  style={count < 3 ? { borderColor: "#d4524f", border: "1px solid" } : {}}
                >
                  <span>{count}</span>
                  <span className="text-[#999]">/ 3</span>
                  {count < 3 && <span className="text-lg text-[#d4524f] ml-1">⚠</span>}
                </div>
              </div>

              {/* Commitments list */}
              <div className="mb-3 flex flex-col gap-2">
                {levelCommits.map((commit) => (
                  <div
                    key={commit.id}
                    className="flex items-center justify-between rounded-lg border border-[#e0e0e0] bg-white px-3 py-2.5"
                  >
                    <p className="text-sm text-[#333] flex-1 m-0">{commit.statement}</p>
                    <button
                      onClick={() => removeCommitment(commit.id)}
                      className="text-[#999] hover:text-[#333] font-medium text-lg ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add form or button */}
              {isAdding ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full rounded-lg border border-[#d0d0d0] px-3 py-2.5 text-sm outline-none focus:border-[#1f77d4]"
                    autoFocus
                    onKeyPress={(e) => e.key === "Enter" && handleAdd(config.level)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdd(config.level)}
                      disabled={!input.trim()}
                      className="flex-1 rounded-lg bg-[#1f77d4] px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setAddingLevel(null);
                        setInput("");
                      }}
                      className="flex-1 rounded-lg border border-[#d0d0d0] bg-white px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#f9f9f9]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                count < 3 && (
                  <button
                    onClick={() => setAddingLevel(config.level)}
                    className="w-full rounded-lg border border-dashed border-[#bbb] py-2.5 text-sm text-[#666] hover:bg-[#f0f0f0]"
                  >
                    + Add another commitment
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* HR notification */}
      <div className="mb-6 rounded-lg bg-[#e8f0ff] border border-[#b3d9ff] p-3">
        <div className="text-xs font-medium text-[#0066cc] mb-1">🔔 HR notification:</div>
        <p className="text-xs text-[#0066cc] m-0">
          When you save, HR will be automatically notified of your commitments. If you update them in the future, they'll be notified of the changes.
        </p>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!allValid}
        className="w-full rounded-lg bg-[#1f77d4] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        Save commitments
      </button>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50">
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f5e9] mx-auto">
              <span className="text-xl">✓</span>
            </div>
            <h3 className="mb-2 font-medium text-[#222]">Commitments saved</h3>
            <p className="mb-4 text-xs text-[#666]">
              Saved at{" "}
              <span className="font-medium">
                {new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
            <div className="mb-4 rounded-lg bg-[#e8f5e9] border border-[#c8e6c9] p-3">
              <p className="text-xs text-[#2e7d32] m-0">
                <strong>🔔 HR notified:</strong> Your manager and HR team have been sent a notification about your commitments.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-lg bg-[#1f77d4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1565b8]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCommits;
