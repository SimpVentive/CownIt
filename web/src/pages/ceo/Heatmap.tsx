import { Fragment } from "react";
import type { AppData, Dim } from "@/lib/types";
import { CPQSDP_DIMS, CPQSDP_LABELS } from "@/lib/utilsApp";

interface HeatmapProps {
  data: AppData;
}

function getColor(score: number | null): { bg: string; text: string } {
  if (score === null) return { bg: "#f5f5f5", text: "#999" };
  if (score >= 8) return { bg: "#e8f5e9", text: "#2e7d32" };
  if (score >= 6) return { bg: "#e3f2fd", text: "#1565c0" };
  if (score >= 4) return { bg: "#fff3e0", text: "#e65100" };
  return { bg: "#ffebee", text: "#c62828" };
}

function Heatmap({ data }: HeatmapProps) {
  const personDimensionScore = (personId: string, dimension: Dim): number | null => {
    const achievements = data.achievements.filter(
      (a) => a.personId === personId && a.cpqsdp.includes(dimension)
    );
    if (achievements.length === 0) return null;
    return parseFloat(
      (achievements.reduce((sum, a) => sum + a.impactRating, 0) / achievements.length).toFixed(1)
    );
  };

  const orgAvg = (dimension: Dim): number | null => {
    const achievements = data.achievements.filter((a) => a.cpqsdp.includes(dimension));
    if (achievements.length === 0) return null;
    return parseFloat(
      (achievements.reduce((sum, a) => sum + a.impactRating, 0) / achievements.length).toFixed(1)
    );
  };

  const legend = [
    { bg: "#e8f5e9", label: "8–10 High" },
    { bg: "#e3f2fd", label: "6–7 Good" },
    { bg: "#fff3e0", label: "4–5 Moderate" },
    { bg: "#ffebee", label: "1–3 Low" },
  ];

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">Impact heatmap</h2>

      <div className="overflow-x-auto rounded-xl border border-[#e0e0e0] bg-white p-4">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "auto repeat(6, minmax(48px, 1fr))" }}
        >
          {/* Header */}
          <div />
          {CPQSDP_DIMS.map((dim) => (
            <div
              key={dim.key}
              className="p-2 text-center text-[11px] font-medium text-[#666]"
              title={dim.label}
            >
              {dim.key}
            </div>
          ))}

          {/* Person rows */}
          {data.people.map((person) => (
            <Fragment key={person.id}>
              <div className="p-2 text-xs">{person.name.split(" ")[0]}</div>
              {CPQSDP_DIMS.map((dim) => {
                const score = personDimensionScore(person.id, dim.key);
                const color = getColor(score);
                return (
                  <div
                    key={`${person.id}-${dim.key}`}
                    className="flex min-h-[28px] items-center justify-center rounded px-1 py-3 text-[11px] font-medium"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {score ?? "—"}
                  </div>
                );
              })}
            </Fragment>
          ))}

          {/* Separator */}
          <div className="col-span-full h-px bg-[#e0e0e0]" />

          {/* Org avg row */}
          <div className="p-2 text-xs font-medium">Org avg</div>
          {CPQSDP_DIMS.map((dim) => {
            const score = orgAvg(dim.key);
            const color = getColor(score);
            return (
              <div
                key={`avg-${dim.key}`}
                className="flex min-h-[28px] items-center justify-center rounded px-1 py-3 text-[11px] font-semibold"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                {score ?? "—"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded border border-[#e0e0e0]"
              style={{ backgroundColor: item.bg }}
            />
            <span className="text-[#666]">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-[#999]">
        {CPQSDP_DIMS.map((d, i) => (
          <span key={d.key}>
            {d.key} = {CPQSDP_LABELS[d.key]}
            {i < CPQSDP_DIMS.length - 1 ? " · " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Heatmap;
