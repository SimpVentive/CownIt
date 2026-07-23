import { useState } from "react";
import type { AppData, Achievement, CommitLevel, Dim } from "@/lib/types";
import { COMMIT_LEVELS, COMMIT_LABELS, CPQSDP_DIMS } from "@/lib/utilsApp";

interface LogAchievementProps {
  data: AppData;
  currentUserId: string;
  onDataChange: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

interface DimensionData {
  rating: number;
  why: string;
  evidence: string;
  file: string | null;
}

function LogAchievement({ data, currentUserId, onDataChange }: LogAchievementProps) {
  const [selectedLevel, setSelectedLevel] = useState<CommitLevel | null>(null);
  const [selectedCommitId, setSelectedCommitId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedDims, setSelectedDims] = useState<Dim[]>([]);
  const [dimensionData, setDimensionData] = useState<Record<Dim, DimensionData>>({} as Record<Dim, DimensionData>);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const userCommits = data.commits.filter((c) => c.personId === currentUserId);
  const levelCommits = selectedLevel ? userCommits.filter((c) => c.level === selectedLevel) : [];
  const selectedCommit = selectedCommitId ? userCommits.find((c) => c.id === selectedCommitId) : null;

  const updateDimensionData = (dim: Dim, field: keyof DimensionData, value: any) => {
    setDimensionData((prev) => ({
      ...prev,
      [dim]: { ...prev[dim], [field]: value },
    }));
  };

  const handleLevelChange = (level: CommitLevel) => {
    setSelectedLevel(level);
    setSelectedCommitId("");
  };

  const toggleDimension = (dim: Dim) => {
    setSelectedDims((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
    if (!selectedDims.includes(dim)) {
      setDimensionData((prev) => ({
        ...prev,
        [dim]: { rating: 5, why: "", evidence: "", file: null },
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!selectedLevel || !selectedCommitId || !title.trim() || selectedDims.length === 0) {
      return false;
    }
    for (const dim of selectedDims) {
      const data = dimensionData[dim];
      if (!data || !data.why.trim() || !data.evidence.trim()) {
        return false;
      }
    }
    return true;
  };

  const saveDraft = () => {
    if (!selectedLevel || !selectedCommitId || !title.trim()) {
      alert("Please fill in: commitment level, select a commitment, and achievement title");
      return;
    }
    setSuccessMsg("Draft saved");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const submitAchievement = () => {
    if (!validateForm()) {
      alert("Please complete all required fields");
      return;
    }

    const newAchievement: Achievement = {
      id: "a" + Date.now(),
      personId: currentUserId,
      commitId: selectedCommitId,
      title: title.trim(),
      evidence: Object.values(dimensionData)
        .map((d) => d.evidence)
        .join("\n"),
      cpqsdp: selectedDims,
      impactRating: Math.round(
        selectedDims.reduce((sum, dim) => sum + (dimensionData[dim]?.rating || 0), 0) / selectedDims.length
      ),
      date: new Date().toISOString(),
      fileAttachment: Object.values(dimensionData).find((d) => d.file)?.file || null,
    };

    onDataChange("achievements", [...data.achievements, newAchievement]);
    setSuccessMsg("Achievement submitted");
    setShowSuccess(true);
    resetForm();
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const resetForm = () => {
    setSelectedLevel(null);
    setSelectedCommitId("");
    setTitle("");
    setSelectedDims([]);
    setDimensionData({} as Record<Dim, DimensionData>);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-xl font-medium">Log your achievement</h2>
      <p className="mb-6 text-xs text-[#666]">Record progress against your commitments</p>

      {/* Level Selection */}
      <div className="mb-6">
        <label className="mb-3 block text-sm font-medium">Against which commitment are you logging your progress?</label>
        <div className="grid grid-cols-3 gap-3">
          {COMMIT_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className="rounded-lg border-2 py-3 px-4 text-sm font-medium transition-all"
              style={{
                borderColor: selectedLevel === level ? "#1f77d4" : "#e0e0e0",
                backgroundColor: selectedLevel === level ? "#f0f7ff" : "white",
                color: selectedLevel === level ? "#1f77d4" : "#666",
              }}
            >
              {COMMIT_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Commitments Selection */}
      {selectedLevel && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium">Select your commitment</label>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg border border-[#d0d0d0] bg-white px-3 py-1.5 text-xs font-medium text-[#666] hover:bg-[#f0f0f0]"
            >
              👁 View all
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {levelCommits.map((commit) => (
              <button
                key={commit.id}
                onClick={() => setSelectedCommitId(commit.id)}
                className="rounded-lg border px-3 py-2.5 text-left text-sm transition-all"
                style={{
                  borderColor: selectedCommitId === commit.id ? "#1f77d4" : "#e0e0e0",
                  backgroundColor: selectedCommitId === commit.id ? "#f0f7ff" : "white",
                }}
              >
                <p className="m-0 text-[13px]">{commit.statement}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Title */}
      {selectedCommit && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">What did you achieve?</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title of your achievement"
            className="w-full rounded-lg border border-[#d0d0d0] px-3 py-3 text-sm outline-none focus:border-[#1f77d4] focus:ring-2 focus:ring-[#e8f0ff]"
          />
          <p className="mt-1 text-xs text-[#999]">Be specific and action-oriented</p>
        </div>
      )}

      {/* Impact Dimensions */}
      {title && (
        <div className="mb-6 rounded-xl border-2 border-[#ffc107] bg-[#fff9e6] p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div className="text-sm font-medium text-[#856404]">What dimensions does this impact?</div>
          </div>
          <p className="mb-3 text-xs text-[#856404]">Select dimensions and provide impact rating, reasoning, evidence & supporting file for each</p>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {CPQSDP_DIMS.map((dim) => {
              const selected = selectedDims.includes(dim.key);
              return (
                <label key={dim.key} className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-[#fde7a0] bg-white p-2.5 transition-all" style={{ backgroundColor: selected ? "#fffbf0" : "white", borderColor: selected ? "#ffc107" : "#fde7a0" }}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleDimension(dim.key)}
                    className="h-4 w-4"
                  />
                  <span className="text-xs font-medium">{dim.key}</span>
                </label>
              );
            })}
          </div>

          {/* Per-Dimension Cards */}
          {selectedDims.map((dim) => {
            const dimLabel = CPQSDP_DIMS.find((d) => d.key === dim);
            const data = dimensionData[dim] || { rating: 5, why: "", evidence: "", file: null };
            return (
              <div key={dim} className="mb-3 rounded-lg border border-[#fde7a0] bg-white p-3">
                <div className="mb-3 flex items-center justify-between border-b border-[#f0e0a0] pb-2">
                  <span className="text-sm font-medium">{dimLabel?.label}</span>
                  <span className="text-lg font-bold text-[#ff6b35]">{data.rating}</span>
                </div>

                <div className="mb-3">
                  <div className="mb-2 flex items-center gap-2 text-xs text-[#999]">
                    <span>1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={data.rating}
                      onChange={(e) => updateDimensionData(dim, "rating", parseInt(e.target.value))}
                      className="flex-1"
                      style={{
                        background: `linear-gradient(to right, #ff6b6b 0%, #ffc107 50%, #4caf50 100%)`,
                        height: "6px",
                      }}
                    />
                    <span>10</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#999]">
                    <span>Low impact</span>
                    <span>High impact</span>
                  </div>
                </div>

                <label className="mb-2 block text-xs font-medium text-[#333]">What is the expected impact?</label>
                <textarea
                  value={data.why}
                  onChange={(e) => updateDimensionData(dim, "why", e.target.value)}
                  placeholder="e.g., 'Saved 20 hrs/week...'"
                  className="mb-2 w-full resize-none rounded-lg border border-[#ddd] px-2.5 py-2 text-xs outline-none focus:border-[#1f77d4]"
                  style={{ minHeight: "60px" }}
                />

                <label className="mb-2 block text-xs font-medium text-[#333]">Evidence / notes</label>
                <textarea
                  value={data.evidence}
                  onChange={(e) => updateDimensionData(dim, "evidence", e.target.value)}
                  placeholder="e.g., 'Finance report, CFO approval'"
                  className="mb-2 w-full resize-none rounded-lg border border-[#ddd] px-2.5 py-2 text-xs outline-none focus:border-[#1f77d4]"
                  style={{ minHeight: "60px" }}
                />

                <label className="mb-1 block text-xs font-medium text-[#333]">Attach supporting document (optional)</label>
                <input
                  type="file"
                  onChange={(e) => updateDimensionData(dim, "file", e.target.files?.[0]?.name || null)}
                  className="w-full text-xs"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Buttons */}
      {selectedCommit && title && (
        <div className="mb-6 border-t pt-4">
          <div className="mb-4 rounded-lg bg-[#e8f0ff] border-2 border-[#b3d9ff] p-3">
            <div className="mb-1 text-xs font-medium text-[#0066cc]">🔔 HR notification:</div>
            <p className="m-0 text-xs text-[#0066cc]">When you save, HR will be automatically notified of your achievements. If you update them in the future, they'll be notified of the changes.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveDraft}
              className="flex-1 rounded-lg border border-[#d0d0d0] bg-[#f0f0f0] px-4 py-3 text-sm font-medium text-[#333] hover:bg-[#e0e0e0]"
            >
              💾 Save draft
            </button>
            <button
              onClick={submitAchievement}
              disabled={!validateForm()}
              className="flex-1 rounded-lg bg-[#1f77d4] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              ✓ Submit
            </button>
            <button
              onClick={resetForm}
              className="flex-1 rounded-lg border border-[#d32f2f] bg-white px-4 py-3 text-sm font-medium text-[#d32f2f] hover:bg-[#ffebee]"
            >
              ✕ Clear
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/45 z-50">
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f5e9] mx-auto">
              <span className="text-xl">✓</span>
            </div>
            <h3 className="mb-2 font-medium text-[#222]">{successMsg}</h3>
            <p className="mb-4 text-xs text-[#666]">
              {successMsg === "Achievement submitted"
                ? "Your achievement has been recorded and sent to HR for review."
                : "Your draft has been saved. You can continue editing anytime."}
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full rounded-lg bg-[#1f77d4] px-4 py-2 text-sm font-medium text-white hover:bg-[#1565b8]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Commitments Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="font-medium text-[#222]">Your commitments</h3>
                <p className="text-xs text-[#999] mt-1">{COMMIT_LABELS[selectedLevel!]}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-xl text-[#999]">✕</button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {levelCommits.map((commit) => (
                <div key={commit.id} className="mb-2 rounded-lg border border-[#e0e0e0] bg-[#f9f9f9] p-3">
                  <p className="m-0 text-xs text-[#333]">{commit.statement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogAchievement;
