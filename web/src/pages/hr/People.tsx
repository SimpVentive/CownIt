import { useState, useEffect } from "react";
import type { AppData } from "@/lib/types";
import { formatDate } from "@/lib/utilsApp";

interface HrPeopleProps {
  data: AppData;
  onSelectPerson: (personId: string) => void;
}

const COLORS = {
  ink: "#171B21",
  card: "#FCFCFA",
  line: "#DEDFD5",
  brass: "#B8863B",
  highBg: "#E1F0E6",
  highFg: "#1B7350",
  highSolid: "#2E9E6B",
  goodBg: "#E0E9F4",
  goodFg: "#1F4E8C",
  goodSolid: "#3B75C4",
  modBg: "#F6E9D2",
  modFg: "#96650E",
  modSolid: "#C08A2E",
  lowBg: "#F7E4DE",
  lowFg: "#8A3420",
  lowSolid: "#C4472A",
};

interface PersonScore {
  id: string;
  name: string;
  initials: string;
  department: string;
  score: number | null;
  lastUpdate: string | null;
  status: string;
}

function HrPeople({ data, onSelectPerson }: HrPeopleProps) {
  const [radarSvg, setRadarSvg] = useState<string>("");
  const [modalType, setModalType] = useState<"commits" | "achievements" | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const TODAY = new Date();

  const totalPeople = data.people.length;

  // Calculate ownership index for each person
  const personScores: PersonScore[] = data.people.map((person) => {
    const personAchievements = data.achievements.filter((a) => a.personId === person.id);
    const lastUpdate = [...(data.monthlyUpdates ?? []), ...personAchievements.map((a) => ({ date: a.date }))].sort(
      (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    const score =
      personAchievements.length > 0
        ? personAchievements.reduce((sum, a) => sum + a.impactRating, 0) / personAchievements.length
        : null;

    const hasUpdate = (data.monthlyUpdates ?? []).some(
      (u) =>
        u.personId === person.id &&
        u.month === currentMonth &&
        u.year === currentYear
    );

    return {
      id: person.id,
      name: person.name,
      initials: person.initials,
      department: person.department,
      score,
      lastUpdate: lastUpdate?.date || null,
      status: hasUpdate ? "current" : "overdue",
    };
  });

  const updatedCount = personScores.filter((p) => p.status === "current").length;
  const avgScore = personScores
    .filter((p) => p.score !== null)
    .reduce((sum, p) => sum + (p.score || 0), 0) / Math.max(1, personScores.filter((p) => p.score !== null).length);

  const getBand = (score: number | null) => {
    if (score === null) return { key: "empty", label: "No data", color: COLORS.line };
    if (score >= 8) return { key: "high", label: "High", color: COLORS.highSolid };
    if (score >= 6) return { key: "good", label: "Medium", color: COLORS.goodSolid };
    return { key: "low", label: "Low", color: COLORS.lowSolid };
  };

  const bands = [
    { key: "empty", label: "No data", range: "—" },
    { key: "low", label: "Low", range: "0–5" },
    { key: "good", label: "Medium", range: "6–7" },
    { key: "high", label: "High", range: "8–10" },
  ];

  const counts = bands.map((bd) => personScores.filter((p) => getBand(p.score).key === bd.key).length);
  const maxCount = Math.max(...counts, 1);

  // Rolling coverage computation
  const computeRollingCoverage = () => {
    const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
    const results = [];
    for (let w = 1; w <= 6; w++) {
      const count = personScores.filter((p) => {
        if (!p.lastUpdate) return false;
        const ageInWeeks = (TODAY.getTime() - new Date(p.lastUpdate).getTime()) / MS_PER_WEEK;
        return ageInWeeks <= w;
      }).length;
      results.push({ weeks: w, count, pct: Math.round((count / totalPeople) * 100) });
    }
    return results;
  };

  const coverage = computeRollingCoverage();

  // Generate coverage SVG
  useEffect(() => {
    const generateChart = () => {
      const W = 380,
        H = 150,
        padL = 22,
        padR = 10,
        padT = 16,
        padB = 26;
      const plotW = W - padL - padR,
        plotH = H - padT - padB;
      const maxV = totalPeople;
      const x = (i: number) => padL + i * (plotW / (coverage.length - 1));
      const y = (v: number) => padT + plotH - (v / maxV) * plotH;
      const data = coverage.map((c) => c.count);

      let svgContent = `<svg width="100%" height="150" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">`;

      // Gridlines
      for (let v = 0; v <= maxV; v++) {
        svgContent += `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" stroke="#E8E9E0" stroke-width="1"/>`;
      }

      // Step line
      let pathD = `M ${x(0)} ${y(data[0])}`;
      for (let i = 1; i < data.length; i++) {
        pathD += ` L ${x(i)} ${y(data[i - 1])} L ${x(i)} ${y(data[i])}`;
      }
      const areaD = pathD + ` L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
      svgContent += `<path d="${areaD}" fill="rgba(184,134,59,0.14)"/>`;
      svgContent += `<path d="${pathD}" fill="none" stroke="#B8863B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

      // Dots and labels
      coverage.forEach((c, i) => {
        svgContent += `<circle cx="${x(i)}" cy="${y(c.count)}" r="3.5" fill="#fff" stroke="#B8863B" stroke-width="2"/>`;
        svgContent += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle" font-size="9.5" font-family="IBM Plex Mono, monospace" fill="#8A8F94">${c.weeks}w</text>`;
      });

      svgContent += `</svg>`;
      setRadarSvg(svgContent);
    };

    generateChart();
  }, [coverage]);

  const selectedPerson = selectedPersonId ? data.people.find((p) => p.id === selectedPersonId) : null;
  const personCommits = selectedPersonId ? data.commits.filter((c) => c.personId === selectedPersonId) : [];
  const personAchievements = selectedPersonId ? data.achievements.filter((a) => a.personId === selectedPersonId) : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.card }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: COLORS.card,
          borderRight: `1px solid #E8E9E0`,
          padding: "20px 12px",
          display: "none",
          "@media (min-width: 768px)": { display: "block" },
        }}
      />

      {/* Main */}
      <div style={{ flex: 1, padding: "32px clamp(20px, 3vw, 44px) 60px" }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: "600", fontSize: "26px", margin: "0 0 4px" }}>
          People
        </h1>
        <p style={{ color: "#4B5158", fontSize: "13.5px", margin: "0 0 24px" }}>
          Commitment health across your team — who's on track, and who needs a nudge.
        </p>

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", padding: "18px 20px" }}>
            <div style={{ fontSize: "12.5px", color: "#4B5158", marginBottom: "10px" }}>Total people</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "6px" }}>
              {totalPeople}
            </div>
            <div style={{ fontSize: "12px", color: "#4B5158" }}>Enrolled in the programme</div>
          </div>

          <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", padding: "18px 20px" }}>
            <div style={{ fontSize: "12.5px", color: "#4B5158", marginBottom: "10px" }}>Updated this month</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "6px", color: COLORS.highFg }}>
              {updatedCount}
            </div>
            <div style={{ fontSize: "12px", color: "#4B5158" }}>of {totalPeople} people</div>
          </div>

          <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", padding: "18px 20px" }}>
            <div style={{ fontSize: "12.5px", color: "#4B5158", marginBottom: "10px" }}>Avg ownership index</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "6px" }}>
              {isNaN(avgScore) ? "—" : avgScore.toFixed(1)}
            </div>
            <div style={{ fontSize: "12px", color: "#4B5158" }}>out of 10, self-rated</div>
          </div>

          <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "12.5px", color: "#4B5158", marginBottom: "10px" }}>Overdue</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: "32px", fontWeight: "600", marginBottom: "6px", color: COLORS.lowSolid }}>
                {totalPeople - updatedCount}
              </div>
              <div style={{ fontSize: "12px", color: "#4B5158" }}>Need a nudge this month</div>
            </div>
            <button style={{ fontFamily: "Inter, sans-serif", fontSize: "11.5px", fontWeight: "600", color: "#fff", background: COLORS.ink, border: "none", padding: "8px 12px", borderRadius: "999px", cursor: "pointer", marginTop: "12px" }}>
              Send reminders →
            </button>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "18px", marginBottom: "24px" }}>
          {/* Distribution Chart */}
          <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", padding: "22px" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", fontWeight: "600", marginBottom: "2px" }}>
              Ownership Index distribution
            </div>
            <div style={{ fontSize: "12px", color: "#4B5158", marginBottom: "16px" }}>
              CPQSDP average per person · Low 0–5, Medium 6–7, High 8–10
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", height: "150px" }}>
              {bands.map((bd, idx) => {
                const c = counts[idx];
                const h = c === 0 ? 4 : Math.max(18, (c / maxCount) * 120);
                const colorMap: Record<string, string> = {
                  empty: COLORS.line,
                  low: COLORS.lowSolid,
                  good: COLORS.goodSolid,
                  high: COLORS.highSolid,
                };

                return (
                  <div key={bd.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "13px", fontWeight: "700", marginBottom: "6px", color: colorMap[bd.key] }}>
                      {c}
                    </div>
                    <div style={{ width: "100%", maxWidth: "52px", height: `${h}px`, borderRadius: "7px 7px 3px 3px", background: colorMap[bd.key], opacity: c === 0 ? 0.25 : 1 }} />
                    <div style={{ fontSize: "11px", color: "#4B5158", marginTop: "9px", textAlign: "center" }}>
                      {bd.label}
                      <br />
                      {bd.range}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend Chart */}
          <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", padding: "22px" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "16px", fontWeight: "600", marginBottom: "2px" }}>
              Update coverage by window
            </div>
            <div style={{ fontSize: "12px", color: "#4B5158", marginBottom: "16px" }}>
              How many of the {totalPeople} people have updated at least once
            </div>
            <div dangerouslySetInnerHTML={{ __html: radarSvg }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: COLORS.card, border: "1px solid #E8E9E0", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontSize: "11.5px", fontWeight: "700", letterSpacing: "0.03em", textTransform: "uppercase", color: "#4B5158", padding: "16px 18px", borderBottom: `1px solid #E8E9E0` }}>
                    Name
                  </th>
                  <th style={{ textAlign: "left", fontSize: "11.5px", fontWeight: "700", letterSpacing: "0.03em", textTransform: "uppercase", color: "#4B5158", padding: "16px 18px", borderBottom: `1px solid #E8E9E0` }}>
                    Last update
                  </th>
                  <th style={{ textAlign: "left", fontSize: "11.5px", fontWeight: "700", letterSpacing: "0.03em", textTransform: "uppercase", color: "#4B5158", padding: "16px 18px", borderBottom: `1px solid #E8E9E0` }}>
                    Ownership Index
                  </th>
                  <th style={{ textAlign: "left", fontSize: "11.5px", fontWeight: "700", letterSpacing: "0.03em", textTransform: "uppercase", color: "#4B5158", padding: "16px 18px", borderBottom: `1px solid #E8E9E0` }}>
                    Status
                  </th>
                  <th style={{ textAlign: "left", fontSize: "11.5px", fontWeight: "700", letterSpacing: "0.03em", textTransform: "uppercase", color: "#4B5158", padding: "16px 18px", borderBottom: `1px solid #E8E9E0` }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {personScores.map((p) => {
                  const bd = getBand(p.score);
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid #E8E9E0` }}>
                      <td style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: "11px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: COLORS.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "IBM Plex Mono, monospace", fontSize: "11.5px", fontWeight: "600" }}>
                          {p.initials}
                        </div>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{p.name}</span>
                      </td>
                      <td style={{ padding: "16px 18px", color: p.lastUpdate ? "inherit" : COLORS.lowSolid, fontWeight: p.lastUpdate ? "normal" : "600", fontSize: "13px" }}>
                        {p.lastUpdate ? new Date(p.lastUpdate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Never"}
                      </td>
                      <td style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: "700", fontSize: "13px", width: "52px" }}>
                          {p.score === null ? "No data" : p.score.toFixed(1) + "/10"}
                        </span>
                        <div style={{ width: "100px", height: "6px", borderRadius: "99px", background: p.score === null ? "transparent" : "#E8E9E0", border: p.score === null ? "1px dashed #E8E9E0" : "none", overflow: "hidden" }}>
                          {p.score !== null && (
                            <div style={{ height: "100%", width: `${(p.score / 10) * 100}%`, background: bd.color, borderRadius: "99px" }} />
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "16px 18px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "700", padding: "5px 13px", borderRadius: "999px", background: p.status === "current" ? COLORS.highBg : COLORS.lowBg, color: p.status === "current" ? COLORS.highFg : COLORS.lowFg }}>
                          {p.status === "current" ? "Current" : "Overdue"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 18px" }}>
                        <button
                          onClick={() => onSelectPerson(p.id)}
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12.5px",
                            fontWeight: "600",
                            color: "#fff",
                            background: COLORS.ink,
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals for detail view (from earlier feature) */}
      {modalType === "commits" && selectedPersonId && (
        <div style={{ position: "fixed", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: "50", padding: "16px" }}>
          <div style={{ width: "100%", maxWidth: "640px", maxHeight: "396px", overflowY: "auto", borderRadius: "8px", background: "white", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid #E8E9E0", position: "sticky", top: "0", background: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0", fontWeight: "600" }}>
                  {data.people.find((p) => p.id === selectedPersonId)?.name}'s Commitments
                </h3>
                <button onClick={() => setModalType(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>
                  ✕
                </button>
              </div>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {personCommits.length > 0 ? (
                personCommits.map((commit) => (
                  <div key={commit.id} style={{ borderRadius: "8px", border: "1px solid #E8E9E0", background: "#F9F9F9", padding: "16px" }}>
                    <div style={{ marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>
                      {commit.statement}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {formatDate(commit.createdAt)} • {commit.level.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", paddingY: "32px", color: "#999" }}>No commitments yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HrPeople;
