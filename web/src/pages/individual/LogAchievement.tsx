import { useState } from "react";
import { Upload } from "lucide-react";
import type { AppData, Achievement, CommitLevel, Dim } from "@/lib/types";
import { COMMIT_LEVELS, COMMIT_LABELS, CPQSDP_DIMS } from "@/lib/utilsApp";

interface LogAchievementProps {
  data: AppData;
  currentUserId: string;
  onDataChange: <K extends keyof AppData>(entity: K, newArray: AppData[K]) => void;
}

interface FormErrors {
  title?: string;
  level?: string;
  commit?: string;
  evidence?: string;
  dims?: string;
  rating?: string;
}

function LogAchievement({ data, currentUserId, onDataChange }: LogAchievementProps) {
  const [title, setTitle] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<CommitLevel | null>(null);
  const [selectedCommitId, setSelectedCommitId] = useState<string>("");
  const [evidence, setEvidence] = useState<string>("");
  const [selectedDims, setSelectedDims] = useState<Dim[]>([]);
  const [impactRating, setImpactRating] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState<boolean>(false);

  const userCommits = data.commits.filter((c) => c.personId === currentUserId);
  const levelCommits = selectedLevel ? userCommits.filter((c) => c.level === selectedLevel) : [];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!selectedLevel) newErrors.level = "Select a commitment level";
    if (!selectedCommitId) newErrors.commit = "Select a commit";
    if (!evidence.trim()) newErrors.evidence = "Evidence is required";
    if (selectedDims.length === 0) newErrors.dims = "Select at least one dimension";
    if (!impactRating) newErrors.rating = "Select an impact rating";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !impactRating) return;

    const newAchievement: Achievement = {
      id: "a" + Date.now(),
      personId: currentUserId,
      commitId: selectedCommitId,
      title: title.trim(),
      evidence: evidence.trim(),
      cpqsdp: selectedDims,
      impactRating,
      date: new Date().toISOString(),
      fileAttachment: fileName || null,
    };

    onDataChange("achievements", [...data.achievements, newAchievement]);

    setTitle("");
    setSelectedLevel(null);
    setSelectedCommitId("");
    setEvidence("");
    setSelectedDims([]);
    setImpactRating(null);
    setFileName("");
    setErrors({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const errorText = (msg?: string) =>
    msg ? <div className="mt-1 text-xs text-[#dc3545]">{msg}</div> : null;

  return (
    <div className="max-w-[600px]">
      <h2 className="mb-6 text-lg font-medium">Log achievement</h2>

      {/* Title */}
      <div className="mb-5">
        <label className="mb-2 block text-[13px] font-medium">What did you achieve?</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title"
          className="w-full rounded-lg border px-3 py-2.5 text-[13px] outline-none focus:border-[#999]"
          style={{ borderColor: errors.title ? "#dc3545" : "#e0e0e0" }}
        />
        {errorText(errors.title)}
      </div>

      {/* Commitment level */}
      <div className="mb-5">
        <label className="mb-2 block text-[13px] font-medium">Commitment level</label>
        <div className="flex gap-2">
          {COMMIT_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedCommitId("");
              }}
              className="flex-1 rounded-lg border border-[#e0e0e0] px-2 py-2.5 text-[13px]"
              style={{
                backgroundColor: selectedLevel === level ? "#000" : "#f5f5f5",
                color: selectedLevel === level ? "#fff" : "#000",
              }}
            >
              {COMMIT_LABELS[level]}
            </button>
          ))}
        </div>
        {errorText(errors.level)}
      </div>

      {/* Linked commit */}
      {selectedLevel && (
        <div className="mb-5">
          <label className="mb-2 block text-[13px] font-medium">Select a commit</label>
          <select
            value={selectedCommitId}
            onChange={(e) => setSelectedCommitId(e.target.value)}
            className="w-full rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none"
            style={{ borderColor: errors.commit ? "#dc3545" : "#e0e0e0" }}
          >
            <option value="">Choose a commit...</option>
            {levelCommits.map((commit) => (
              <option key={commit.id} value={commit.id}>
                {commit.statement.substring(0, 50)}...
              </option>
            ))}
          </select>
          {errorText(errors.commit)}
        </div>
      )}

      {/* Evidence */}
      <div className="mb-5">
        <label className="mb-2 block text-[13px] font-medium">Evidence / notes</label>
        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="What happened, when, who was involved, outcome..."
          className="min-h-[80px] w-full resize-y rounded-lg border px-3 py-2.5 text-[13px] outline-none focus:border-[#999]"
          style={{ borderColor: errors.evidence ? "#dc3545" : "#e0e0e0" }}
        />
        {errorText(errors.evidence)}
      </div>

      {/* File */}
      <div className="mb-5">
        <label className="mb-2 block text-[13px] font-medium">File attachment (optional)</label>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="hidden"
            />
            <span className="flex items-center gap-2 rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2.5 text-[13px]">
              <Upload size={16} />
              Choose file
            </span>
          </label>
          {fileName && <span className="text-[13px] text-[#666]">{fileName}</span>}
        </div>
      </div>

      {/* CPQSDP dimensions */}
      <div className="mb-5">
        <label className="mb-2 block text-[13px] font-medium">Impact dimensions</label>
        <div className="flex flex-wrap gap-2">
          {CPQSDP_DIMS.map((dim) => {
            const selected = selectedDims.includes(dim.key);
            return (
              <button
                key={dim.key}
                onClick={() =>
                  setSelectedDims(
                    selected
                      ? selectedDims.filter((d) => d !== dim.key)
                      : [...selectedDims, dim.key]
                  )
                }
                className="rounded-lg border px-3 py-2 text-xs"
                style={{
                  backgroundColor: selected ? dim.color : "#f5f5f5",
                  color: selected ? "#fff" : "#000",
                  borderColor: selected ? dim.color : "#e0e0e0",
                }}
              >
                {dim.key} — {dim.label}
              </button>
            );
          })}
        </div>
        {errorText(errors.dims)}
      </div>

      {/* Impact rating */}
      <div className="mb-6">
        <label className="mb-2 block text-[13px] font-medium">Impact rating</label>
        <div className="flex flex-wrap gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setImpactRating(num)}
              className="h-8 w-8 rounded-lg border border-[#e0e0e0] text-xs"
              style={{
                backgroundColor: impactRating === num ? "#000" : "#f5f5f5",
                color: impactRating === num ? "#fff" : "#000",
              }}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-[#999]">
          1–3 Minor · 4–6 Moderate · 7–8 Significant · 9–10 Transformational
        </div>
        {errorText(errors.rating)}
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-[#d4edda] p-3 text-[13px] text-[#28a745]">
          Achievement saved
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full rounded-lg bg-black py-3 text-[13px] font-medium text-white"
      >
        Save achievement
      </button>
    </div>
  );
}

export default LogAchievement;
