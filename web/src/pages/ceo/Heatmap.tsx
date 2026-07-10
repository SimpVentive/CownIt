import { useState } from "react";
import type { AppData, Dim } from "@/lib/types";

interface HeatmapProps {
  data: AppData;
}

interface DetailEntry {
  issue: string;
  action: string;
  owner: string;
  due: string;
}

function Heatmap({ data }: HeatmapProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const DIMS: Array<{ k: Dim; label: string }> = [
    { k: "C", label: "Cost" },
    { k: "P", label: "Productivity" },
    { k: "Q", label: "Quality" },
    { k: "S", label: "Safety" },
    { k: "D", label: "Delivery" },
    { k: "O", label: "People" },
  ];

  // Calculate scores for each person
  const personScores = data.people.map((person) => {
    const personAchievements = data.achievements.filter((a) => a.personId === person.id);
    const scores: Record<Dim, number | null> = {
      C: null,
      P: null,
      Q: null,
      S: null,
      D: null,
      O: null,
    };

    DIMS.forEach((dim) => {
      const dimAchievements = personAchievements.filter((a) => a.cpqsdp.includes(dim.k));
      if (dimAchievements.length > 0) {
        scores[dim.k] =
          dimAchievements.reduce((sum, a) => sum + a.impactRating, 0) / dimAchievements.length;
      }
    });

    return { name: person.name, scores };
  });

  // Calculate org average
  const orgAvg = { name: "Org avg", scores: {} as Record<Dim, number | null> };
  DIMS.forEach((dim) => {
    const scoredPeople = personScores.filter((p) => p.scores[dim.k] !== null);
    if (scoredPeople.length > 0) {
      orgAvg.scores[dim.k] =
        scoredPeople.reduce((sum, p) => sum + (p.scores[dim.k] || 0), 0) / scoredPeople.length;
    } else {
      orgAvg.scores[dim.k] = null;
    }
  });

  const tier = (v: number | null) => {
    if (v === null || v === undefined) return null;
    if (v >= 8) return "success";
    if (v >= 6) return "accent";
    if (v >= 4) return "warning";
    return "danger";
  };

  const fmt = (v: number | null) => (v === null ? "—" : (Math.round(v * 10) / 10).toString());

  // Generate detail data
  const generateDetails = (): Record<string, DetailEntry> => {
    const details: Record<string, DetailEntry> = {};

    personScores.forEach((person) => {
      DIMS.forEach((dim) => {
        const score = person.scores[dim.k];
        if (score !== null) {
          const key = `${person.name}-${dim.k}`;
          details[key] = {
            issue: `${person.name} achieved a ${score.toFixed(1)}/10 score in ${dim.label} based on logged achievements.`,
            action: `Review achievement details and provide feedback to ${person.name}.`,
            owner: person.name,
            due: "—",
          };
        }
      });
    });

    // Add org avg details for missing data
    DIMS.forEach((dim) => {
      const scoredCount = personScores.filter((p) => p.scores[dim.k] !== null).length;
      if (scoredCount < personScores.length) {
        const key = `${orgAvg.name}-${dim.k}`;
        details[key] = {
          issue: `Only ${scoredCount} of ${personScores.length} team members have reported ${dim.label} data.`,
          action: `Send a reminder to the ${personScores.length - scoredCount} team members who haven't reported yet.`,
          owner: "You",
          due: "Jul 11",
        };
      }
    });

    return details;
  };

  const details = generateDetails();
  const selectedDetail = selectedKey ? details[selectedKey] : null;

  const shadeMap: Record<string, string> = {
    success: "#639922",
    accent: "#185fa5",
    warning: "#ef9f27",
    danger: "#a32d2d",
  };

  const textColorMap: Record<string, string> = {
    success: "#ffffff",
    accent: "#ffffff",
    warning: "#1c1c1a",
    danger: "#ffffff",
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", background: "#ffffff", border: "0.5px solid #dedcd3", borderRadius: "12px", padding: "1.5rem" }}>
      <p style={{ fontSize: "20px", fontWeight: "500", margin: "0 0 1.25rem" }}>Impact heatmap</p>

      <div style={{ overflowX: "auto", padding: "14px 6px 22px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "110px repeat(6, 1fr)",
            gap: "10px 8px",
            minWidth: "620px",
            transform: "rotateX(8deg)",
            transformStyle: "preserve-3d",
            transformOrigin: "center top",
            transition: "transform 0.3s",
          }}
        >
          {/* Header row */}
          <div />
          {DIMS.map((dim) => (
            <div
              key={dim.k}
              title={dim.label}
              style={{
                fontSize: "12px",
                color: "#5f5e5a",
                textAlign: "center",
                padding: "6px 4px",
              }}
            >
              {dim.k}
            </div>
          ))}

          {/* Person rows */}
          {personScores.map((person) => (
            <div key={person.name}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 6px",
                }}
              >
                {person.name}
              </div>
              {DIMS.map((dim) => {
                const v = person.scores[dim.k];
                const t = tier(v);
                const key = `${person.name}-${dim.k}`;
                const hasDetail = !!details[key];

                let boxStyle: React.CSSProperties = {
                  textAlign: "center",
                  padding: "12px 4px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: hasDetail ? "pointer" : "default",
                  transition: "transform 0.12s ease",
                };

                if (t) {
                  boxStyle.background = shadeMap[t];
                  boxStyle.color = textColorMap[t];
                  boxStyle.boxShadow = "3px 3px 0 #1c1c1a";
                } else {
                  boxStyle.background = "#f4f3ef";
                  boxStyle.color = "#888780";
                  boxStyle.border = "0.5px solid #dedcd3";
                  boxStyle.boxShadow = "2px 2px 0 #c7c5ba";
                }

                const isSelected = selectedKey === key;

                return (
                  <div
                    key={`${person.name}-${dim.k}`}
                    style={{
                      ...boxStyle,
                      transform: isSelected ? "translate(1px, 2px) !important" : t ? "translate(-2px, -3px)" : "translate(0, 0)",
                    }}
                    onClick={() => {
                      if (hasDetail) {
                        setSelectedKey(isSelected ? null : key);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (t && !isSelected) {
                        (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -3px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (t && !isSelected) {
                        (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
                      }
                    }}
                  >
                    {fmt(v)}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Org average row */}
          <div style={{ borderTop: "0.5px solid #c7c5ba", marginTop: "6px", paddingTop: "12px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                padding: "0 6px",
              }}
            >
              {orgAvg.name}
            </div>
          </div>
          {DIMS.map((dim) => {
            const v = orgAvg.scores[dim.k];
            const t = tier(v);
            const key = `${orgAvg.name}-${dim.k}`;
            const hasDetail = !!details[key];
            const isSelected = selectedKey === key;

            let boxStyle: React.CSSProperties = {
              textAlign: "center",
              padding: "12px 4px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: hasDetail ? "pointer" : "default",
              transition: "transform 0.12s ease",
              borderTop: "0.5px solid #c7c5ba",
              marginTop: "6px",
              paddingTop: "12px",
            };

            if (t) {
              boxStyle.background = shadeMap[t];
              boxStyle.color = textColorMap[t];
              boxStyle.boxShadow = "3px 3px 0 #1c1c1a";
            } else {
              boxStyle.background = "#f4f3ef";
              boxStyle.color = "#888780";
              boxStyle.border = "0.5px solid #dedcd3";
              boxStyle.boxShadow = "2px 2px 0 #c7c5ba";
            }

            return (
              <div
                key={`${orgAvg.name}-${dim.k}`}
                style={{
                  ...boxStyle,
                  transform: isSelected ? "translate(1px, 2px) !important" : t ? "translate(-2px, -3px)" : "translate(0, 0)",
                }}
                onClick={() => {
                  if (hasDetail) {
                    setSelectedKey(isSelected ? null : key);
                  }
                }}
                onMouseEnter={(e) => {
                  if (t && !isSelected) {
                    (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -3px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (t && !isSelected) {
                    (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
                  }
                }}
              >
                {fmt(v)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", margin: "0.5rem 0 1rem", fontSize: "12px", color: "#5f5e5a" }}>
        <span>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", verticalAlign: "-1px", marginRight: "5px", background: "#639922" }} />
          8-10 high
        </span>
        <span>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", verticalAlign: "-1px", marginRight: "5px", background: "#185fa5" }} />
          6-7 good
        </span>
        <span>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", verticalAlign: "-1px", marginRight: "5px", background: "#ef9f27" }} />
          4-5 moderate
        </span>
        <span>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", verticalAlign: "-1px", marginRight: "5px", background: "#a32d2d" }} />
          1-3 low
        </span>
        <span>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", verticalAlign: "-1px", marginRight: "5px", background: "#f4f3ef", border: "0.5px solid #dedcd3" }} />
          no data
        </span>
      </div>

      {/* Detail Panel */}
      {selectedDetail && (
        <div
          style={{
            background: "#f4f3ef",
            border: "0.5px solid #dedcd3",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            boxShadow: "4px 4px 0 #c7c5ba",
          }}
        >
          {selectedKey && (
            <>
              <p style={{ fontSize: "12px", color: "#888780", margin: "0 0 4px" }}>
                {selectedKey}
              </p>
              <p style={{ fontSize: "14px", color: "#1c1c1a", margin: "0 0 12px", lineHeight: "1.6" }}>
                <span style={{ color: "#5f5e5a" }}>Issue — </span>
                {selectedDetail.issue}
              </p>
              <p style={{ fontSize: "14px", color: "#1c1c1a", margin: "0 0 12px", lineHeight: "1.6" }}>
                <span style={{ color: "#5f5e5a" }}>Action — </span>
                {selectedDetail.action}
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#ffffff", borderRadius: "6px", padding: "4px 10px", color: "#5f5e5a" }}>
                  Owner: {selectedDetail.owner}
                </span>
                <span style={{ fontSize: "12px", background: "#ffffff", borderRadius: "6px", padding: "4px 10px", color: "#5f5e5a" }}>
                  Due: {selectedDetail.due}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Heatmap;
