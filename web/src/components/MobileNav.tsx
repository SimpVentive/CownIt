import type { Role } from "@/lib/types";
import { NAV_MAP } from "./Sidebar";

interface MobileNavProps {
  activeRole: Role;
  activePage: string;
  onPageChange: (page: string) => void;
}

function MobileNav({ activeRole, activePage, onPageChange }: MobileNavProps) {
  const navItems = NAV_MAP[activeRole];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[64px] items-center justify-around border-t border-[#e0e0e0] bg-white md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.page;
        return (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-[11px] font-medium transition-colors"
            style={{ color: isActive ? "#000" : "#999" }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
            <span>{item.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MobileNav;
