import { useState } from "react";
import type { AppData, Commit, CommitLevel } from "@/lib/types";
import { COMMIT_LEVELS, COMMIT_LABELS, COMMIT_STYLES } from "@/lib/utilsApp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";

interface MyCommitsProps {
  data: AppData;
  currentUserId: string;
  onDataChange?: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

function MyCommits({ data, currentUserId, onDataChange }: MyCommitsProps) {
  const { toast } = useToast();
  const userCommits = data.commits.filter((c) => c.personId === currentUserId);
  const [addingLevel, setAddingLevel] = useState<CommitLevel | null>(null);
  const [statement, setStatement] = useState("");

  const handleAdd = (level: CommitLevel) => {
    const trimmed = statement.trim();
    if (!trimmed) return;

    const levelCommits = userCommits.filter((c) => c.level === level);
    if (levelCommits.length >= 3) {
      toast({
        title: "Limit reached",
        description: "You can only have up to 3 commitments per level.",
        variant: "destructive",
      });
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
    setStatement("");
    setAddingLevel(null);
    toast({
      title: "Commitment added",
      description: `Added to ${COMMIT_LABELS[level]}.`,
    });
  };

  const handleCancel = () => {
    setStatement("");
    setAddingLevel(null);
  };

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">My commitments</h2>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COMMIT_LEVELS.map((level) => {
          const levelCommits = userCommits.filter((c) => c.level === level);
          const style = COMMIT_STYLES[level];
          const isAdding = addingLevel === level;
          const canAdd = levelCommits.length < 3;

          return (
            <div key={level}>
              <div
                className="mb-3 rounded-xl px-4 py-3 text-center text-[13px] font-medium"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {COMMIT_LABELS[level]}
              </div>

              <div className="min-h-[200px] rounded-xl border border-[#e0e0e0] bg-white p-4">
                <div className="flex flex-col gap-2">
                  {levelCommits.length > 0 ? (
                    levelCommits.map((commit) => (
                      <div
                        key={commit.id}
                        className="rounded-lg bg-[#f9f9f9] p-2 text-xs leading-relaxed text-[#333]"
                      >
                        {commit.statement}
                      </div>
                    ))
                  ) : (
                    <div className="pt-10 text-center text-[13px] text-[#999]">
                      No commitments yet
                    </div>
                  )}

                  {isAdding ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <Input
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        placeholder="Enter commitment statement"
                        className="h-9 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAdd(level);
                          if (e.key === "Escape") handleCancel();
                        }}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="h-8 flex-1 bg-[#0F1E3D] text-xs hover:bg-[#1a2e55]"
                          onClick={() => handleAdd(level)}
                          disabled={!statement.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 flex-1 text-xs"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    canAdd && (
                      <button
                        onClick={() => setAddingLevel(level)}
                        className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#ccc] py-2 text-[13px] text-[#666] transition hover:border-[#0F6E56] hover:text-[#0F6E56]"
                      >
                        <Plus className="h-4 w-4" />
                        Add commitment
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-[#f9f9f9] p-4 text-[13px] leading-relaxed text-[#666]">
        <p className="mb-2 font-semibold">About commitments:</p>
        <p>
          You can set up to 3 commitments per level. Log achievements against any commitment at any
          time. There is no deadline — commitments are open-ended and accumulate over time.
        </p>
      </div>
    </div>
  );
}

export default MyCommits;
