import { useState, useEffect } from "react";
import type { AppData, Dim } from "@/lib/types";
import { CPQSDP_DIMS, formatDate } from "@/lib/utilsApp";

interface DashboardProps {
  data: AppData;
}

const COLORS = {
  ink: "#171B21",
  paper: "#EEEFE8",
  card: "#FCFCFA",
  line: "#DEDFD5",
  brass: "#B8863B",
  cost: "#6C4FA1",
  productivity: "#1F8A5F",
  quality: "#6B7A2A",
  safety: "#C4472A",
  delivery: "#2560B0",
  people: "#B8863B",
};

function Dashboard({ data }: DashboardProps) {
  const [radarSvg, setRadarSvg] = useState<string>("");
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalPeople = data.people.length;
  const totalAchievements = data.achievements.length;
  const updatedCount = data.people.filter((p) =>
    (data.monthlyUpdates ?? []).some(
      (u) =>
        u.personId === p.id &&
        u.month === currentMonth &&
        u.year === currentYear
    )
  ).length;

  const uniqueDepts = new Set(data.people.map((p) => p.department)).size;

  const cpqsdpScore = (dim: Dim): number | null => {
    const withDim = data.achievements.filter((a) => a.cpqsdp.includes(dim));
    if (withDim.length === 0) return null;
    return (
      withDim.reduce((sum, a) => sum + a.impactRating, 0) / withDim.length
    );
  };

  const avgImpact =
    totalAchievements > 0
      ? (
          data.achievements.reduce((sum, a) => sum + a.impactRating, 0) /
          totalAchievements
        ).toFixed(1)
      : null;

  const ownershipIndex =
    totalAchievements > 0
      ? (
          CPQSDP_DIMS.filter((d) => cpqsdpScore(d.key as Dim) !== null)
            .map((d) => cpqsdpScore(d.key as Dim) || 0)
            .reduce((a, b) => a + b, 0) /
          CPQSDP_DIMS.filter((d) => cpqsdpScore(d.key as Dim) !== null).length
        ).toFixed(1)
      : "0.0";

  const recentAchievements = [...data.achievements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Generate radar chart SVG
  useEffect(() => {
    const generateRadar = () => {
      const cx = 140,
        cy = 120,
        maxR = 88,
        n = 6;
      const angle = (i: number) => -Math.PI / 2 + i * ((2 * Math.PI) / n);
      const pt = (i: number, val: number) => [
        cx + val * (maxR / 10) * Math.cos(angle(i)),
        cy + val * (maxR / 10) * Math.sin(angle(i)),
      ];

      const metrics = CPQSDP_DIMS.map((d) => ({
        name: d.key,
        value: cpqsdpScore(d.key as Dim),
        color: d.color,
      }));

      let svgContent = `<svg width="280" height="260" viewBox="0 0 280 260" xmlns="http://www.w3.org/2000/svg">`;

      // Rings
      [2, 4, 6, 8, 10].forEach((v) => {
        const pts = metrics
          .map((m, i) => pt(i, v).join(","))
          .join(" ");
        svgContent += `<polygon points="${pts}" fill="none" stroke="${
          v === 10 ? "#DEDFD5" : "#E8E9E0"
        }" stroke-width="1"/>`;
      });

      // Axes + labels
      metrics.forEach((m, i) => {
        const [x, y] = pt(i, 10);
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#E8E9E0"/>`;

        const lx = cx + (maxR + 26) * Math.cos(angle(i));
        const ly = cy + (maxR + 18) * Math.sin(angle(i));
        svgContent += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="10.5" font-family="Inter, sans-serif" font-weight="600" fill="#4B5158">${m.name.toUpperCase()}</text>`;
      });

      // Filled shape
      const shapePts = metrics.map((m, i) => pt(i, m.value ? m.value : 0));
      svgContent += `<polygon points="${shapePts
        .map((p) => p.join(","))
        .join(" ")}" fill="rgba(184,134,59,0.14)" stroke="#B8863B" stroke-width="2" stroke-linejoin="round"/>`;

      // Vertices
      metrics.forEach((m, i) => {
        const [x, y] = shapePts[i];
        if (m.value === null) {
          svgContent += `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="#C4472A" stroke-width="2" stroke-dasharray="2,2"/>`;
        } else {
          svgContent += `<circle cx="${x}" cy="${y}" r="4" fill="#B8863B" stroke="#fff" stroke-width="1.5"/>`;
        }
      });

      svgContent += `</svg>`;
      setRadarSvg(svgContent);
    };

    generateRadar();
  }, [data]);

  const deptColor: Record<string, { bg: string; fg: string }> = {
    Operations: { bg: "#E3F2FD", fg: "#1565B8" },
    Quality: { bg: "#EAF0DC", fg: "#5A6621" },
    Safety: { bg: "#FCE4EC", fg: "#C2185B" },
    HR: { bg: "#FFF3E0", fg: "#E65100" },
    "People & Culture": { bg: "#F6E9D2", fg: "#96650E" },
  };

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh", padding: "32px clamp(16px, 4vw, 56px) 80px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
            Executive dashboard
          </h1>
        </div>
        <p style={{ color: "#4B5158", fontSize: "14.5px", margin: "0 0 28px" }}>
          How the organization is committing, delivering, and owning outcomes this quarter.
        </p>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px", marginBottom: "28px" }}>
          {/* Ownership Index Card */}
          <div
            style={{
              background: COLORS.ink,
              color: "#fff",
              borderRadius: "14px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)", marginBottom: "18px" }}>
                Ownership index
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div style={{ position: "relative", width: "118px", height: "118px", flexShrink: 0 }}>
                  <svg width="118" height="118" viewBox="0 0 118 118" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="59" cy="59" r="50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
                    <circle
                      cx="59"
                      cy="59"
                      r="50"
                      fill="none"
                      stroke="#EADFC7"
                      strokeWidth="10"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: `${Math.PI * 100}`,
                        strokeDashoffset: `${Math.PI * 100 * (1 - parseFloat(ownershipIndex) / 10)}`,
                      }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600" }}>
                      {ownershipIndex}
                    </div>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                      / 10
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", marginBottom: "6px" }}>
                    Ahead of target
                  </div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
                    Composite of CPQSDP pillars. Target for Q3 was 7.5.
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "22px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "rgba(255,255,255,0.65)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M7 12L11 16L17 8" stroke="#7BC79A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <b style={{ color: "#fff", fontWeight: "600" }}>Trending up</b> vs. last month
              </span>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <div style={{ background: COLORS.card, border: `1px solid #E8E9E0`, borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "12.5px", color: "#4B5158" }}>
                <span>People committed</span>
                <span style={{ color: "#1F8A5F", background: "#E4F1E9", padding: "2px 7px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                  +{totalPeople - 1}
                </span>
              </div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "8px" }}>
                {totalPeople}
              </div>
              <div style={{ fontSize: "12px", color: "#4B5158" }}>Across {uniqueDepts} departments</div>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid #E8E9E0`, borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "12.5px", color: "#4B5158" }}>
                <span>Achievements logged</span>
                <span style={{ color: "#1F8A5F", background: "#E4F1E9", padding: "2px 7px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                  +{Math.max(0, totalAchievements - 2)}
                </span>
              </div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "8px" }}>
                {totalAchievements}
              </div>
              <div style={{ fontSize: "12px", color: "#4B5158" }}>Since programme start</div>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid #E8E9E0`, borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "12.5px", color: "#4B5158" }}>
                <span>Avg. impact score</span>
                <span style={{ color: "#4B5158", background: "#E8E9E0", padding: "2px 7px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                  ±0.0
                </span>
              </div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "8px" }}>
                {avgImpact || "—"}
              </div>
              <div style={{ fontSize: "12px", color: "#4B5158" }}>Self-rated, out of 10</div>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid #E8E9E0`, borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)", gridColumn: "span 2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", fontSize: "12.5px", color: "#4B5158" }}>
                <span>Updated this month</span>
                <span style={{ color: "#C4472A", background: "#F7E4DE", padding: "2px 7px", borderRadius: "999px", fontSize: "11px", fontWeight: "600" }}>
                  {updatedCount} / {totalPeople}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: "18px", fontWeight: "600" }}>
                    {updatedCount === 0 ? "No one has updated yet" : `${updatedCount} have updated`}
                  </div>
                  <div style={{ fontSize: "12px", color: "#4B5158", marginTop: "4px" }}>
                    {updatedCount === 0 ? "Send a reminder before the month closes" : "Keep the momentum going"}
                  </div>
                </div>
                <button style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: "600", color: "#fff", background: COLORS.ink, border: "none", padding: "8px 13px", borderRadius: "999px", cursor: "pointer" }}>
                  Nudge →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CPQSDP Section */}
        <div style={{ background: COLORS.card, border: `1px solid #E8E9E0`, borderRadius: "14px", boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)", padding: "24px", marginBottom: "28px" }}>
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", fontWeight: "600", marginBottom: "4px" }}>
              CPQSDP impact scores
            </div>
            <div style={{ fontSize: "12.5px", color: "#4B5158" }}>
              Cost · Productivity · Quality · Safety · Delivery · People
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "32px" }}>
            {/* Radar */}
            <div dangerouslySetInnerHTML={{ __html: radarSvg }} />

            {/* Metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
              {CPQSDP_DIMS.map((dim) => {
                const score = cpqsdpScore(dim.key as Dim);
                const pct = score ? (score / 10) * 100 : 0;

                return (
                  <div key={dim.key} style={{ display: "grid", gridTemplateColumns: "130px 1fr 60px", alignItems: "center", gap: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13.5px", fontWeight: "600" }}>
                      <div
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          background: dim.color,
                          flexShrink: 0,
                        }}
                      />
                      {dim.label}
                    </div>
                    <div style={{ height: "6px", background: "#E8E9E0", borderRadius: "99px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: dim.color,
                          borderRadius: "99px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "13px", fontWeight: "600", textAlign: "right" }}>
                      {score ? score.toFixed(1) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: "20px", fontWeight: "600", marginBottom: "4px" }}>
            Recent achievements
          </div>
          <div style={{ fontSize: "12.5px", color: "#4B5158" }}>
            Latest commitments marked complete and self-rated for impact
          </div>
        </div>

        <div style={{ background: COLORS.card, border: `1px solid #E8E9E0`, borderRadius: "14px", boxShadow: "0 1px 2px rgba(23,27,33,0.04), 0 8px 24px -12px rgba(23,27,33,0.10)", overflow: "hidden" }}>
          {recentAchievements.length > 0 ? (
            recentAchievements.map((a, idx) => {
              const person = data.people.find((p) => p.id === a.personId);
              const dc = deptColor[person?.department || "Operations"] || { bg: "#F5F5F5", fg: "#666" };
              const band = a.impactRating >= 9 ? "gold" : a.impactRating >= 7 ? "green" : "amber";
              const bandColor =
                band === "gold" ? { bg: "#EADFC7", color: "#8A611E" } : band === "green" ? { bg: "#E1F0E6", color: "#1B7350" } : { bg: "#F6E9D2", color: "#96650E" };

              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 22px",
                    borderBottom: idx < recentAchievements.length - 1 ? `1px solid #E8E9E0` : "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F6F5EF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: COLORS.ink,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: "11.5px",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    {person?.initials || "—"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "600", fontSize: "14.5px", marginBottom: "3px" }}>
                      {a.title}
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#4B5158", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span>By {person?.name} · {formatDate(a.date)}</span>
                      <span style={{ fontSize: "10.5px", fontWeight: "600", padding: "2px 8px", borderRadius: "999px", ...dc }}>
                        {person?.department}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "#EADFC7",
                      color: COLORS.brass,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: "700", fontSize: "13px", padding: "6px 12px", borderRadius: "999px", ...bandColor, flexShrink: 0 }}>
                    {a.impactRating}/10
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: "32px", textAlign: "center", color: "#4B5158", fontSize: "14px" }}>
              No achievements logged yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
