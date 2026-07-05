import type { Role } from "@/lib/types";

interface TopBarProps {
  activeRole: Role;
  loginRole: Role;
  userName: string;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
}

const ROLES: { value: Role; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "hr", label: "HR" },
  { value: "ceo", label: "CEO" },
];

function TopBar({ activeRole, loginRole, userName, onRoleChange, onLogout }: TopBarProps) {
  const showSwitcher = loginRole !== "individual";

  return (
    <div className="flex items-center justify-between border-b border-[#e0e0e0] bg-white px-4 py-4 sm:px-6">
      <h1 className="text-lg font-medium text-black">
        <span style={{ color: "#0B1F3A" }}>Cown</span>
        <span style={{ color: "#2E7D32" }}>It</span>
      </h1>

      {showSwitcher && (
        <div className="flex gap-2">
          {ROLES.map((role) => {
            const isActive = activeRole === role.value;
            return (
              <button
                key={role.value}
                onClick={() => onRoleChange(role.value)}
                className="rounded-lg border border-[#e0e0e0] px-3 py-2 text-[13px] transition-colors sm:px-4"
                style={{
                  backgroundColor: isActive ? "#000" : "#f5f5f5",
                  color: isActive ? "#fff" : "#000",
                }}
              >
                {role.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-[13px] text-[#666] sm:block">{userName}</div>
        <button
          onClick={onLogout}
          className="rounded-lg border border-[#dc3545] px-3 py-2 text-xs text-[#dc3545] transition-colors hover:bg-[#dc3545] hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopBar;
