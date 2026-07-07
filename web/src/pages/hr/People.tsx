import type { AppData } from "@/lib/types";
import { computeHealthScore, formatDateShort } from "@/lib/utilsApp";

interface HrPeopleProps {
  data: AppData;
  onSelectPerson: (personId: string) => void;
}

function HrPeople({ data, onSelectPerson }: HrPeopleProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const peopleData = data.people.map((person) => {
    const score = computeHealthScore(person.id, data);
    const hasUpdate = data.monthlyUpdates.some(
      (u) => u.personId === person.id && u.month === currentMonth && u.year === currentYear
    );
    const lastUpdate = [...data.monthlyUpdates]
      .filter((u) => u.personId === person.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

    return { ...person, score, hasUpdate, lastUpdate };
  });

  const updatedCount = peopleData.filter((p) => p.hasUpdate).length;
  const avgScore =
    peopleData.length > 0
      ? Math.round(peopleData.reduce((sum, p) => sum + p.score, 0) / peopleData.length)
      : 0;

  const stats = [
    { label: "Total people", value: String(data.people.length), color: "#000" },
    { label: "Updated this month", value: String(updatedCount), color: "#28a745" },
    { label: "Overdue", value: String(data.people.length - updatedCount), color: "#dc3545" },
    { label: "Avg health score", value: String(avgScore), color: "#000" },
  ];

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium">People</h2>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#e0e0e0] bg-white p-4">
            <div className="mb-2 text-xs text-[#666]">{stat.label}</div>
            <div className="text-2xl font-medium" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#e0e0e0] text-left">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Department</th>
              <th className="p-3 font-medium">Last update</th>
              <th className="p-3 font-medium">Health score</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {peopleData.map((person) => (
              <tr key={person.id} className="border-b border-[#e0e0e0]">
                <td className="p-3">{person.name}</td>
                <td className="p-3">{person.department}</td>
                <td className="p-3">
                  {person.lastUpdate ? formatDateShort(person.lastUpdate.updatedAt) : "Never"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span>{person.score}/100</span>
                    <div className="h-1 w-[60px] overflow-hidden rounded-sm bg-[#e0e0e0]">
                      <div
                        className="h-full"
                        style={{
                          width: `${person.score}%`,
                          backgroundColor:
                            person.score >= 75 ? "#28a745" : person.score >= 50 ? "#007bff" : "#dc3545",
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span
                    className="inline-block rounded-lg px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: person.hasUpdate ? "#d4edda" : "#f8d7da",
                      color: person.hasUpdate ? "#28a745" : "#dc3545",
                    }}
                  >
                    {person.hasUpdate ? "Current" : "Overdue"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onSelectPerson(person.id)}
                    className="rounded-lg bg-black px-3 py-1.5 text-xs text-white"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HrPeople;
